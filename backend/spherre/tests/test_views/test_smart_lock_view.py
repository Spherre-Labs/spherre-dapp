"""
Unit tests for smart lock views.
"""

from unittest.mock import patch

import pytest

from spherre.app import create_app
from spherre.app.models.smart_lock import LockStatus

# Test constants
TEST_ACCOUNT_ADDRESS = (
    "0x1111111111111111111111111111111111111111111111111111111111111111"
)
TEST_ACCOUNT_ADDRESS_2 = (
    "0x2222222222222222222222222222222222222222222222222222222222222222"
)
SMART_LOCK_ENDPOINT = f"/api/v1/accounts/{TEST_ACCOUNT_ADDRESS}/smart-locks"
SERVICE_PATCH = (
    "spherre.app.views.smart_lock.SmartLockService.get_smart_locks_paginated"
)


class TestSmartLockView:
    """Test cases for smart lock view endpoints."""

    @pytest.fixture
    def app(self):
        """Create test app."""
        app = create_app("testing")
        return app

    @pytest.fixture
    def client(self, app):
        """Create test client."""
        return app.test_client()

    def test_get_account_smart_locks_success(self, client):
        """Test successful retrieval of smart locks for an account."""
        # Mock the account existence check and service method
        with (
            patch("spherre.app.views.smart_lock.db.session.query") as mock_query,
            patch(SERVICE_PATCH) as mock_service,
        ):
            # Mock account exists
            mock_query.return_value.filter_by.return_value.first.return_value = (
                "account_exists"
            )

            # Return empty list for simplicity
            mock_smart_locks = []
            mock_pagination = {
                "page": 1,
                "per_page": 20,
                "total": 0,
                "total_pages": 0,
                "has_next": False,
                "has_prev": False,
            }

            mock_service.return_value = (mock_smart_locks, mock_pagination)

            # Make request
            response = client.get(SMART_LOCK_ENDPOINT)

            # Assertions
            assert response.status_code == 200
            data = response.get_json()
            assert "smart_locks" in data
            assert "pagination" in data
            assert len(data["smart_locks"]) == 0
            assert data["pagination"]["total"] == 0

    def test_get_account_smart_locks_invalid_address(self, client):
        """Test error handling for invalid account address."""
        response = client.get("/api/v1/accounts/invalid-address/smart-locks")

        assert response.status_code == 400
        data = response.get_json()
        assert "error" in data

    def test_get_account_smart_locks_account_not_found(self, client):
        """Test 404 response when account doesn't exist."""
        # Use a valid StarkNet address format but non-existent account
        non_existent_address = TEST_ACCOUNT_ADDRESS_2

        with patch("spherre.app.views.smart_lock.db.session.query") as mock_query:
            # Mock the account existence check to return None (account not found)
            mock_query.return_value.filter_by.return_value.first.return_value = None

            response = client.get(
                f"/api/v1/accounts/{non_existent_address}/smart-locks"
            )

            assert response.status_code == 404
            data = response.get_json()
            assert "error" in data
            assert "Account not found" in data["error"]

    def test_get_account_smart_locks_with_pagination(self, client):
        """Test smart locks endpoint with pagination parameters."""
        with (
            patch("spherre.app.views.smart_lock.db.session.query") as mock_query,
            patch(SERVICE_PATCH) as mock_service,
        ):
            # Mock account exists
            mock_query.return_value.filter_by.return_value.first.return_value = (
                "account_exists"
            )

            mock_pagination = {
                "page": 2,
                "per_page": 10,
                "total": 0,
                "total_pages": 0,
                "has_next": False,
                "has_prev": True,
            }
            mock_service.return_value = ([], mock_pagination)

            response = client.get(f"{SMART_LOCK_ENDPOINT}?page=2&per_page=10")

            assert response.status_code == 200
            mock_service.assert_called_once()
            call_args = mock_service.call_args
            assert call_args[1]["page"] == 2
            assert call_args[1]["per_page"] == 10

    def test_get_account_smart_locks_with_status_filter(self, client):
        """Test smart locks endpoint with status filter."""
        with (
            patch("spherre.app.views.smart_lock.db.session.query") as mock_query,
            patch(SERVICE_PATCH) as mock_service,
        ):
            # Mock account exists
            mock_query.return_value.filter_by.return_value.first.return_value = (
                "account_exists"
            )

            mock_pagination = {
                "page": 1,
                "per_page": 20,
                "total": 0,
                "total_pages": 0,
                "has_next": False,
                "has_prev": False,
            }
            mock_service.return_value = ([], mock_pagination)

            response = client.get(f"{SMART_LOCK_ENDPOINT}?status=locked")

            assert response.status_code == 200
            mock_service.assert_called_once()
            call_args = mock_service.call_args
            assert call_args[1]["status_filter"] == LockStatus.LOCKED

    def test_get_account_smart_locks_invalid_status(self, client):
        """Test error handling for invalid status filter."""
        with patch("spherre.app.views.smart_lock.db.session.query") as mock_query:
            # Mock account exists
            mock_query.return_value.filter_by.return_value.first.return_value = (
                "account_exists"
            )

            response = client.get(f"{SMART_LOCK_ENDPOINT}?status=invalid")

            assert response.status_code == 400
            data = response.get_json()
            assert "error" in data

    def test_get_account_smart_locks_service_error(self, client):
        """Test error handling when service raises an exception."""
        with patch(SERVICE_PATCH) as mock_service:
            mock_service.side_effect = Exception("Database error")

            response = client.get(SMART_LOCK_ENDPOINT)

            assert response.status_code == 500
            data = response.get_json()
            assert "error" in data
