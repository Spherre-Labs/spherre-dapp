from app.models import session_save
from app.models.account import Account, Member


class AccountService:
    @classmethod
    def create_account(
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
    def get_account_by_address(address: str) -> Account | None:
        """
        Get an account by it's address
        """
        Account.query.filter_by(address=address).one_or_none()
