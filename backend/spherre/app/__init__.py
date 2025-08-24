from flask import Flask

from spherre.app.config import config
from spherre.app.extensions import cors, db, jwt, migrate
from spherre.app.views.accounts import accounts_blueprint
from spherre.app.views.notifications import notifications_blueprint
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

    # Register blueprints
    app.register_blueprint(accounts_blueprint)
    app.register_blueprint(notifications_blueprint)
    app.register_blueprint(transactions_blueprint)

    return app
