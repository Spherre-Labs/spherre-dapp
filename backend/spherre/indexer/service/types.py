from enum import Enum
from typing import Any, List, get_args, get_origin

from apibara.starknet import felt
from bidict import bidict
from pydantic import BaseModel, ValidationInfo, field_validator


class EventEnum(Enum):
    ACCOUNT_CREATION = 1
    TOKEN_TRANSFER = 2
    TRANSACTION_PROPOSAL = 3
    TRANSACTION_EXECUTION = 4


EVENT_SELECTORS = bidict(
    {
        EventEnum.ACCOUNT_CREATION: felt.from_hex(
            "0x347f3a34b919109f055acc8440a003ecda76b4c63c101bbc99b9d00296db557"
        ),
        EventEnum.TOKEN_TRANSFER: felt.from_hex(
            "0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9"
        ),
        EventEnum.TRANSACTION_PROPOSAL: felt.from_hex(""),
        EventEnum.TRANSACTION_EXECUTION: felt.from_hex(""),
    }
)


class BaseEventModel(BaseModel):
    def __init__(self, *args, **kwargs):
        if args and not kwargs:
            # If only positional args provided, map to fields
            field_names = list(self.model_fields.keys())
            kwargs = dict(zip(field_names, args))
        super().__init__(**kwargs)

    @field_validator("*", mode="before")  # Apply to all fields
    @classmethod
    def restructure_data_before_parsing(cls, v: Any, info: ValidationInfo):
        field_info = cls.model_fields[info.field_name]
        field_type = field_info.annotation

        print(f"\n{info.field_name}:")
        print(f"  Annotation: {field_type}")

        new_value = v

        if isinstance(field_type, str):
            new_value = felt.to_hex(v)
            return new_value
        elif isinstance(field_type, int):
            new_value = felt.to_int(v)
        elif get_origin(field_type):
            args = get_args(field_type)
            if isinstance(args, str):
                new_value = [felt.to_hex(val) for val in v]
            elif isinstance(args, int):
                new_value = [felt.to_int(val) for val in v]

        return new_value


class AccountCreationEvent(BaseEventModel):
    account_address: str
    owner: str
    name: str
    description: str
    members: List[str]
    threshold: int
    deployer: int
    date_deployed: int
