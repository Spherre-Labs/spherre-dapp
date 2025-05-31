from unittest import TestCase

from spherre.app import create_app
from spherre.app.extensions import db
from spherre.app.models.account import Account, Member
from spherre.app.service.account import AccountService


class TestAccountService(TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_create_account(self):
        AccountService.create_account(
            address="0x123",
            name="Test Account",
            threshold=1.0,
            members=["0x456", "0x789"],
            description="This is a test account",
        )
        account = Account.query.filter_by(address="0x123").one_or_none()
        assert account is not None
        assert account.name == "Test Account"
        assert account.threshold == 1.0
        assert account.description == "This is a test account"

    def test_get_account_by_address(self):
        AccountService.create_account(
            address="0x123",
            name="Test Account",
            threshold=1.0,
            members=["0x456", "0x789"],
            description="This is a test account",
        )
        account = AccountService.get_account_by_address("0x123")
        assert account is not None
        assert account.address == "0x123"

    def test_get_account_members(self):
        AccountService.create_account(
            address="0x123",
            name="Test Account",
            threshold=1.0,
            members=["0x456", "0x789"],
            description="This is a test account",
        )
        members = AccountService.get_account_members("0x123")
        assert len(members) == 2
        assert all(member.address in ["0x456", "0x789"] for member in members)

    def test_get_all_accounts(self):
        AccountService.create_account(
            address="0x123",
            name="Test Account",
            threshold=1.0,
            members=["0x456", "0x789"],
            description="This is a test account",
        )
        accounts = AccountService.get_all_accounts()
        assert len(accounts) > 0
        assert any(account.address == "0x123" for account in accounts)

    def test_get_member_accounts(self):
        AccountService.create_account(
            address="0x123",
            name="Test Account",
            threshold=1.0,
            members=["0x456", "0x789"],
            description="This is a test account",
        )
        member = Member.get_or_create(address="0x456")
        accounts = AccountService.get_member_accounts(member.address)
        assert len(accounts) > 0
        assert any(account.address == "0x123" for account in accounts)

    def test_add_member_to_account(self):
        AccountService.create_account(
            address="0x123",
            name="Test Account",
            threshold=1.0,
            members=["0x456"],
            description="This is a test account",
        )
        account = AccountService.add_member_to_account("0x123", "0x789")
        assert account is not None
        assert len(account.members) == 2
        assert any(member.address == "0x789" for member in account.members)

    def test_remove_member_from_account(self):
        AccountService.create_account(
            address="0x123",
            name="Test Account",
            threshold=1.0,
            members=["0x456", "0x789"],
            description="This is a test account",
        )
        account = AccountService.remove_member_from_account("0x123", "0x456")
        assert account is not None
        assert len(account.members) == 1
        assert all(member.address != "0x456" for member in account.members)

    def test_update_account_threshold(self):
        AccountService.create_account(
            address="0x123",
            name="Test Account",
            threshold=1.0,
            members=["0x456", "0x789"],
            description="This is a test account",
        )
        account = AccountService.update_account_threshold("0x123", 2.0)
        assert account is not None
        assert account.threshold == 2.0

    def test_update_account_description(self):
        AccountService.create_account(
            address="0x123",
            name="Test Account",
            threshold=1.0,
            members=["0x456", "0x789"],
            description="This is a test account",
        )
        account = AccountService.update_account_description(
            "0x123", "Updated description"
        )
        assert account is not None
        assert account.description == "Updated description"

    def test_update_account_name(self):
        AccountService.create_account(
            address="0x123",
            name="Test Account",
            threshold=1.0,
            members=["0x456", "0x789"],
            description="This is a test account",
        )
        account = AccountService.update_account_name("0x123", "Updated Account Name")
        assert account is not None
        assert account.name == "Updated Account Name"

    def test_update_account_is_private(self):
        AccountService.create_account(
            address="0x123",
            name="Test Account",
            threshold=1.0,
            members=["0x456", "0x789"],
            description="This is a test account",
        )
        account = AccountService.toggle_account_privacy("0x123")
        assert account is not None
        assert account.is_private is False
        account = AccountService.toggle_account_privacy("0x123")
        assert account is not None
        assert account.is_private is True
