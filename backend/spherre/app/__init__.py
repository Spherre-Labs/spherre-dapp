from flask import Flask
from app.config import config
from app.extensions import db, migrate, jwt, cors

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)
    
    # Register blueprints
    # from app.views.auth import auth_bp
    # from app.views.api import api_bp
    
    # app.register_blueprint(auth_bp, url_prefix='/auth')
    # app.register_blueprint(api_bp, url_prefix='/api/v1')

    return app