from unittest import TestCase
from uuid import uuid4

from spherre.app import create_app
from spherre.app.extensions import db
from spherre.app.models import Notification, NotificationType, Member
from spherre.app.service.notification import (
    create_notification,
    send_notification_to_members,
    mark_notification_as_read,
    list_notifications_by_account,
    get_notification_by_id,
)


class TestNotificationService(TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()

        # Create account and member for testing
        self.account_id = str(uuid4())
        self.member = Member(id=str(uuid4()), email="test@example.com", name="Tester")
        db.session.add(self.member)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_create_notification(self):
        notification = create_notification(
            db,
            account_id=self.account_id,
            notification_type=NotificationType.ACCOUNT_UPDATE,
            title="Test Notification",
            message="This is a test.",
        )
        self.assertIsNotNone(notification.id)
        self.assertEqual(notification.title, "Test Notification")

    def test_send_notification_to_members(self):
        notification = create_notification(
            db,
            account_id=self.account_id,
            notification_type=NotificationType.TRANSACTION,
            title="Payment",
            message="You've received a payment.",
        )

        # Test will not fail since mock_send_email prints instead of sending
        send_notification_to_members(db, notification.id, [self.member.id])

    def test_mark_notification_as_read(self):
        notification = create_notification(
            db,
            account_id=self.account_id,
            notification_type=NotificationType.NFT_TRANSFER,
            title="NFT Update",
            message="You sent an NFT.",
        )

        mark_notification_as_read(db, notification.id, self.member.id)
        db.session.refresh(notification)
        self.assertIn(self.member, notification.read_by)

    def test_list_notifications_all(self):
        n1 = create_notification(
            db, self.account_id, NotificationType.TOKEN_TRANSFER, "Transfer 1", "Sent"
        )
        n2 = create_notification(
            db,
            self.account_id,
            NotificationType.TOKEN_TRANSFER,
            "Transfer 2",
            "Received",
        )

        notifications = list_notifications_by_account(db, self.account_id)
        self.assertEqual(len(notifications), 2)

    def test_list_notifications_unread_only(self):
        n1 = create_notification(
            db,
            self.account_id,
            NotificationType.MEMBER_UPDATE,
            "Updated 1",
            "Some info",
        )
        n2 = create_notification(
            db,
            self.account_id,
            NotificationType.MEMBER_UPDATE,
            "Updated 2",
            "Some info",
        )

        # Mark n1 as read
        mark_notification_as_read(db, n1.id, self.member.id)

        unread = list_notifications_by_account(
            db, self.account_id, unread_only=True, member_id=self.member.id
        )
        self.assertEqual(len(unread), 1)
        self.assertEqual(unread[0].id, n2.id)

    def test_get_notification_by_id(self):
        notification = create_notification(
            db,
            account_id=self.account_id,
            notification_type=NotificationType.ACCOUNT_UPDATE,
            title="Welcome",
            message="Thanks for joining!",
        )
        fetched = get_notification_by_id(db, notification.id)
        self.assertIsNotNone(fetched)
        self.assertEqual(fetched.title, "Welcome")

