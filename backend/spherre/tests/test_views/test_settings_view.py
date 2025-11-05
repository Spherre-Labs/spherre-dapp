import unittest
from uuid import uuid4

from flask_jwt_extended import create_access_token

from spherre.app import create_app, db
from spherre.app.models import Account, Member


class TestSettingsViews(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()

        # Create a member and account
        self.member_with_email = Member(
            id=str(uuid4()), email="test@example.com", address="0x" + "1" * 64
        )
        self.member_without_email = Member(id=str(uuid4()), address="0x" + "3" * 64)
        self.account = Account(
            id=str(uuid4()), address="0x" + "2" * 64, name="Test Account"
        )
        db.session.add(self.member_with_email)
        db.session.add(self.member_without_email)
        db.session.add(self.account)
        self.account.members.append(self.member_without_email)
        self.account.members.append(self.member_with_email)
        db.session.add(self.account)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_add_member_email(self):
        # mock authentication
        token = create_access_token(identity=self.member_without_email.address)

        headers = {"Authorization": f"Bearer {token}"}

        res = self.client.post(
            f"/api/v1/accounts/{self.account.address}/settings/email/add",
            json={"email": "testemail@testemail.com"},
            headers=headers,
        )
        self.assertEqual(res.status_code, 201)
        member = (
            db.session.query(Member).filter_by(id=self.member_without_email.id).first()
        )

        self.assertIsNotNone(member)
        self.assertEqual(member.email, "testemail@testemail.com")

    def test_update_member_email(self):
        # mock authentication
        token = create_access_token(identity=self.member_with_email.address)

        headers = {"Authorization": f"Bearer {token}"}

        res = self.client.post(
            f"/api/v1/accounts/{self.account.address}/settings/email/update",
            json={"email": "testemail@testemail.com"},
            headers=headers,
        )
        self.assertEqual(res.status_code, 201)
        member = (
            db.session.query(Member).filter_by(id=self.member_with_email.id).first()
        )

        self.assertIsNotNone(member)
        self.assertEqual(member.email, "testemail@testemail.com")

    def test_notification_preference_toggle(self):
        # mock authentication
        token = create_access_token(identity=self.member_with_email.address)

        headers = {"Authorization": f"Bearer {token}"}
        res = self.client.post(
            f"/api/v1/accounts/{self.account.address}/settings/email/notification/toggle",
            json={},
            headers=headers,
        )
        self.assertEqual(res.status_code, 201)
