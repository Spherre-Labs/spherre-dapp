import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "spherregonnabegreat25"
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or "spherregonnabegreat25"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    DOMAIN_NAME = os.environ.get("DOMAIN_NAME") or "Spherre"
    CHAIN_ID = os.environ.get("CHAIN_ID") or "SN_SEPOLIA"
    VERSION = os.environ.get("VERSION") or "1"


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or "sqlite:///db.sqlite3"


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = (
        os.environ.get("DATABASE_URL") or "postgresql://user:pass@localhost/prod_db"
    )


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}
