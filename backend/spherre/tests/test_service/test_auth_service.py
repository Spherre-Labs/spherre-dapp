from unittest import TestCase
from flask_jwt_extended import create_access_token, create_refresh_token

from spherre.app import create_app
from spherre.app.extensions import db
from spherre.app.service.auth import AuthService

class TestAuthService(TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_sign_in_member(self):
        data = AuthService.sign_in_member("0x123")
        assert data is not None
        assert data["member"] == "0x123"
        
    def test_generate_address_from_public_key(self):
        address = AuthService.generate_address_from_public_key("0x123")
        assert address is not None
        assert address == "0x4809f483eca7515a989e9ad1509708563bbdd972af975ffcc8fbd193aa47710"
