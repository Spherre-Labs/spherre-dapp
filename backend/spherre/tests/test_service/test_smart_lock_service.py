from datetime import datetime
from decimal import Decimal
from unittest import TestCase

from spherre.app import create_app
from spherre.app.extensions import db
from spherre.app.models.smart_lock import LockStatus, SmartLock
from spherre.app.service.smart_lock import SmartLockService

# Test constants
TEST_ACCOUNT_ADDRESS = (
    "0x1111111111111111111111111111111111111111111111111111111111111111"
)
TEST_ACCOUNT_ADDRESS_2 = (
    "0x2222222222222222222222222222222222222222222222222222222222222222"
)


class TestSmartLockService(TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_create_smart_lock(self):
        """Test creating a new smart lock through service."""
        test_date = datetime(2024, 8, 15, 10, 30, 0)
        test_account_address = TEST_ACCOUNT_ADDRESS

        smart_lock = SmartLockService.create_smart_lock(
            lock_id=1,
            token="ETH",
            date_locked=test_date,
            token_amount=Decimal("100.5"),
            lock_duration=86400,
            account_address=test_account_address,
        )

        assert smart_lock is not None
        assert smart_lock.lock_id == 1
        assert smart_lock.token == "ETH"
        assert smart_lock.date_locked == test_date
        assert smart_lock.token_amount == Decimal("100.5")
        assert smart_lock.lock_duration == 86400
        assert smart_lock.lock_status == LockStatus.LOCKED
        assert smart_lock.account_address == test_account_address

        # Verify it's saved in database
        db_lock = SmartLock.query.filter_by(lock_id=1).first()
        assert db_lock is not None
        assert db_lock.token == "ETH"

    def test_create_smart_lock_duplicate_lock_id(self):
        """Test creating smart lock with duplicate lock_id raises error."""
        test_date = datetime.now()
        test_account_address = TEST_ACCOUNT_ADDRESS

        # Create first smart lock
        SmartLockService.create_smart_lock(
            lock_id=2,
            token="ETH",
            date_locked=test_date,
            token_amount=Decimal("50.0"),
            lock_duration=3600,
            account_address=test_account_address,
        )

        # Try to create another with same lock_id
        with self.assertRaises(ValueError) as context:
            SmartLockService.create_smart_lock(
                lock_id=2,  # Same lock_id
                token="USDC",
                date_locked=test_date,
                token_amount=Decimal("100.0"),
                lock_duration=7200,
                account_address=test_account_address,
            )

        self.assertIn(
            "Smart lock with lock_id 2 already exists", str(context.exception)
        )

    def test_create_smart_lock_invalid_parameters(self):
        """Test creating smart lock with invalid parameters."""
        test_date = datetime.now()
        test_account_address = TEST_ACCOUNT_ADDRESS

        # Test negative lock_id
        with self.assertRaises(ValueError) as context:
            SmartLockService.create_smart_lock(
                lock_id=-1,
                token="ETH",
                date_locked=test_date,
                token_amount=Decimal("10.0"),
                lock_duration=3600,
                account_address=test_account_address,
            )
        self.assertIn("lock_id must be a positive integer", str(context.exception))

        # Test empty token
        with self.assertRaises(ValueError) as context:
            SmartLockService.create_smart_lock(
                lock_id=10,
                token="",
                date_locked=test_date,
                token_amount=Decimal("10.0"),
                lock_duration=3600,
                account_address=test_account_address,
            )
        self.assertIn("token cannot be empty", str(context.exception))

        # Test negative token_amount
        with self.assertRaises(ValueError) as context:
            SmartLockService.create_smart_lock(
                lock_id=11,
                token="ETH",
                date_locked=test_date,
                token_amount=Decimal("-10.0"),
                lock_duration=3600,
                account_address=test_account_address,
            )
        self.assertIn("token_amount must be positive", str(context.exception))

        # Test negative lock_duration
        with self.assertRaises(ValueError) as context:
            SmartLockService.create_smart_lock(
                lock_id=12,
                token="ETH",
                date_locked=test_date,
                token_amount=Decimal("10.0"),
                lock_duration=-3600,
                account_address=test_account_address,
            )
        self.assertIn("lock_duration must be positive", str(context.exception))

        # Test empty account_address
        with self.assertRaises(ValueError) as context:
            SmartLockService.create_smart_lock(
                lock_id=13,
                token="ETH",
                date_locked=test_date,
                token_amount=Decimal("10.0"),
                lock_duration=3600,
                account_address="",
            )
        self.assertIn("account_address cannot be empty", str(context.exception))

    def test_update_lock_status(self):
        """Test updating smart lock status."""
        test_date = datetime.now()
        test_account_address = TEST_ACCOUNT_ADDRESS

        # Create smart lock
        SmartLockService.create_smart_lock(
            lock_id=3,
            token="BTC",
            date_locked=test_date,
            token_amount=Decimal("1.5"),
            lock_duration=7200,
            account_address=test_account_address,
        )

        # Update status
        updated_lock = SmartLockService.update_lock_status(3, LockStatus.PAIDOUT)

        assert updated_lock is not None
        assert updated_lock.lock_status == LockStatus.PAIDOUT
        assert updated_lock.lock_id == 3

        # Verify in database
        db_lock = SmartLock.query.filter_by(lock_id=3).first()
        assert db_lock.lock_status == LockStatus.PAIDOUT

    def test_update_lock_status_nonexistent_lock(self):
        """Test updating status of non-existent smart lock."""
        with self.assertRaises(ValueError) as context:
            SmartLockService.update_lock_status(999, LockStatus.PAIDOUT)

        self.assertIn("Smart lock with lock_id 999 not found", str(context.exception))

    def test_get_smart_lock_by_lock_id(self):
        """Test retrieving smart lock by lock_id."""
        test_date = datetime.now()
        test_account_address = TEST_ACCOUNT_ADDRESS

        # Create smart lock
        SmartLockService.create_smart_lock(
            lock_id=4,
            token="STRK",
            date_locked=test_date,
            token_amount=Decimal("250.75"),
            lock_duration=1800,
            account_address=test_account_address,
        )

        # Retrieve smart lock
        retrieved_lock = SmartLockService.get_smart_lock_by_lock_id(4)

        assert retrieved_lock is not None
        assert retrieved_lock.lock_id == 4
        assert retrieved_lock.token == "STRK"
        assert retrieved_lock.token_amount == Decimal("250.75")
        assert retrieved_lock.lock_duration == 1800

    def test_get_smart_lock_by_lock_id_not_found(self):
        """Test retrieving non-existent smart lock by lock_id."""
        result = SmartLockService.get_smart_lock_by_lock_id(999)
        assert result is None

    def test_list_all_smart_locks(self):
        """Test listing all smart locks without filter."""
        test_date = datetime.now()
        test_account_address = TEST_ACCOUNT_ADDRESS

        # Create multiple smart locks
        SmartLockService.create_smart_lock(
            lock_id=5,
            token="ETH",
            date_locked=test_date,
            token_amount=Decimal("10.0"),
            lock_duration=3600,
            account_address=test_account_address,
        )

        SmartLockService.create_smart_lock(
            lock_id=6,
            token="USDC",
            date_locked=test_date,
            token_amount=Decimal("500.0"),
            lock_duration=7200,
            account_address=test_account_address,
        )

        # Update one to PAIDOUT status
        SmartLockService.update_lock_status(6, LockStatus.PAIDOUT)

        # List all smart locks
        all_locks = SmartLockService.list_all_smart_locks()

        assert len(all_locks) == 2
        lock_ids = [lock.lock_id for lock in all_locks]
        assert 5 in lock_ids
        assert 6 in lock_ids

    def test_list_smart_locks_with_status_filter(self):
        """Test listing smart locks with status filter."""
        test_date = datetime.now()
        test_account_address = TEST_ACCOUNT_ADDRESS

        # Create multiple smart locks
        SmartLockService.create_smart_lock(
            lock_id=7,
            token="ETH",
            date_locked=test_date,
            token_amount=Decimal("15.0"),
            lock_duration=3600,
            account_address=test_account_address,
        )

        SmartLockService.create_smart_lock(
            lock_id=8,
            token="BTC",
            date_locked=test_date,
            token_amount=Decimal("0.5"),
            lock_duration=7200,
            account_address=test_account_address,
        )

        SmartLockService.create_smart_lock(
            lock_id=9,
            token="STRK",
            date_locked=test_date,
            token_amount=Decimal("1000.0"),
            lock_duration=1800,
            account_address=test_account_address,
        )

        # Update some to PAIDOUT status
        SmartLockService.update_lock_status(7, LockStatus.PAIDOUT)
        SmartLockService.update_lock_status(9, LockStatus.PAIDOUT)

        # Filter by LOCKED status
        locked_locks = SmartLockService.list_all_smart_locks(LockStatus.LOCKED)
        assert len(locked_locks) == 1
        assert locked_locks[0].lock_id == 8
        assert locked_locks[0].lock_status == LockStatus.LOCKED

        # Filter by PAIDOUT status
        paidout_locks = SmartLockService.list_all_smart_locks(LockStatus.PAIDOUT)
        assert len(paidout_locks) == 2
        paidout_lock_ids = [lock.lock_id for lock in paidout_locks]
        assert 7 in paidout_lock_ids
        assert 9 in paidout_lock_ids

    def test_get_smart_locks_paginated_with_account_filter(self):
        """Test paginated smart locks with account filtering."""
        test_date = datetime.now()
        account1_address = TEST_ACCOUNT_ADDRESS
        account2_address = TEST_ACCOUNT_ADDRESS_2

        # Create smart locks for different accounts
        SmartLockService.create_smart_lock(
            lock_id=10,
            token="ETH",
            date_locked=test_date,
            token_amount=Decimal("10.0"),
            lock_duration=3600,
            account_address=account1_address,
        )

        SmartLockService.create_smart_lock(
            lock_id=11,
            token="USDC",
            date_locked=test_date,
            token_amount=Decimal("100.0"),
            lock_duration=7200,
            account_address=account2_address,
        )

        SmartLockService.create_smart_lock(
            lock_id=12,
            token="BTC",
            date_locked=test_date,
            token_amount=Decimal("1.0"),
            lock_duration=1800,
            account_address=account1_address,
        )

        # Test filtering by account1
        locks_account1, pagination1 = SmartLockService.get_smart_locks_paginated(
            page=1,
            per_page=10,
            account_address=account1_address,
        )
        assert len(locks_account1) == 2
        assert all(lock.account_address == account1_address for lock in locks_account1)
        assert pagination1["total"] == 2

        # Test filtering by account2
        locks_account2, pagination2 = SmartLockService.get_smart_locks_paginated(
            page=1,
            per_page=10,
            account_address=account2_address,
        )
        assert len(locks_account2) == 1
        assert locks_account2[0].account_address == account2_address
        assert pagination2["total"] == 1

        # Test filtering by non-existent account
        locks_nonexistent, pagination3 = SmartLockService.get_smart_locks_paginated(
            page=1,
            per_page=10,
            account_address="0x3333333333333333333333333333333333333333333333333333333333333333",
        )
        assert len(locks_nonexistent) == 0
        assert pagination3["total"] == 0

    def test_get_smart_locks_paginated_invalid_pagination(self):
        """Test pagination validation with invalid inputs."""
        test_date = datetime.now()
        test_account_address = TEST_ACCOUNT_ADDRESS

        # Create a smart lock for testing
        SmartLockService.create_smart_lock(
            lock_id=20,
            token="TEST",
            date_locked=test_date,
            token_amount=Decimal("10.0"),
            lock_duration=3600,
            account_address=test_account_address,
        )

        # Test invalid page (page < 1)
        with self.assertRaises(ValueError) as context:
            SmartLockService.get_smart_locks_paginated(
                page=0,
                per_page=10,
                account_address=test_account_address,
            )
        self.assertIn("page must be >= 1", str(context.exception))

        # Test invalid per_page (per_page < 1)
        with self.assertRaises(ValueError) as context:
            SmartLockService.get_smart_locks_paginated(
                page=1,
                per_page=0,
                account_address=test_account_address,
            )
        self.assertIn("per_page must be >= 1", str(context.exception))

        # Test per_page > 100 (should be clamped to 100)
        locks, pagination = SmartLockService.get_smart_locks_paginated(
            page=1,
            per_page=150,  # Should be clamped to 100
            account_address=test_account_address,
        )
        assert pagination["per_page"] == 100

    def test_list_smart_locks_empty_result(self):
        """Test listing smart locks when no locks exist."""
        all_locks = SmartLockService.list_all_smart_locks()
        assert len(all_locks) == 0

        locked_locks = SmartLockService.list_all_smart_locks(LockStatus.LOCKED)
        assert len(locked_locks) == 0

        paidout_locks = SmartLockService.list_all_smart_locks(LockStatus.PAIDOUT)
        assert len(paidout_locks) == 0
