from typing import Callable, Dict

from apibara.starknet import felt
from apibara.starknet.proto.starknet_pb2 import Event
from loguru import logger
from pydantic import ValidationError

from spherre.indexer.service.types import (
    AccountCreationEvent,
    BaseEventModel,
    EventEnum,
)


class DataTransformer:
    @classmethod
    def transform_account_creation_event(cls, event: Event) -> AccountCreationEvent:
        account_address = felt.to_hex(event.data[0])
        owner = felt.to_hex(event.data[1])
        name = felt.to_hex(event.data[2])
        description = felt.to_hex(event.data[3])
        members_array_length = felt.to_int(event.data[4])
        members = []
        for i in range(5, members_array_length + 1 + 4):
            members.append(felt.to_hex(event.data[i]))
        threshold = felt.to_int(event.data[i + 1])
        deployer = felt.to_int(event.data[i + 2])
        date_deployed = felt.to_int(event.data[i + 3])
        print("Account Deployed")
        print("Account Address:", account_address)
        print("Owner:", owner)
        print("Name:", name)
        print("Description:", description)
        print("Members:", members)
        print("Threshold:", threshold)
        print("Deployer:", deployer)
        print("Date Deployed:", date_deployed)
        try:
            account_data = AccountCreationEvent(
                account_address=account_address,
                owner=owner,
                name=name,
                description=description,
                members=members,
                threshold=threshold,
                deployer=deployer,
                date_deployed=date_deployed,
            )
        except ValidationError as err:
            logger.error("Error parsing account creation event data")
            logger.error(err)
            return None
        return account_data


DATA_TRANSFORMERS: Dict[EventEnum, Callable[[Event], BaseEventModel]] = {
    EventEnum.ACCOUNT_CREATION: DataTransformer.transform_account_creation_event,
}
