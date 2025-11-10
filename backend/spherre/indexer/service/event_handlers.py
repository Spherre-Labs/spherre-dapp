from typing import Callable, Dict

from spherre.indexer.service.types import (
    AccountCreationEvent,
    BaseEventModel,
    EventEnum,
)


class EventHandlers:
    @classmethod
    def handle_account_creation(cls, data: AccountCreationEvent):
        pass

    @classmethod
    def handle_token_transafer(cls):
        pass


DATA_HANDLERS: Dict[EventEnum, Callable[[BaseEventModel], None]] = {
    EventEnum.ACCOUNT_CREATION: EventHandlers.handle_account_creation,
    EventEnum.TOKEN_TRANSFER: EventHandlers.handle_token_transafer,
}
