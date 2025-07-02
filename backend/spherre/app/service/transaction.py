from typing import List, Optional

from spherre.app.models import session_save
from spherre.app.models.account import Account, Member
from spherre.app.models.transaction import (
    Transaction,
    TransactionStatus,
    TransactionType,
)


class TransactionService:
    @classmethod
    def create_transaction(
        cls,
        transaction_id: int,
        account: Account,
        status: TransactionStatus,
        type: TransactionType,
        proposer: Member,
        date_proposed: int,
    ) -> Transaction:
        """
        Create and persist a new transaction record with all required fields.

        Args:
            transaction_id: Unique identifier for the transaction
            account: Account associated with the transaction
            status: Status of the transaction (e.g., INITIATED)
            type: Type of the transaction (e.g., TOKEN_SEND)
            proposer: Member who proposed the transaction
            date_proposed: Timestamp when the transaction was proposed

        Returns:
            Transaction: The newly created transaction

        Raises:
            ValueError: If any required fields are missing or invalid
        """
        if not transaction_id or not account or not status or not type or not proposer:
            raise ValueError("All required fields must be provided")

        if not isinstance(account, Account):
            raise ValueError("account must be an Account instance")

        if not isinstance(proposer, Member):
            raise ValueError("proposer must be a Member instance")

        # Verify proposer is a member of the account
        if proposer not in account.members:
            raise ValueError("Proposer must be a member of the account")

        transaction = Transaction(
            transaction_id=transaction_id,
            account_id=account.id,
            tx_type=type,
            status=status,
            proposer_id=proposer.id,
            date_created=date_proposed,
        )

        transaction.save()
        return transaction

    @classmethod
    def approve_transaction(
        cls, transaction_id: int, account: Account, member: Member
    ) -> Transaction:
        """
        Add an approver to the transaction's approved list.

        Args:
            transaction_id: Unique identifier for the transaction
            account: Account associated with the transaction
            member: Member who is approving the transaction

        Returns:
            Transaction: The updated transaction

        Raises:
            ValueError: If the transaction doesn't exist or member is not valid
            ValueError: If the transaction is not in an approvable state
        """
        if not isinstance(account, Account):
            raise ValueError("account must be an Account instance")

        if not isinstance(member, Member):
            raise ValueError("member must be a Member instance")

        # Find the transaction
        transaction = Transaction.query.filter_by(
            transaction_id=transaction_id, account_id=account.id
        ).one_or_none()

        if not transaction:
            raise ValueError(
                f"Transaction with ID {transaction_id} not found for this account"
            )

        # Verify member is part of the account
        if member not in account.members:
            raise ValueError("Member must belong to the account")

        # Check if transaction is in an approvable state
        if transaction.status != TransactionStatus.INITIATED:
            raise ValueError(
                f"Transaction is in {transaction.status} state and cannot be approved"
            )

        # Check if member is not already an approver
        if member in transaction.approved.all():
            raise ValueError("Member has already approved this transaction")

        # Check if member is not the proposer (optional rule, depends on business logic)
        if transaction.proposer_id == member.id:
            raise ValueError(
                "Transaction proposer cannot approve their own transaction"
            )

        # Add member to approved list
        transaction.approved.append(member)

        session_save()
        return transaction

    @classmethod
    def execute_transaction(
        cls,
        transaction_id: int,
        account: Account,
        executor: Member,
        date_executed: int,
        status: TransactionStatus,
    ) -> Transaction:
        """
        Execute a transaction by updating its status and recording execution details.

        Args:
            transaction_id: Unique identifier for the transaction
            account: Account associated with the transaction
            executor: Member who is executing the transaction
            date_executed: Timestamp when the transaction was executed
            status: New status for the transaction (should be EXECUTED)

        Returns:
            Transaction: The updated transaction

        Raises:
            ValueError: If the transaction doesn't exist or cannot be executed
        """
        if not isinstance(account, Account):
            raise ValueError("account must be an Account instance")

        if not isinstance(executor, Member):
            raise ValueError("executor must be a Member instance")

        # Find the transaction
        transaction = Transaction.query.filter_by(
            transaction_id=transaction_id, account_id=account.id
        ).one_or_none()

        if not transaction:
            raise ValueError(
                f"Transaction with ID {transaction_id} not found for this account"
            )

        # Verify executor is part of the account
        if executor not in account.members:
            raise ValueError("Executor must belong to the account")

        # Check if transaction is in a state that can be executed
        if transaction.status != TransactionStatus.APPROVED:
            raise ValueError(
                f"Transaction is in {transaction.status} state and cannot be executed"
            )

        # Check if enough approvals based on account threshold
        approval_count = transaction.approved.count()
        if approval_count < account.threshold:
            raise ValueError(
                (
                    f"Not enough approvals to execute. Got {approval_count}"
                    f", need {account.threshold}"
                )
            )

        # Update transaction status and executor
        transaction.status = status
        transaction.executor_id = executor.id
        transaction.date_executed = date_executed

        transaction.save()
        return transaction

    @classmethod
    def reject_transaction(
        cls, transaction_id: int, account: Account, member: Member
    ) -> Transaction:
        """
        Add a rejector to the transaction's rejected list.

        Args:
            transaction_id: Unique identifier for the transaction
            account: Account associated with the transaction
            member: Member who is rejecting the transaction

        Returns:
            Transaction: The updated transaction

        Raises:
            ValueError: If the transaction doesn't exist or member is not valid
            ValueError: If the transaction is not in a rejectable state
        """
        if not isinstance(account, Account):
            raise ValueError("account must be an Account instance")

        if not isinstance(member, Member):
            raise ValueError("member must be a Member instance")

        # Find the transaction
        transaction = Transaction.query.filter_by(
            transaction_id=transaction_id, account_id=account.id
        ).one_or_none()

        if not transaction:
            raise ValueError(
                f"Transaction with ID {transaction_id} not found for this account"
            )

        # Verify member is part of the account
        if member not in account.members:
            raise ValueError("Member must belong to the account")

        # Check if transaction is in a rejectable state
        if transaction.status not in [
            TransactionStatus.INITIATED,
            TransactionStatus.APPROVED,
        ]:
            raise ValueError(
                f"Transaction is in {transaction.status} state and cannot be rejected"
            )

        # Check if member is not already a rejector
        if member in transaction.rejected.all():
            raise ValueError("Member has already rejected this transaction")

        # Add member to rejected list
        transaction.rejected.append(member)

        # If enough rejections (e.g., more than a certain threshold), update status
        # This is business logic that should be clarified with requirements
        rejection_count = transaction.rejected.count()
        member_count = len(account.members)

        # Example: if more than half of members reject,
        # transaction is considered rejected
        if rejection_count > member_count / 2:
            transaction.status = TransactionStatus.REJECTED

        session_save()
        return transaction

    @classmethod
    def get_transaction(
        cls, transaction_id: int, account: Account
    ) -> Optional[Transaction]:
        """
        Retrieve a single transaction by its unique identifier.

        Args:
            transaction_id: Unique identifier for the transaction
            account: Account associated with the transaction

        Returns:
            Transaction or None: The transaction if found, None otherwise

        Raises:
            ValueError: If account is not valid
        """
        if not isinstance(account, Account):
            raise ValueError("account must be an Account instance")

        return Transaction.query.filter_by(
            transaction_id=transaction_id, account_id=account.id
        ).one_or_none()

    @classmethod
    def transaction_list(
        cls,
        account: Account,
        status: Optional[TransactionStatus] = None,
        type: Optional[TransactionType] = None,
    ) -> List[Transaction]:
        """
        Retrieve a list of transactions, with optional filters.

        Args:
            account: Account associated with the transactions
            status: Filter by transaction status (optional)
            type: Filter by transaction type (optional)

        Returns:
            List[Transaction]: List of matching transactions

        Raises:
            ValueError: If account is not valid
        """
        if not isinstance(account, Account):
            raise ValueError("account must be an Account instance")

        # Start with base query for account's transactions
        query = Transaction.query.filter_by(account_id=account.id)

        # Apply filters if provided
        if status:
            query = query.filter_by(status=status)

        if type:
            query = query.filter_by(tx_type=type)

        # Order by creation date (most recent first)
        return query.order_by(Transaction.date_created.desc()).all()
