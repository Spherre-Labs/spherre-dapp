import re

from flask import Blueprint, abort, jsonify

from spherre.app.serializers.account import AccountSerializer
from spherre.app.service.account import AccountService

accounts_blueprint = Blueprint("accounts", __name__, url_prefix="/api/v1")


@accounts_blueprint.route("/accounts/member/<member_address>", methods=["GET"])
def get_member_accounts(member_address):
    if not is_valid_starknet_address(member_address):
        abort(400, description="Invalid member address format")

    try:
        accounts = AccountService.get_member_accounts(member_address)

        if not accounts:
            return jsonify([]), 404

        serializer = AccountSerializer(many=True)
        serialized_accounts = serializer.dump(accounts)

        return jsonify(serialized_accounts), 200
    except Exception:
        abort(500, description="Server error")


def is_valid_starknet_address(address):
    return bool(re.fullmatch(r"0x[a-fA-F0-9]{64}", address))
