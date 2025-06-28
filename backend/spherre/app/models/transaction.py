import enum

from sqlalchemy import Enum

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
