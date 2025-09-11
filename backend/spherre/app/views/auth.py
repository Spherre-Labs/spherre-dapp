from flask import Blueprint, jsonify, request
from flask_jwt_extended import set_access_cookies, set_refresh_cookies
from loguru import logger
from marshmallow import ValidationError

from spherre.app.serializers.auth import SignInSerializer
from spherre.app.service.auth import AuthService

auth_blueprint = Blueprint("auth", __name__, url_prefix="/api/v1")


@auth_blueprint.route("/auth/signin", methods=["POST"])
def signin():
    data = request.json
    serializer = SignInSerializer()
    try:
        serialized_data = serializer.load(data)
        signed_in_data = AuthService.sign_in_member(serialized_data["address"])
        response = jsonify(signed_in_data)
        set_access_cookies(response, signed_in_data["token"])
        set_refresh_cookies(response, signed_in_data["refresh_token"])
    except ValidationError as e:
        logger.error(e)
        return jsonify(e.messages), 400
    except Exception as e:
        logger.error(e)
        return jsonify({"error": "Server error"}), 500
    return response
