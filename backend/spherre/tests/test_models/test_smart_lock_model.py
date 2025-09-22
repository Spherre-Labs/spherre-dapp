from datetime import datetime
from decimal import Decimal
from unittest import TestCase

from spherre.app import create_app
from spherre.app.extensions import db
from spherre.app.models.smart_lock import LockStatus, SmartLock

# Test constants
TEST_ACCOUNT_ADDRESS = (
    "0x1111111111111111111111111111111111111111111111111111111111111111"
)


class TestSmartLockModel(TestCase):
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

    def test_create_smart_lock_model(self):
        """Test creating a new SmartLock instance."""
        test_account_address = TEST_ACCOUNT_ADDRESS

        smart_lock = SmartLock(
            lock_id=1,
            token="ETH",
            date_locked=datetime.now(),
            token_amount=Decimal("100.5"),
            lock_duration=86400,
            account_address=test_account_address,
        )

        db.session.add(smart_lock)
        db.session.commit()

        assert smart_lock.id is not None
        assert smart_lock.lock_id == 1
        assert smart_lock.token == "ETH"
        assert smart_lock.token_amount == Decimal("100.5")
        assert smart_lock.lock_duration == 86400
        assert smart_lock.lock_status == LockStatus.LOCKED  # Default status
        assert smart_lock.account_address == test_account_address
        assert smart_lock.created_at is not None
        assert smart_lock.updated_at is not None

    def test_smart_lock_default_status(self):
        """Test that default status is LOCKED."""
        test_account_address = TEST_ACCOUNT_ADDRESS

        smart_lock = SmartLock(
            lock_id=2,
            token="USDC",
            date_locked=datetime.now(),
            token_amount=Decimal("50.0"),
            lock_duration=3600,
            account_address=test_account_address,
        )

        assert smart_lock.lock_status == LockStatus.LOCKED

    def test_update_smart_lock_status(self):
        """Test updating lock status."""
        test_account_address = TEST_ACCOUNT_ADDRESS

        smart_lock = SmartLock(
            lock_id=3,
            token="BTC",
            date_locked=datetime.now(),
            token_amount=Decimal("1.5"),
            lock_duration=7200,
            account_address=test_account_address,
        )

        db.session.add(smart_lock)
        db.session.commit()

        # Update status
        smart_lock.lock_status = LockStatus.PAIDOUT
        db.session.commit()

        # Verify update
        updated_lock = SmartLock.query.filter_by(lock_id=3).first()
        assert updated_lock.lock_status == LockStatus.PAIDOUT

    def test_smart_lock_unique_lock_id(self):
        """Test that lock_id is unique."""
        test_account_address = TEST_ACCOUNT_ADDRESS

        # Create first smart lock
        smart_lock1 = SmartLock(
            lock_id=4,
            token="ETH",
            date_locked=datetime.now(),
            token_amount=Decimal("10.0"),
            lock_duration=1800,
            account_address=test_account_address,
        )

        db.session.add(smart_lock1)
        db.session.commit()

        # Try to create another with same lock_id
        smart_lock2 = SmartLock(
            lock_id=4,  # Same lock_id
            token="USDC",
            date_locked=datetime.now(),
            token_amount=Decimal("20.0"),
            lock_duration=3600,
            account_address=test_account_address,
        )

        db.session.add(smart_lock2)

        with self.assertRaises(Exception):  # Should raise IntegrityError
            db.session.commit()

    def test_smart_lock_repr(self):
        """Test the string representation of SmartLock."""
        test_account_address = TEST_ACCOUNT_ADDRESS

        smart_lock = SmartLock(
            lock_id=5,
            token="STRK",
            date_locked=datetime.now(),
            token_amount=Decimal("75.25"),
            lock_duration=1200,
            account_address=test_account_address,
        )

        expected_repr = "<SmartLock 5 - STRK - locked>"
        assert str(smart_lock) == expected_repr

    def test_lock_status_enum_values(self):
        """Test LockStatus enum values."""
        assert LockStatus.LOCKED.value == "locked"
        assert LockStatus.PAIDOUT.value == "paidout"

        # Test all enum members
        assert len(LockStatus) == 2
        assert LockStatus.LOCKED in LockStatus
        assert LockStatus.PAIDOUT in LockStatus

    def test_smart_lock_decimal_precision(self):
        """Test that token_amount handles high precision decimals correctly."""
        test_account_address = TEST_ACCOUNT_ADDRESS

        # Test with 18 decimal precision (matching the model's scale)
        high_precision_amount = Decimal("123456789.123456789123456789")

        smart_lock = SmartLock(
            lock_id=6,
            token="HIGH_PRECISION",
            date_locked=datetime.now(),
            token_amount=high_precision_amount,
            lock_duration=600,
            account_address=test_account_address,
        )

        db.session.add(smart_lock)
        db.session.commit()

        # Retrieve and verify precision is maintained within database precision limits
        retrieved_lock = SmartLock.query.filter_by(lock_id=6).first()
        # The database precision might truncate,
        # we check that it's approximately equal
        assert abs(retrieved_lock.token_amount - high_precision_amount) < Decimal(
            "0.000001"
        )

    def test_smart_lock_date_locked_field(self):
        """Test date_locked field."""
        test_account_address = TEST_ACCOUNT_ADDRESS
        test_date = datetime(2024, 1, 15, 12, 30, 45)

        smart_lock = SmartLock(
            lock_id=7,
            token="DATE_TEST",
            date_locked=test_date,
            token_amount=Decimal("42.0"),
            lock_duration=1800,
            account_address=test_account_address,
        )

        db.session.add(smart_lock)
        db.session.commit()

        retrieved_lock = SmartLock.query.filter_by(lock_id=7).first()
        assert retrieved_lock.date_locked == test_date
