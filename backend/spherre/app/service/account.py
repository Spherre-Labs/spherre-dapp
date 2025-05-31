from spherre.app.models import session_save
from spherre.app.models.account import Account, Member


class AccountService:
    @classmethod
    def create_account(
        cls,
        address: str,
        name: str,
        threshold: float,
        members: list[str],
        description: str = None,
    ) -> Account:
        """
        Create an account.
        Loop through the members and add it to the many-to-many
        field of the account
        """
        account = Account.create(
            name=name, threshold=threshold, description=description, address=address
        )
        for member_address in members:
            member = Member.get_or_create(address=member_address)
            account.members.append(member)
        session_save()  # save the member addition action
        return account

    @classmethod
    def get_account_by_address(cls, address: str) -> Account | None:
        """
        Get an account by it's address
        """
        return Account.query.filter_by(address=address).one_or_none()
    @classmethod
    def get_account_members(
        cls,
        address: str
    ) -> list[Member]:
        """
        Get the members of an account by it's address
        """
        account = Account.query.filter_by(address=address).one_or_none()
        if not account:
            return []
        return account.members
    @classmethod
    def get_all_accounts(cls) -> list[Account]:
        """
        Get all accounts
        """
        return Account.query.all()
    @classmethod
    def get_member_accounts(
        cls,
        address: str
    ) -> list[Account]:
        """
        Get all accounts that a member is part of
        """
        member = Member.query.filter_by(address=address).one_or_none()
        if not member:
            return []
        return member.accounts
    @classmethod
    def add_member_to_account(
        cls,
        account_address: str, member_address: str
    ) -> Account | None:
        """
        Add a member to an account
        """
        account = Account.query.filter_by(address=account_address).one_or_none()
        if not account:
            return None
        member = Member.get_or_create(address=member_address)
        account.members.append(member)
        session_save()
        return account
    @classmethod
    def remove_member_from_account(
        cls,
        account_address: str, member_address: str
    ) -> Account | None:
        """
        Remove a member from an account
        """
        account = Account.query.filter_by(address=account_address).one_or_none()
        if not account:
            return None
        member = Member.query.filter_by(address=member_address).one_or_none()
        if not member:
            return None
        account.members.remove(member)
        session_save()
        return account
    @classmethod
    def update_account_threshold(
        cls,
        account_address: str, new_threshold: float
    ) -> Account | None:
        """
        Update the threshold of an account
        """
        account = Account.query.filter_by(address=account_address).one_or_none()
        if not account:
            return None
        account.threshold = new_threshold
        account.save()
        return account
    @classmethod
    def update_account_description(
        cls,
        account_address: str, new_description: str
    ) -> Account | None:
        """
        Update the description of an account
        """
        account = Account.query.filter_by(address=account_address).one_or_none()
        if not account:
            return None
        account.description = new_description
        account.save()
        return account
    @classmethod
    def update_account_name(
        cls,
        account_address: str, new_name: str
    ) -> Account | None:
        """
        Update the name of an account
        """
        account = Account.query.filter_by(address=account_address).one_or_none()
        if not account:
            return None
        account.name = new_name
        account.save()
        return account
    @classmethod
    def toggle_account_privacy(
        cls,
        account_address: str,
    ) -> Account | None:
        """
        Toggle the privacy of an account
        """
        account = Account.query.filter_by(address=account_address).one_or_none()
        if not account:
            return None
        account.is_private = not account.is_private
        account.save()
        return account
    @classmethod
    def get_account_threshold(
        cls,
        account_address: str
    ) -> float | None:
        """
        Get the threshold of an account
        """
        account = Account.query.filter_by(address=account_address).one_or_none()
        if not account:
            return None
        return account.threshold
    @classmethod
    def is_account_member(
        cls,
        account_address: str, member_address: str
    ) -> bool:
        """
        Check if a member is part of an account
        """
        account = Account.query.filter_by(address=account_address).one_or_none()
        if not account:
            return False
        member = Member.query.filter_by(address=member_address).one_or_none()
        if not member:
            return False
        return member in account.members
    