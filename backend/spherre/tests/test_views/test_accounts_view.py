import unittest
from unittest.mock import patch
from uuid import uuid4

from spherre.app import create_app, db
from spherre.app.models import Member
from spherre.app.service.account import AccountService


class TestAccountViews(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()

        self.member = Member(
            id=str(uuid4()), email="test@example.com", address="0x" + "1" * 64
        )
        db.session.add(self.member)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_get_member_accounts_valid(self):
        # Create multiple accounts for the member
        for i in range(3):
            AccountService.create_account(
                address=f"0x123445678901234567890123456789012345678{i}",
                name=f"Account {i}",
                description=f"Description {i}",
                threshold=1,
                members=[
                    self.member.address,
                    f"0x1234456789012345678901234567890123456789{i}",
                ],
            )
        res = self.client.get(f"/api/v1/accounts/member/{self.member.address}")
        self.assertEqual(res.status_code, 200)
        self.assertIsInstance(res.json, list)
        data = res.json
        self.assertEqual(len(data), 3)
        self.assertEqual(
            data[0]["address"], f"0x123445678901234567890123456789012345678{0}"
        )
        self.assertEqual(
            data[1]["address"], f"0x123445678901234567890123456789012345678{1}"
        )
        self.assertEqual(
            data[2]["address"], f"0x123445678901234567890123456789012345678{2}"
        )

    def test_get_member_accounts_invalid_address(self):
        res = self.client.get("/api/v1/accounts/member/invalid_address")
        self.assertEqual(res.status_code, 400)

    def test_get_member_accounts_empty(self):
        res = self.client.get(f"/api/v1/accounts/member/{self.member.address}")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json(), [])

    def test_get_member_accounts_server_error(self):
        with patch.object(
            AccountService, "get_member_accounts", side_effect=Exception("DB Error")
        ):
            res = self.client.get(f"/api/v1/accounts/member/{self.member.address}")
            self.assertEqual(res.status_code, 500)
