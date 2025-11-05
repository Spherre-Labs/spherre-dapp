import enum

from sqlalchemy import Enum

from spherre.app.extensions import db
from spherre.app.models.base import ModelMixin


class NotificationType(enum.Enum):
    """
    Enum representing the type of notifications.
    """

    TRANSACTION = "transaction"
    ACCOUNT_UPDATE = "account_update"
    MEMBER_UPDATE = "member_update"
    TOKEN_TRANSFER = "token_transfer"
    NFT_TRANSFER = "nft_transfer"


notification_readers = db.Table(
    "notification_readers",
    db.Column(
        "notification_id",
        db.String,
        db.ForeignKey("notifications.id"),
        primary_key=True,
    ),
    db.Column("member_id", db.String, db.ForeignKey("members.id"), primary_key=True),
)


class Notification(ModelMixin, db.Model):
    """
    Model representing a notification in the system.
    """

    __tablename__ = "notifications"

    account_id = db.Column(db.String, db.ForeignKey("accounts.id"), nullable=False)
    account = db.relationship(
        "Account", foreign_keys=[account_id], backref="notifications"
    )
    notification_type = db.Column(Enum(NotificationType), nullable=False)
    title = db.Column(db.String, nullable=True)
    message = db.Column(db.String, nullable=False)
    read_by = db.relationship("Member", secondary=notification_readers)


class NotificationPreference(ModelMixin, db.Model):
    """
    Model representing the notification preference of a member in an account
    """

    __tablename__ = "notification_preferences"

    account_id = db.Column(db.String, db.ForeignKey("accounts.id"), nullable=False)
    account = db.relationship(
        "Account", foreign_keys=[account_id], backref="notification_preferences"
    )
    member_id = db.Column(db.String, db.ForeignKey("members.id"), nullable=False)
    member = db.relationship(
        "Member", foreign_keys=[member_id], backref="member_preferences"
    )
    email_enabled: bool = db.Column(db.Boolean, default=True)
