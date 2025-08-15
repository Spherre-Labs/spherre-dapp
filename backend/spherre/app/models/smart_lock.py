import enum
from datetime import datetime
from decimal import Decimal

from sqlalchemy import Enum, Index

from spherre.app.extensions import db
from spherre.app.models.base import ModelMixin


class LockStatus(enum.Enum):
    """
    Enum representing the status of a smart lock.
    """
    LOCKED = "locked"      # Default status
    PAIDOUT = "paidout"


class SmartLock(ModelMixin, db.Model):
    """
    Model representing a smart lock for token locking operations.
    """
    __tablename__ = "smart_locks"

    lock_id = db.Column(db.Integer, unique=True, nullable=False, index=True)
    token = db.Column(db.String, nullable=False)
    date_locked = db.Column(db.DateTime, nullable=False)
    token_amount = db.Column(db.Numeric(precision=78, scale=18), nullable=False)
    lock_duration = db.Column(db.Integer, nullable=False)
    lock_status = db.Column(
        Enum(LockStatus), 
        default=LockStatus.LOCKED, 
        server_default=LockStatus.LOCKED.value,
        nullable=False
    )

    # Add index for efficient querying by lock_id
    __table_args__ = (
        Index('idx_smart_lock_lock_id', 'lock_id'),
    )

    def __init__(self, **kwargs):
        # Set default lock_status if not provided
        if 'lock_status' not in kwargs:
            kwargs['lock_status'] = LockStatus.LOCKED
        super().__init__(**kwargs)

    def __repr__(self):
        status_value = self.lock_status.value if self.lock_status else "unknown"
        return f"<SmartLock {self.lock_id} - {self.token} - {status_value}>"
