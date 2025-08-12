from flask import Blueprint, jsonify, request

from spherre.app.serializers.notifications import NotificationSchema
from spherre.app.service.account import AccountService
from spherre.app.service.notification import NotificationService

notifications_blueprint = Blueprint("notifications", __name__, url_prefix="/api/v1")


@notifications_blueprint.route(
    "/accounts/<string:account_address>/notifications", methods=["GET"]
)
def get_notifications(account_address):
    try:
        page = request.args.get("page", default=1, type=int)
        per_page = request.args.get("per_page", default=20, type=int)
        unread_only = request.args.get("unread_only", default="False").lower() == "true"
        member_id = request.args.get("member_id", default=None, type=str)

        if page <= 0 or per_page <= 0:
            return jsonify({"error": "Invalid pagination parameters"}), 400

        account = AccountService.get_account_by_address(account_address)
        if not account:
            return jsonify({"error": "Account not found"}), 404
        notifications, pagination = NotificationService.list_notifications_by_account(
            account_id=account.id,
            page=page,
            per_page=per_page,
            unread_only=unread_only,
            member_id=member_id,
        )
        schema = NotificationSchema(many=True)
        serialized = schema.dump(notifications)

        return jsonify({"notifications": serialized, "pagination": pagination}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
