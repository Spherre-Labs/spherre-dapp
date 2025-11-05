from marshmallow import Schema, fields


class AccountSerializer(Schema):
    id = fields.Str()
    address = fields.Str()
    name = fields.Str()
    description = fields.Str()
    is_private = fields.Bool()
    threshold = fields.Int()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()


class EmailRequestSerializer(Schema):
    email = fields.Email()
