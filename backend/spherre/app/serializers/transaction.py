from marshmallow import Schema, fields
from marshmallow_enum import EnumField

from spherre.app.models.transaction import TransactionStatus, TransactionType


class MemberSchema(Schema):
    id = fields.String(required=True)
    name = fields.String()


class TransactionSchema(Schema):
    id = fields.String(dump_only=True)
    transaction_id = fields.Integer(required=True)
    account_id = fields.String(required=True)
    tx_type = EnumField(TransactionType, by_value=True)
    status = EnumField(TransactionStatus, by_value=True)
    proposer = fields.Nested(MemberSchema)
    executor = fields.Nested(MemberSchema, allow_none=True)
    approved = fields.List(fields.Nested(MemberSchema))
    rejected = fields.List(fields.Nested(MemberSchema))
    date_created = fields.DateTime()
    date_executed = fields.DateTime(allow_none=True)
    data = fields.Dict()
