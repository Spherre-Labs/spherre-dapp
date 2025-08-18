from datetime import datetime

from flask import Blueprint, jsonify, request

from spherre.app.serializers.transaction import TransactionSchema
from spherre.app.service.account import AccountService
from spherre.app.service.transaction import TransactionService

transactions_blueprint = Blueprint("transactions", __name__, url_prefix="/api/v1")


@transactions_blueprint.route(
    "/accounts/<string:account_address>/transactions", methods=["GET"]
)
def get_transactions(account_address):
    account = AccountService.get_account_by_address(account_address)
    if not account:
        return jsonify({"error": "Account not found"}), 404

    # Query params
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 20))
    tx_type = request.args.get("tx_type")
    status = request.args.get("status")
    proposer = request.args.get("proposer")
    sort_by = request.args.get("sort_by", "date_created")
    sort_order = request.args.get("sort_order", "desc")

    # Parse ISO dates if provided
    date_from_str = request.args.get("date_from")
    date_to_str = request.args.get("date_to")
    date_from = datetime.fromisoformat(date_from_str) if date_from_str else None
    date_to = datetime.fromisoformat(date_to_str) if date_to_str else None

    # Call service
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
