from marshmallow import Schema, fields


class AccountSchema(Schema):
    address = fields.String()
    email = fields.String(allow_none=True)


class NotificationSchema(Schema):
    id = fields.String()
    notification_type = fields.String()
    title = fields.String(allow_none=True)
    message = fields.String()
    account = fields.Nested(AccountSchema)
    created_at = fields.DateTime()
    read_by = fields.List(fields.String())
