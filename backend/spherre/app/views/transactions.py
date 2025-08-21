from datetime import datetime

from flask import Blueprint, jsonify, request

from spherre.app.models.transaction import TransactionStatus, TransactionType
from spherre.app.serializers.transaction import TransactionSchema
from spherre.app.service.account import AccountService
from spherre.app.service.transaction import TransactionService
from spherre.app.utils.validation import is_valid_starknet_address

transactions_blueprint = Blueprint("transactions", __name__, url_prefix="/api/v1")


@transactions_blueprint.route(
    "/accounts/<string:account_address>/transactions", methods=["GET"]
)
def get_transactions(account_address):
    account = AccountService.get_account_by_address(account_address)
    if not account:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "NotFound",
                    "message": "Account not found",
                },
            }
        ), 404

    # Query params
    try:
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 20))
    except ValueError:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "Invalid pagination parameters",
                    "message": "Page and per_page must be integers",
                },
            }
        ), 400

    if page < 1 or per_page < 1 or per_page > 100:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "Invalid pagination parameters",
                    "message": "Page and per_page must be between +1 and +100",
                },
            }
        ), 400

    tx_type = request.args.get("tx_type")
    status = request.args.get("status")
    if tx_type and tx_type not in {e.value for e in TransactionType}:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "Invalid tx_type parameters",
                    "message": "expects valid tx_type values",
                },
            }
        ), 400
    if status and status not in {e.value for e in TransactionStatus}:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "Invalid status parameters",
                    "message": "Expects valid status values",
                },
            }
        ), 400

    proposer = request.args.get("proposer")
    if proposer:
        if not is_valid_starknet_address(proposer):
            return jsonify(
                {
                    "success": False,
                    "error": {
                        "code": "Invalid proposer address",
                        "message": "Proposer address must be a valid address",
                    },
                }
            ), 400
    sort_by = request.args.get("sort_by", "date_created")
    sort_order = request.args.get("sort_order", "desc")

    # Parse ISO dates if provided
    date_from_str = request.args.get("date_from")
    date_to_str = request.args.get("date_to")
    try:
        date_from = datetime.fromisoformat(date_from_str) if date_from_str else None
        date_to = datetime.fromisoformat(date_to_str) if date_to_str else None
    except ValueError:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "Invalid date format",
                    "message": "Use ISO 8601 (YYYY-MM-DDTHH:MM:SS)",
                },
            }
        ), 400

    # date_from = datetime.fromisoformat(date_from_str) if date_from_str else None
    # date_to = datetime.fromisoformat(date_to_str) if date_to_str else None

    # Call service
    try:
        result = TransactionService.get_filtered_transactions(
            account=account,
            page=page,
            per_page=per_page,
            tx_type=tx_type,
            status=status,
            proposer_address=proposer,
            date_from=date_from,
            date_to=date_to,
            sort_by=sort_by,
            sort_order=sort_order,
        )

        # Serialize transactions
        response = {
            "transactions": TransactionSchema(many=True).dump(result["items"]),
            "pagination": result["pagination"],
        }

        return jsonify(response)
    except Exception:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "InternalServerError",
                    "message": "server error ",
                },
            }
        ), 500
