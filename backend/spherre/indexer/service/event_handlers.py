from spherre.indexer.service.types import AccountCreationEvent


class EventHandlers:
    @classmethod
    def handle_account_creation(cls, data: AccountCreationEvent):
        pass

    @classmethod
    def handle_token_transafer(cls):
        pass
