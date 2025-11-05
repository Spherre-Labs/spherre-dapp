from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from loguru import logger
from marshmallow import ValidationError

from spherre.app.serializers.account import EmailRequestSerializer
from spherre.app.service.account import AccountService
from spherre.app.service.member import MemberService
from spherre.app.service.notification import NotificationService

settings_blueprint = Blueprint("settings", __name__, url_prefix="/api/v1")


@settings_blueprint.route(
    "/accounts/<string:account_address>/settings/email/add", methods=["POST"]
)
@jwt_required()
def add_email(account_address: str):
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
    current_user = get_jwt_identity()
    # check if member is account member
    check = AccountService.is_account_member(account_address, current_user)
    if not check:
        (
            jsonify(
                {
                    "success": False,
                    "error": {
                        "code": "NotAuthorized",
                        "message": "User is not account member",
                    },
                }
            ),
            403,
        )
    data = request.json
    try:
        email_serializer = EmailRequestSerializer().load(data)
    except ValidationError as err:
        logger.error(err)
        return jsonify({"error": err.messages}), 400
    email = email_serializer["email"]
    # get member
    member = MemberService.get_member_by_address(current_user)
    if member.email:
        return jsonify({"error": "Member already has an email"}), 400
    MemberService.update_member_email(current_user, email)
    # set member notification preference
    NotificationService.toggle_member_email_notification_preference(
        member_address=member.address, account_address=account_address
    )
    return jsonify({"success": True}), 201


@settings_blueprint.route(
    "/accounts/<string:account_address>/settings/email/update", methods=["POST", "PUT"]
)
@jwt_required()
def update_email(account_address: str):
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
    current_user = get_jwt_identity()
    # check if member is account member
    check = AccountService.is_account_member(account_address, current_user)
    if not check:
        (
            jsonify(
                {
                    "success": False,
                    "error": {
                        "code": "NotAuthorized",
                        "message": "User is not account member",
                    },
                }
            ),
            403,
        )
    data = request.json
    try:
        email_serializer = EmailRequestSerializer().load(data)
    except ValidationError as err:
        logger.error(err)
        return jsonify({"error": err.messages}), 400
    email = email_serializer["email"]
    # get member
    member = MemberService.get_member_by_address(current_user)
    if not member.email:
        return jsonify({"error": "Member does not have an email"}), 400
    MemberService.update_member_email(current_user, email)
    return jsonify({"success": True}), 201


