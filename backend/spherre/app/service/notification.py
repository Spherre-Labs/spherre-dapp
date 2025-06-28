from typing import List, Optional
from sqlalchemy.orm import Session
from ..models import Notification, NotificationType, notification_readers, Member
from ..utils.email import mock_send_email 
from uuid import uuid4
from datetime import datetime


# -- 1. Create Notification --
def create_notification(
    db: Session,
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
    db.add(new_notification)
    db.commit()
    db.refresh(new_notification)
    return new_notification


# -- 2. Send Notification to Members via Email --
def send_notification_to_members(
    db: Session,
    notification_id: str,
    member_ids: List[str],
):
    """
    Send a notification to specified members using a mock email service.
    """
    notification = db.query(Notification).filter_by(id=notification_id).first()
    if not notification:
        raise ValueError("Notification not found")

    for member_id in member_ids:
        member = db.query(Member).filter_by(id=member_id).first()
        if member:
            mock_send_email(
                to_email=member.email,
                subject=notification.title or "Notification",
                message=notification.message,
            )


# -- 3. Mark Notification as Read --
def mark_notification_as_read(
    db: Session,
    notification_id: str,
    member_id: str,
):
    """
    Mark a notification as read by a member.
    """
    notification = db.query(Notification).filter_by(id=notification_id).first()
    member = db.query(Member).filter_by(id=member_id).first()

    if not notification or not member:
        raise ValueError("Notification or Member not found")

    if member not in notification.read_by:
        notification.read_by.append(member)
        db.commit()


# -- 4. List Notifications by Account --
def list_notifications_by_account(
    db: Session,
    account_id: str,
    unread_only: bool = False,
    member_id: Optional[str] = None,
) -> List[Notification]:
    """
    Retrieve all notifications for an account, optionally filter by unread status.
    """
    query = db.query(Notification).filter_by(account_id=account_id)

    if unread_only and member_id:
        query = query.filter(~Notification.read_by.any(Member.id == member_id))

    return query.order_by(Notification.created_at.desc()).all()


# -- 5. Get Notification by ID --
def get_notification_by_id(db: Session, notification_id: str) -> Optional[Notification]:
    """
    Retrieve a single notification by its ID.
    """
    return db.query(Notification).filter_by(id=notification_id).first()
