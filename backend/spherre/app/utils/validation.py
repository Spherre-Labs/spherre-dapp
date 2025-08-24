import re

from flask import jsonify

from spherre.app.models.transaction import TransactionStatus, TransactionType


def validate_transaction_filters(page, per_page, tx_type, status, proposer):
    if page < 1 or per_page < 1 or per_page > 100:
        return (
            jsonify(
                {
                    "success": False,
                    "error": {
                        "code": "Invalid pagination parameters",
                        "message": "Page and per_page must be between +1 and +100",
                    },
                }
            ),
            400,
        )

    if tx_type and tx_type not in {e.value for e in TransactionType}:
        return (
            jsonify(
                {
                    "success": False,
                    "error": {
                        "code": "Invalid tx_type parameters",
                        "message": "expects valid tx_type values",
                    },
                }
            ),
            400,
        )

    if status and status not in {e.value for e in TransactionStatus}:
        return (
            jsonify(
                {
                    "success": False,
                    "error": {
                        "code": "Invalid status parameters",
                        "message": "Expects valid status values",
                    },
                }
            ),
            400,
        )

    if proposer and not is_valid_starknet_address(proposer):
        return (
            jsonify(
                {
                    "success": False,
                    "error": {
                        "code": "Invalid proposer address",
                        "message": "Proposer address must be a valid address",
                    },
                }
            ),
            400,
        )

    # return None if all validations pass
    return None


def is_valid_starknet_address(address):
    return bool(re.fullmatch(r"0x[a-fA-F0-9]{64}", address))
