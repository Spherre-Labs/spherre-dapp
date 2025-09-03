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
