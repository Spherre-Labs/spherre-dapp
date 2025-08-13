import unittest
from unittest.mock import patch
from uuid import uuid4

from spherre.app import create_app, db
from spherre.app.models import Account, Member, Notification, NotificationType
from spherre.app.service.notification import NotificationService


class TestNotificationViews(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()

        # Create a member and account
        self.member = Member(
            id=str(uuid4()), email="test@example.com", address="0x" + "1" * 64
        )
        self.account = Account(
            id=str(uuid4()), address="0x" + "2" * 64, name="Test Account"
        )
        db.session.add(self.member)
        db.session.add(self.account)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def create_notification(
        self, title="Test Title", message="Test Message", read_by=None
    ):
        notif = Notification(
            id=str(uuid4()),
            account_id=self.account.id,
            notification_type=NotificationType.TRANSACTION,
            title=title,
            message=message,
        )
        if read_by:
            notif.read_by.extend(read_by)
        db.session.add(notif)
        db.session.commit()
        return notif

    def test_get_notifications_success(self):
        # Create notifications
        self.create_notification(title="Notif 1")
        self.create_notification(title="Notif 2")

        res = self.client.get(f"/api/v1/accounts/{self.account.address}/notifications")
        self.assertEqual(res.status_code, 200)

        data = res.get_json()
        self.assertIn("notifications", data)
        self.assertEqual(len(data["notifications"]), 2)
        self.assertEqual(data["pagination"]["total"], 2)

    def test_get_notifications_with_pagination(self):
        for i in range(5):
            self.create_notification(title=f"Notif {i}")

        res = self.client.get(
            f"/api/v1/accounts/{self.account.address}/notifications?page=1&per_page=2"
        )
        self.assertEqual(res.status_code, 200)

        data = res.get_json()
        self.assertEqual(len(data["notifications"]), 2)
        self.assertEqual(data["pagination"]["pages"], 3)

    def test_get_notifications_unread_only(self):
        # Create one read and one unread notification
        _read_notif = self.create_notification(
            title="Read Notif", read_by=[self.member]
        )
        _unread_notif = self.create_notification(title="Unread Notif")

        res = self.client.get(
            f"/api/v1/accounts/{self.account.address}/notifications?unread_only=true&member_id={self.member.id}"
        )
        self.assertEqual(res.status_code, 200)

        data = res.get_json()
        self.assertEqual(len(data["notifications"]), 1)
        self.assertEqual(data["notifications"][0]["title"], "Unread Notif")

    def test_get_notifications_invalid_pagination(self):
        res = self.client.get(
            f"/api/v1/accounts/{self.account.address}/notifications?page=0&per_page=-5"
        )
        self.assertEqual(res.status_code, 400)

    def test_get_notifications_account_not_found(self):
        res = self.client.get(f"/api/v1/accounts/{uuid4()}/notifications")
        self.assertEqual(res.status_code, 404)

    def test_get_notifications_server_error(self):
        with patch.object(
            NotificationService,
            "list_notifications_by_account",
            side_effect=Exception("DB Error"),
        ):
            res = self.client.get(
                f"/api/v1/accounts/{self.account.address}/notifications"
            )
            self.assertEqual(res.status_code, 500)
