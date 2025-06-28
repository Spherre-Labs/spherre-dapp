import enum

from sqlalchemy import Enum

from spherre.app.extensions import db
from spherre.app.models.base import BaseModel


class NotificationType(enum.Enum):
    """
    Enum representing the type of notifications.
    """

    TRANSACTION = "transaction"
    ACCOUNT_UPDATE = "account_update"
    MEMBER_UPDATE = "member_update"
    TOKEN_TRANSFER = "token_transfer"
    NFT_TRANSFER = "nft_transfer"
