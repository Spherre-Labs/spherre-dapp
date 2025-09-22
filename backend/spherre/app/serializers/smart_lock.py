from marshmallow import Schema, fields
from marshmallow_enum import EnumField

from spherre.app.models.smart_lock import LockStatus


class SmartLockSerializer(Schema):
    """Serializer for SmartLock model."""

    id = fields.Str()
    lock_id = fields.Int()
    token = fields.Str()
    date_locked = fields.DateTime()
    token_amount = fields.Str()  # Using string for big int representation
    lock_duration = fields.Int()
    lock_status = EnumField(LockStatus)


class PaginationSerializer(Schema):
    """Serializer for pagination metadata."""

    page = fields.Int()
    per_page = fields.Int()
    total = fields.Int()
    total_pages = fields.Int()
    has_next = fields.Bool()
    has_prev = fields.Bool()


class SmartLockListResponseSerializer(Schema):
    """Serializer for the complete smart lock list response."""

    smart_locks = fields.Nested(SmartLockSerializer, many=True)
    pagination = fields.Nested(PaginationSerializer)
