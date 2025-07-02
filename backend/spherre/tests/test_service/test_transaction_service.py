from datetime import datetime, timedelta
from unittest import TestCase

from spherre.app import create_app
from spherre.app.extensions import db
from spherre.app.models.account import Account, Member
from spherre.app.models.transaction import (
    TransactionStatus,
    TransactionType,
)
from spherre.app.service.transaction import TransactionService


class TestTransactionService(TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()

        # Create test account and members
        self.account = Account.create(
            address="0x123",
            name="Test Account",
            threshold=2,
            description="Test description",
        )

        self.member1 = Member.get_or_create(address="0x456")
        self.member2 = Member.get_or_create(address="0x789")
        self.member3 = Member.get_or_create(address="0xabc")

        self.account.members.append(self.member1)
        self.account.members.append(self.member2)
        self.account.members.append(self.member3)
        db.session.commit()

        # Current timestamp for testing
        self.current_time = datetime.now()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_create_transaction(self):
        # Test creating a valid transaction
        transaction = TransactionService.create_transaction(
            transaction_id=1,
            account=self.account,
            status=TransactionStatus.INITIATED,
            type=TransactionType.TOKEN_SEND,
            proposer=self.member1,
            date_proposed=self.current_time,
        )

        assert transaction is not None
        assert transaction.transaction_id == 1
        assert transaction.account_id == self.account.id
        assert transaction.tx_type == TransactionType.TOKEN_SEND
        assert transaction.status == TransactionStatus.INITIATED
        assert transaction.proposer_id == self.member1.id

        # Test with invalid inputs - missing required fields
        with self.assertRaises(ValueError):
            TransactionService.create_transaction(
                transaction_id=None,  # Missing ID
                account=self.account,
                status=TransactionStatus.INITIATED,
                type=TransactionType.TOKEN_SEND,
                proposer=self.member1,
                date_proposed=self.current_time,
            )

        # Test with non-member proposer
        non_member = Member.get_or_create(address="0xdef")
        with self.assertRaises(ValueError):
            TransactionService.create_transaction(
                transaction_id=2,
                account=self.account,
                status=TransactionStatus.INITIATED,
                type=TransactionType.TOKEN_SEND,
                proposer=non_member,
                date_proposed=self.current_time,
            )

    def test_approve_transaction(self):
        # Create a test transaction
        TransactionService.create_transaction(
            transaction_id=1,
            account=self.account,
            status=TransactionStatus.INITIATED,
            type=TransactionType.TOKEN_SEND,
            proposer=self.member1,
            date_proposed=self.current_time,
        )

        # Test approving by a valid member
        updated_transaction = TransactionService.approve_transaction(
            transaction_id=1, account=self.account, member=self.member2
        )

        assert updated_transaction is not None
        assert self.member2 in updated_transaction.approved.all()

        # Test approving by the proposer (should fail)
        with self.assertRaises(ValueError):
            TransactionService.approve_transaction(
                transaction_id=1, account=self.account, member=self.member1
            )

        # Test approving by a non-member (should fail)
        non_member = Member.get_or_create(address="0xdef")
        with self.assertRaises(ValueError):
            TransactionService.approve_transaction(
                transaction_id=1, account=self.account, member=non_member
            )

        # Test approving a non-existent transaction (should fail)
        with self.assertRaises(ValueError):
            TransactionService.approve_transaction(
                transaction_id=999, account=self.account, member=self.member2
            )

        # Test approving an already approved transaction (should fail)
        with self.assertRaises(ValueError):
            TransactionService.approve_transaction(
                transaction_id=1,
                account=self.account,
                member=self.member2,  # Already approved above
            )

    def test_execute_transaction(self):
        # Create a test transaction
        transaction = TransactionService.create_transaction(
            transaction_id=1,
            account=self.account,
            status=TransactionStatus.INITIATED,
            type=TransactionType.TOKEN_SEND,
            proposer=self.member1,
            date_proposed=self.current_time,
        )

        # Approve transaction with enough members to meet threshold
        TransactionService.approve_transaction(1, self.account, self.member2)
        TransactionService.approve_transaction(1, self.account, self.member3)

        # Set transaction status to approved
        # (normally would happen in approve_transaction based on threshold)
        transaction.status = TransactionStatus.APPROVED
        transaction.save()

        # Test executing the transaction
        executed_transaction = TransactionService.execute_transaction(
            transaction_id=1,
            account=self.account,
            executor=self.member2,
            date_executed=self.current_time + timedelta(seconds=100),  # Some time later
            status=TransactionStatus.EXECUTED,
        )

        assert executed_transaction is not None
        assert executed_transaction.status == TransactionStatus.EXECUTED
        assert executed_transaction.executor_id == self.member2.id
        assert executed_transaction.date_executed is not None

        # Test executing a transaction with insufficient approvals (should fail)
        # Create a new transaction
        transaction2 = TransactionService.create_transaction(
            transaction_id=2,
            account=self.account,
            status=TransactionStatus.INITIATED,
            type=TransactionType.TOKEN_SEND,
            proposer=self.member1,
            date_proposed=self.current_time,
        )

        # Approve with only one member, not meeting threshold of 2
        TransactionService.approve_transaction(2, self.account, self.member2)

        # Set status to APPROVED for testing
        transaction2.status = TransactionStatus.APPROVED
        transaction2.save()

        # Should fail due to not meeting threshold
        with self.assertRaises(ValueError):
            TransactionService.execute_transaction(
                transaction_id=2,
                account=self.account,
                executor=self.member2,
                date_executed=self.current_time + timedelta(seconds=100),
                status=TransactionStatus.EXECUTED,
            )

    def test_reject_transaction(self):
        # Create a test transaction
        TransactionService.create_transaction(
            transaction_id=1,
            account=self.account,
            status=TransactionStatus.INITIATED,
            type=TransactionType.TOKEN_SEND,
            proposer=self.member1,
            date_proposed=self.current_time,
        )

        # Test rejecting by a valid member
        updated_transaction = TransactionService.reject_transaction(
            transaction_id=1, account=self.account, member=self.member2
        )

        assert updated_transaction is not None
        assert self.member2 in updated_transaction.rejected.all()

        # Test rejecting a transaction that's already executed (should fail)
        TransactionService.create_transaction(
            transaction_id=2,
            account=self.account,
            status=TransactionStatus.EXECUTED,  # Already executed
            type=TransactionType.TOKEN_SEND,
            proposer=self.member1,
            date_proposed=self.current_time,
        )

        with self.assertRaises(ValueError):
            TransactionService.reject_transaction(
                transaction_id=2, account=self.account, member=self.member2
            )

        # Test rejecting by a non-member (should fail)
        non_member = Member.get_or_create(address="0xdef")
        with self.assertRaises(ValueError):
            TransactionService.reject_transaction(
                transaction_id=1, account=self.account, member=non_member
            )

        # Test rejecting a non-existent transaction (should fail)
        with self.assertRaises(ValueError):
            TransactionService.reject_transaction(
                transaction_id=999, account=self.account, member=self.member2
            )

        # Test rejecting an already rejected transaction (should fail)
        with self.assertRaises(ValueError):
            TransactionService.reject_transaction(
                transaction_id=1,
                account=self.account,
                member=self.member2,  # Already rejected above
            )

    def test_get_transaction(self):
        # Create a test transaction
        transaction = TransactionService.create_transaction(
            transaction_id=1,
            account=self.account,
            status=TransactionStatus.INITIATED,
            type=TransactionType.TOKEN_SEND,
            proposer=self.member1,
            date_proposed=self.current_time,
        )

        # Test retrieving an existing transaction
        retrieved_transaction = TransactionService.get_transaction(
            transaction_id=1, account=self.account
        )

        assert retrieved_transaction is not None
        assert retrieved_transaction.id == transaction.id
        assert retrieved_transaction.transaction_id == 1

        # Test retrieving a non-existent transaction
        non_existent_transaction = TransactionService.get_transaction(
            transaction_id=999, account=self.account
        )

        assert non_existent_transaction is None

    def test_transaction_list(self):
        # Create multiple transactions of different types and statuses
        TransactionService.create_transaction(
            transaction_id=1,
            account=self.account,
            status=TransactionStatus.INITIATED,
            type=TransactionType.TOKEN_SEND,
            proposer=self.member1,
            date_proposed=self.current_time - timedelta(seconds=300),  # Older
        )

        TransactionService.create_transaction(
            transaction_id=2,
            account=self.account,
            status=TransactionStatus.APPROVED,
            type=TransactionType.TOKEN_SEND,
            proposer=self.member1,
            date_proposed=self.current_time - timedelta(seconds=200),
        )

        TransactionService.create_transaction(
            transaction_id=3,
            account=self.account,
            status=TransactionStatus.EXECUTED,
            type=TransactionType.MEMBER_ADD,
            proposer=self.member1,
            date_proposed=self.current_time - timedelta(seconds=100),
        )

        # Test retrieving all transactions
        all_transactions = TransactionService.transaction_list(account=self.account)

        assert len(all_transactions) == 3

        # Test filtering by status
        initiated_transactions = TransactionService.transaction_list(
            account=self.account, status=TransactionStatus.INITIATED
        )

        assert len(initiated_transactions) == 1
        assert all(
            tx.status == TransactionStatus.INITIATED for tx in initiated_transactions
        )

        # Test filtering by type
        token_send_transactions = TransactionService.transaction_list(
            account=self.account, type=TransactionType.TOKEN_SEND
        )

        assert len(token_send_transactions) == 2
        assert all(
            tx.tx_type == TransactionType.TOKEN_SEND for tx in token_send_transactions
        )

        # Test filtering by both status and type
        approved_token_send = TransactionService.transaction_list(
            account=self.account,
            status=TransactionStatus.APPROVED,
            type=TransactionType.TOKEN_SEND,
        )

        assert len(approved_token_send) == 1
        assert approved_token_send[0].status == TransactionStatus.APPROVED
        assert approved_token_send[0].tx_type == TransactionType.TOKEN_SEND
