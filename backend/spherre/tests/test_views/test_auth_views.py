from unittest import TestCase

from flask_jwt_extended import decode_token
from starknet_py.net.account.account import Account
from starknet_py.net.full_node_client import FullNodeClient
from starknet_py.net.models import StarknetChainId
from starknet_py.net.signer.stark_curve_signer import KeyPair, StarkCurveSigner
from starknet_py.utils.typed_data import TypedData

from spherre.app import create_app
from spherre.app.extensions import db
from spherre.app.service.auth import AuthService
from spherre.app.utils.signature import SignatureUtils


def is_jwt_token(token: str) -> bool:
    """
    Check if a token is a valid jwt token
    """
    try:
        decode_token(token)
        return True
    except Exception:
        return False


def generate_signin_signature(key_pair: KeyPair) -> list[int]:
    """
    Generate a signin signature for the given public key
    """
    typed_data_dict = SignatureUtils.login_typed_data_format()

    typed_data = TypedData(**typed_data_dict)
    account = Account(
        address=key_pair.public_key,
        key_pair=key_pair,
        client=FullNodeClient(
            node_url="http://localhost:5000",
        ),
        chain=StarknetChainId.SEPOLIA,
    )
    signer = StarkCurveSigner(
        account_address=account.address,
        key_pair=key_pair,
        chain_id=StarknetChainId.SEPOLIA,
    )
    return signer.sign_message(typed_data, account.address)


class TestAuthViews(TestCase):
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

    def test_signin(self):
        key_pair = KeyPair.generate()
        signature = generate_signin_signature(key_pair)
        data = {
            "signatures": signature,
            "public_key": hex(key_pair.public_key),
        }
        res = self.client.post("/api/v1/auth/signin", json=data)
        assert res.status_code == 200
        address = AuthService.generate_address_from_public_key(hex(key_pair.public_key))
        assert res.json["member"] == address
        assert is_jwt_token(res.json["token"])
        assert is_jwt_token(res.json["refresh_token"])

    def test_signin_invalid_signature(self):
        key_pair = KeyPair.generate()
        signature = [1, 2]
        data = {
            "signatures": signature,
            "public_key": hex(key_pair.public_key),
        }
        res = self.client.post("/api/v1/auth/signin", json=data)
        assert res.status_code == 400

    def test_signin_invalid_public_key(self):
        key_pair = KeyPair.generate()
        signature = generate_signin_signature(key_pair)
        data = {
            "signatures": signature,
            "public_key": "0x123",
        }
        res = self.client.post("/api/v1/auth/signin", json=data)
        assert res.status_code == 400
