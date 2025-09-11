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
    ACCOUNT_CLASS_HASH = (
        os.environ.get("ACCOUNT_CLASS_HASH")
        or "0x025EC026985A3BF9D0CC1FE17326B245DFDC3FF89B8FDE106542A3EA56C5A918"
    )


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or "sqlite:///db.sqlite3"


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = (
        os.environ.get("DATABASE_URL") or "postgresql://user:pass@localhost/prod_db"
    )
    JWT_COOKIE_SECURE = True


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}
