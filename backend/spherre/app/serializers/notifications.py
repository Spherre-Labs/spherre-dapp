from marshmallow import Schema, fields


class AccountSchema(Schema):
    address = fields.String()


class MemberSchema(Schema):
    address = fields.String()


class NotificationSchema(Schema):
    id = fields.String()
    notification_type = fields.String()
    title = fields.String(allow_none=True)
    message = fields.String()
    account = fields.Nested(AccountSchema)
    created_at = fields.DateTime()
    read_by = fields.List(fields.String())


class NotificationPreferenceSchema(Schema):
    id = fields.String()
    account = fields.Nested(AccountSchema)
    member = fields.Nested(MemberSchema)
    email_enabled = fields.Boolean()
