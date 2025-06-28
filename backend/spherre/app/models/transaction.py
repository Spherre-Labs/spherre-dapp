import enum

from sqlalchemy import JSON, Enum

from spherre.app.extensions import db
from spherre.app.models.base import ModelMixin


class TransactionType(enum.Enum):
    """
    Enum representing the type of transactions in the account.
    """

    TOKEN_SEND = "token_send"
    NFT_SEND = "nft_send"
    MEMBER_REMOVE = "member_remove"
    MEMBER_ADD = "member_add"
    PERMISSION_EDIT = "permission_edit"
    THRESHOLD_CHANGE = "threshold_change"


class TransactionStatus(enum.Enum):
    """
    Enum representing the status of a transaction.
    """

    INITIATED = 1
    REJECTED = 2
    APPROVED = 3
    EXECUTED = 4


approved_members = db.Table(
    "approved_members",
    db.Column(
        "transaction_id", db.String, db.ForeignKey("transactions.id"), primary_key=True
    ),
    db.Column("member_id", db.String, db.ForeignKey("members.id"), primary_key=True),
)
rejected_members = db.Table(
    "rejected_members",
    db.Column(
        "transaction_id", db.String, db.ForeignKey("transactions.id"), primary_key=True
    ),
    db.Column("member_id", db.String, db.ForeignKey("members.id"), primary_key=True),
)


class Transaction(ModelMixin, db.Model):
    """
    Model representing a transaction in the account.
    """

    __tablename__ = "transactions"

    transaction_id = db.Column(db.Integer, nullable=False)
    account_id = db.Column(db.String, db.ForeignKey("accounts.id"), nullable=False)
    tx_type = db.Column(Enum(TransactionType), nullable=False)
    status = db.Column(
        Enum(TransactionStatus), default=TransactionStatus.INITIATED, nullable=False
    )
    proposer_id = db.Column(db.String, db.ForeignKey("members.id"), nullable=False)
    executor_id = db.Column(db.String, db.ForeignKey("members.id"), nullable=True)
    proposer = db.relationship(
        "Member", foreign_keys=[proposer_id], backref="proposed_transactions"
    )
    executor = db.relationship(
        "Member", foreign_keys=[executor_id], backref="executed_transactions"
    )
    approved = db.relationship(
        "Member",
        secondary=approved_members,
        backref=db.backref("approved_transactions", lazy="dynamic"),
        lazy="dynamic",
    )
    rejected = db.relationship(
        "Member",
        secondary=rejected_members,
        backref=db.backref("rejected_transactions", lazy="dynamic"),
        lazy="dynamic",
    )
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_executed = db.Column(db.DateTime, nullable=True)
    data = db.Column(JSON, nullable=True)
