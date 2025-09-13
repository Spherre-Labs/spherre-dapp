from flask import Blueprint, jsonify, request

from spherre.app.extensions import db
from spherre.app.models.account import Account
from spherre.app.serializers.smart_lock import SmartLockListResponseSerializer
from spherre.app.service.smart_lock import SmartLockService
from spherre.app.utils.validation import is_valid_starknet_address

smart_lock_blueprint = Blueprint("smart_lock", __name__, url_prefix="/api/v1")


@smart_lock_blueprint.route("/accounts/<account_address>/smart-locks", methods=["GET"])
def get_account_smart_locks(account_address):
    """
    Get all smart locks for a specific account with pagination.
    
    Args:
        account_address: The address of the account
        
    Returns:
        JSON response with smart locks and pagination metadata
    """
    # Validate account address format
    if not is_valid_starknet_address(account_address):
        return jsonify({"error": "Invalid account address format"}), 400

    try:
        # Ensure account exists
        account_exists = (
            db.session.query(Account.id)
            .filter_by(address=account_address)
            .first()
        )
        if not account_exists:
            return jsonify({"error": "Account not found"}), 404

        # Get pagination parameters from query string
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 20, type=int)
        status_filter = request.args.get("status", type=str)
        
        # Validate pagination parameters
        if page < 1:
            page = 1
        if per_page < 1 or per_page > 100:  # Limit max per_page to 100
            per_page = 20
            
        # Convert status string to enum if provided
        status_enum = None
        if status_filter:
            from spherre.app.models.smart_lock import LockStatus
            try:
                status_enum = LockStatus(status_filter.lower())
            except ValueError:
                return (
                    jsonify({"error": f"Invalid status filter: {status_filter}"}),
                    400,
                )

        # Get smart locks with pagination
        smart_locks, pagination_meta = SmartLockService.get_smart_locks_paginated(
            page=page,
            per_page=per_page,
            status_filter=status_enum,
            account_address=account_address,
        )

        # Serialize the response
        response_data = {
            "smart_locks": smart_locks,
            "pagination": pagination_meta,
        }
        
        serializer = SmartLockListResponseSerializer()
        serialized_response = serializer.dump(response_data)

        return jsonify(serialized_response), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception:
        return jsonify({"error": "Internal server error"}), 500