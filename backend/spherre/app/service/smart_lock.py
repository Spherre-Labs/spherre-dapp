from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from sqlalchemy.exc import IntegrityError

from spherre.app.extensions import db
from spherre.app.models.smart_lock import LockStatus, SmartLock


class SmartLockService:
    """
    Service class for managing SmartLock operations.
    """

    @classmethod
    def create_smart_lock(
        cls,
        lock_id: int,
        token: str,
        date_locked: datetime,
        token_amount: Decimal,
        lock_duration: int
    ) -> SmartLock:
        """
        Create a new smart lock.
        
        Args:
            lock_id: Unique identifier from the smart contract
            token: Token contract address or symbol
            date_locked: Timestamp when the lock was created
            token_amount: Amount of tokens locked
            lock_duration: Duration of the lock in seconds/blocks
            
        Returns:
            SmartLock: The created smart lock instance
            
        Raises:
            ValueError: If lock_id already exists or invalid parameters
        """
        # Check if lock_id already exists
        existing_lock = cls.get_smart_lock_by_lock_id(lock_id)
        if existing_lock:
            raise ValueError(f"SmartLock with lock_id {lock_id} already exists")
        
        # Validate parameters
        if lock_id < 0:
            raise ValueError("lock_id must be a positive integer")
        if not token:
            raise ValueError("token cannot be empty")
        if token_amount <= 0:
            raise ValueError("token_amount must be greater than 0")
        if lock_duration <= 0:
            raise ValueError("lock_duration must be greater than 0")
        
        try:
            smart_lock = SmartLock(
                lock_id=lock_id,
                token=token,
                date_locked=date_locked,
                token_amount=token_amount,
                lock_duration=lock_duration
            )
            db.session.add(smart_lock)
            db.session.commit()
            return smart_lock
        except IntegrityError as e:
            db.session.rollback()
            raise ValueError(f"Failed to create SmartLock: {str(e)}")
    
    @classmethod
    def update_lock_status(
        cls,
        lock_id: int,
        new_status: LockStatus
    ) -> SmartLock:
        """
        Update the status of a smart lock.
        
        Args:
            lock_id: The ID of the smart lock to update
            new_status: The new status to set
            
        Returns:
            SmartLock: The updated smart lock instance
            
        Raises:
            ValueError: If smart lock not found or invalid status
        """
        smart_lock = cls.get_smart_lock_by_lock_id(lock_id)
        if not smart_lock:
            raise ValueError(f"SmartLock with lock_id {lock_id} not found")
        
        if not isinstance(new_status, LockStatus):
            raise ValueError("new_status must be a valid LockStatus enum value")
        
        smart_lock.lock_status = new_status
        db.session.commit()
        return smart_lock
    
    @classmethod
    def list_all_smart_locks(
        cls,
        status_filter: Optional[LockStatus] = None
    ) -> List[SmartLock]:
        """
        List all smart locks with optional status filter.
        
        Args:
            status_filter: Optional filter by lock status
            
        Returns:
            List[SmartLock]: List of smart locks matching the criteria
        """
        query = SmartLock.query
        
        if status_filter is not None:
            if not isinstance(status_filter, LockStatus):
                raise ValueError("status_filter must be a valid LockStatus enum value")
            query = query.filter_by(lock_status=status_filter)
        
        return query.order_by(SmartLock.date_locked.desc()).all()
    
    @classmethod
    def get_smart_lock_by_lock_id(
        cls,
        lock_id: int
    ) -> Optional[SmartLock]:
        """
        Get a smart lock by its lock_id.
        
        Args:
            lock_id: The ID of the smart lock to retrieve
            
        Returns:
            Optional[SmartLock]: The smart lock if found, None otherwise
        """
        return SmartLock.query.filter_by(lock_id=lock_id).first()
