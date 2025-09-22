from flask import current_app
from flask_jwt_extended import create_access_token, create_refresh_token
from starknet_py.hash.address import compute_address
from starknet_py.utils.typed_data import TypedData

from spherre.app.models import Member
from spherre.app.utils.signature import SignatureUtils


class AuthService:
    @classmethod
    def validate_signin_request(
        cls, signatures: list[str], public_key: list[str]
    ) -> bool:
        """
        Validate the Signed data that verifies the signin of the user.
        The data is signed by the user's wallet and it's components
        are sent for verification
        Args:
            signatures(list[str]): the signatures of the message
            public_key: The public key of the signer.

        Returns:
            bool: a bool representing whether the signature is valid or not.
        """
        typed_data_dict = SignatureUtils.login_typed_data_format()
        typed_data = TypedData(**typed_data_dict)
        return SignatureUtils.verify_signatures(typed_data, signatures, public_key)

    @classmethod
    def generate_address_from_public_key(cls, public_key: str) -> str:
        """
        Generate the address from the public key
        """
        public_key = int(public_key, 16)  # convert the public key to an integer

        class_hash = current_app.config.get("ACCOUNT_CLASS_HASH")
        int_class_hash = int(class_hash, 16)

        address = compute_address(
            class_hash=int_class_hash,
            constructor_calldata=[public_key],
            salt=0,
        )
        return hex(address)

    @classmethod
    def sign_in_member(cls, member_address: str) -> dict:
        """
        Sign in a member
        """
        member = Member.get_or_create(address=member_address)
        member.save()
        # generate a jwt token for the member
        token = create_access_token(identity=member_address, fresh=True)
        refresh_token = create_refresh_token(identity=member_address)
        return {
            "token": token,
            "refresh_token": refresh_token,
            "member": member_address,
        }
