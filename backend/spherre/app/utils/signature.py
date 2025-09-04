from flask import current_app
from starknet_py.hash.utils import verify_message_signature
from starknet_py.utils.typed_data import Domain, Parameter, TypedData


class SignatureUtils:
    @classmethod
    def login_typed_data_format(cls) -> dict:
        """
        This represents the signature request of the login operation.
        Read on starknet signatures to understand more

        Returns:
            dict: The signature request structure of the login functionality.
        """
        data = {
            "domain": Domain(
                **{
                    "name": current_app.config.get("DOMAIN_NAME"),
                    "chain_id": current_app.config.get("CHAIN_ID"),
                    "version": current_app.config.get("VERSION"),
                }
            ),
            "types": {
                "StarknetDomain": [
                    Parameter(**{"name": "name", "type": "felt"}),
                    Parameter(**{"name": "chainId", "type": "felt"}),
                    Parameter(**{"name": "version", "type": "felt"}),
                ],
                "Message": [
                    Parameter(**{"name": "name", "type": "felt"}),
                    Parameter(**{"name": "age", "type": "felt"}),
                    Parameter(**{"name": "address", "type": "felt"}),
                ],
            },
            "primary_type": "Message",
            "message": {},
        }
        return data.copy()

    @classmethod
    def generate_signature_typed_data(cls, data: dict, type_format: dict) -> TypedData:
        """
        Integrates the data from a signing format into a signature request.
        This data is based on the request structure and the signature message type.
        It generates a TypedData from the typed data format.

        Args:
            data(dict): the data that contains the essential details of the signature
                that is integrated into the typed_data format (the signature request).
            type_format(dict): The typed data format that contains the meta data
                of the signature request.
        Returns:
            TypedData: returns that typed data that is used for generating a
                message hash for signature verification.
        """
        login_signature_request_format = type_format
        # add the data into the message section of the dict
        login_signature_request_format["message"] = data
        return TypedData(**login_signature_request_format)

    @classmethod
    def verify_signatures(
        cls, typed_data: TypedData, signatures: list[str], public_key: str
    ) -> bool:
        """
        Verify the signature with the typed data, signature list and the public key
        Args:
            typed_data(TypedData): This is used for generating a message hash
                for signature verification.
            signatures(list[str]): This is a list of the signatures that represent
                the message that is signed.
            public_key(str): The public key of the signer.
        """
        int_signatures = list(map(lambda x: int(x), signatures))
        int_public_key = int(public_key, 16)
        message_hash = typed_data.message_hash(int_public_key)
        return verify_message_signature(
            message_hash, [int_signatures[3], int_signatures[4]], public_key
        )
