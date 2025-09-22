import re

from flask import Flask, jsonify, request
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from spherre.app.config import config
from spherre.app.extensions import cors, db, jwt, migrate
from spherre.app.views.accounts import accounts_blueprint
from spherre.app.views.auth import auth_blueprint
from spherre.app.views.notifications import notifications_blueprint
from spherre.app.views.smart_lock import smart_lock_blueprint
from spherre.app.views.transactions import transactions_blueprint


def create_app(config_name="development"):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)

    from spherre.app import models  # noqa
    from spherre.app.service.account import AccountService

    # Register blueprints
    app.register_blueprint(accounts_blueprint)
    app.register_blueprint(notifications_blueprint)
    app.register_blueprint(smart_lock_blueprint)
    app.register_blueprint(transactions_blueprint)
    app.register_blueprint(auth_blueprint)

    @app.before_request
    def validate_private_account_access():
        # get url path
        url_path = request.path

        # regex to check if url has a starknet address in it
        regex = r"^0x[0-9a-fA-F]{64}$"

        if account_address := re.search(regex, url_path):
            # get account address from url
            account_address = account_address.group(0)
            account = AccountService.get_account_by_address(account_address)
            # check if account address is a private
            if account and account.is_private:
                # validate user is a member of the account
                # this will raise an exception if no jwt is found
                verify_jwt_in_request()
                current_user = get_jwt_identity()
                if not AccountService.is_account_member(account_address, current_user):
                    return jsonify(
                        {"error": "You are not a member of this account"}
                    ), 403

    return app
