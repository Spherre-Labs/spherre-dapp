from datetime import datetime

from flask import Blueprint, jsonify, request

from spherre.app.serializers.transaction import TransactionSchema
from spherre.app.service.account import AccountService
from spherre.app.service.transaction import TransactionService
from spherre.app.utils.validation import validate_transaction_filters

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
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 20))
    tx_type = request.args.get("tx_type")
    status = request.args.get("status")
    proposer = request.args.get("proposer")

    validation_error = validate_transaction_filters(
        page, per_page, tx_type, status, proposer
    )
    if validation_error:
        return validation_error

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
