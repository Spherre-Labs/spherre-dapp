from unittest import TestCase
from uuid import uuid4

from spherre.app import create_app
from spherre.app.extensions import db
from spherre.app.models import Account, Member, Notification, NotificationType
from spherre.app.service.notification import NotificationService


class TestNotificationService(TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()

        # Create account and member for testing
        self.service = NotificationService()
        self.account_id = str(uuid4())
        self.member = Member(
            id=str(uuid4()), email="test@example.com", address="0x0123445"
        )
        db.session.add(self.member)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_create_notification(self):
        notification = self.service.create_notification(
            account_id=self.account_id,
            notification_type=NotificationType.ACCOUNT_UPDATE,
            title="Test Notification",
            message="This is a test.",
        )
        self.assertIsNotNone(notification.id)
        self.assertEqual(notification.title, "Test Notification")

    def test_send_notification_to_members(self):
        # Setup account, members, notification
        account = Account(name="TestAccount", address="0x123344")
        member1 = Member(id=str(uuid4()), email="user1@example.com", address="0x124455")
        member2 = Member(id=str(uuid4()), email=None, address="0x1674455")
        account.members = [member1, member2]

        db.session.add_all([account, member1, member2])
        db.session.commit()

        notification = Notification(
            account_id=account.id,
            notification_type=NotificationType.ACCOUNT_UPDATE,
            title="Test Title",
            message="Hello world",
        )
        notification.save()

        self.service.send_notification_to_members(notification.id)

    def test_mark_notification_as_read(self):
        notification = self.service.create_notification(
            account_id=self.account_id,
            notification_type=NotificationType.NFT_TRANSFER,
            title="NFT Update",
            message="You sent an NFT.",
        )

        self.service.mark_notification_as_read(notification.id, self.member.id)
        db.session.refresh(notification)
        self.assertIn(self.member, notification.read_by)

    def test_list_notifications_all(self):
        self.service.create_notification(
            self.account_id, NotificationType.TOKEN_TRANSFER, "Transfer 1", "Sent"
        )
        self.service.create_notification(
            self.account_id,
            NotificationType.TOKEN_TRANSFER,
            "Transfer 2",
            "Received",
        )

        notifications = self.service.list_notifications_by_account(self.account_id)
        self.assertEqual(len(notifications), 2)

    def test_list_notifications_unread_only(self):
        n1 = self.service.create_notification(
            self.account_id,
            NotificationType.MEMBER_UPDATE,
            "Updated 1",
            "Some info",
        )
        n2 = self.service.create_notification(
            self.account_id,
            NotificationType.MEMBER_UPDATE,
            "Updated 2",
            "Some info",
        )

        # Mark n1 as read
        self.service.mark_notification_as_read(n1.id, self.member.id)

        unread = self.service.list_notifications_by_account(
            self.account_id, unread_only=True, member_id=self.member.id
        )
        self.assertEqual(len(unread), 1)
        self.assertEqual(unread[0].id, n2.id)

    def test_get_notification_by_id(self):
        notification = self.service.create_notification(
            account_id=self.account_id,
            notification_type=NotificationType.ACCOUNT_UPDATE,
            title="Welcome",
            message="Thanks for joining!",
        )
        fetched = self.service.get_notification_by_id(notification.id)
        self.assertIsNotNone(fetched)
        self.assertEqual(fetched.title, "Welcome")
