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
        with patch.object(
            AccountService,
            "get_member_accounts",
            return_value=[{"id": "1", "address": self.member.address}],
        ):
            res = self.client.get(f"/api/v1/accounts/member/{self.member.address}")
            self.assertEqual(res.status_code, 200)
            self.assertIsInstance(res.get_json(), list)

    def test_get_member_accounts_invalid_address(self):
        res = self.client.get("/api/v1/accounts/member/invalid_address")
        self.assertEqual(res.status_code, 400)

    def test_get_member_accounts_empty(self):
        with patch.object(AccountService, "get_member_accounts", return_value=[]):
            res = self.client.get(f"/api/v1/accounts/member/{self.member.address}")
            self.assertEqual(res.status_code, 404)
            self.assertEqual(res.get_json(), [])

    def test_get_member_accounts_server_error(self):
        with patch.object(
            AccountService, "get_member_accounts", side_effect=Exception("DB Error")
        ):
            res = self.client.get(f"/api/v1/accounts/member/{self.member.address}")
            self.assertEqual(res.status_code, 500)
