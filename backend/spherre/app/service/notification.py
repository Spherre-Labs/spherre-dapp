from typing import List, Optional
from uuid import uuid4

from spherre.app.extensions import db
from spherre.app.models import Member, Notification, NotificationType
from spherre.app.utils.email import mock_send_email


class NotificationService:
    """Service for managing notifications within an account."""

    @classmethod
    # -- 1. Create Notification --
    def create_notification(
        cls,
        account_id: str,
        notification_type: NotificationType,
        title: str,
        message: str,
    ) -> Notification:
        """
        Create and persist a new notification.
        """
        new_notification = Notification(
            id=str(uuid4()),
            account_id=account_id,
            notification_type=notification_type,
            title=title,
            message=message,
        )
        new_notification.save()
        return new_notification

    @classmethod
    # -- 2. Send Notification to Members via Email --
    def send_notification_to_members(
        cls,
        notification_id: str,
    ):
        """
        Send a notification to specified members using a mock email service.
        """
        notification = (
            db.session.query(Notification).filter_by(id=notification_id).first()
        )
        if not notification:
            raise ValueError("Notification not found")

        account = notification.account
        if not account:
            raise ValueError("Notification has no associated account")

        for member in account.members:
            if member.email:
                mock_send_email(
                    to_email=member.email,
                    subject=notification.title or "Notification",
                    message=notification.message,
                )

    @classmethod
    # -- 3. Mark Notification as Read --
    def mark_notification_as_read(
        cls,
        notification_id: str,
        member_id: str,
    ):
        """
        Mark a notification as read by a member.
        """
        notification = (
            db.session.query(Notification).filter_by(id=notification_id).first()
        )
        member = db.session.query(Member).filter_by(id=member_id).first()

        if not notification or not member:
            raise ValueError("Notification or Member not found")

        if member not in notification.read_by:
            notification.read_by.append(member)
            db.session.commit()

    @classmethod
    # -- 4. List Notifications by Account --
    def list_notifications_by_account(
        cls,
        account_id: str,
        unread_only: bool = False,
        member_id: Optional[str] = None,
    ) -> List[Notification]:
        """
        Retrieve all notifications for an account, optionally filter by unread status.
        """
        query = db.session.query(Notification).filter_by(account_id=account_id)

        if unread_only and member_id:
            # Filter for notifications NOT read by the specific member
            query = query.filter(~Notification.read_by.any(Member.id == member_id))
        elif member_id:
            # Filter for notifications read by the specific member
            query = query.filter(Notification.read_by.any(Member.id == member_id))

        return query.order_by(Notification.created_at.desc()).all()

    @classmethod
    # -- 5. Get Notification by ID --
    def get_notification_by_id(cls, notification_id: str) -> Optional[Notification]:
        """
        Retrieve a single notification by its ID.
        """
        return db.session.query(Notification).filter_by(id=notification_id).first()
