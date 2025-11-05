from spherre.app.extensions import db
from spherre.app.models.account import Account, Member
from spherre.app.models.notification import (
    Notification,
    NotificationPreference,
    NotificationType,
)
from spherre.app.models.smart_lock import LockStatus, SmartLock
from spherre.app.models.transaction import (
    Transaction,
    TransactionStatus,
    TransactionType,
)


def session_save():
    db.session.commit()


__all__ = [
    "Account",
    "Member",
    "Notification",
    "NotificationPreference",
    "SmartLock",
    "LockStatus",
    "Transaction",
    "TransactionStatus",
    "TransactionType",
    "NotificationType",
]
