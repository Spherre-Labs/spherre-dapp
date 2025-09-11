from marshmallow import Schema, ValidationError, fields, post_load, validates

from spherre.app.service.auth import AuthService


class SignInSerializer(Schema):
    """
    Serializer class for the sign in request call.
    It validates the signstures to ensure it is the right user that is
    making the signin request.
    This is for signing in with the wallet (account).

    Data:
        signatures: A list of strings representing the signatures of
            the signed login message
        public_key: The public key of the signer
    """

    signatures = fields.List(fields.Integer(), required=True)
    public_key = fields.String(required=True)

    @validates("signatures")
    def validate_signatures(self, signatures: list[int], data_key: str):
        if len(signatures) < 5:
            raise ValidationError("Signatures must be a list of 5 integers")

    @post_load
    def validate_signin_request(self, data: dict, **kwargs):
        if not AuthService.validate_signin_request(
            data["signatures"], data["public_key"]
        ):
            raise ValidationError("Invalid signatures")
        data["address"] = AuthService.generate_address_from_public_key(
            data["public_key"]
        )
        return data
