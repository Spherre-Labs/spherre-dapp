from flask_jwt_extended import create_access_token, create_refresh_token
from starknet_py.constants import EC_ORDER
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
        return compute_address(
            class_hash=0x025EC026985A3BF9D0CC1FE17326B245DFDC3FF89B8FDE106542A3EA56C5A918,
            constructor_calldata=[public_key],
            salt=0,
        )

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
