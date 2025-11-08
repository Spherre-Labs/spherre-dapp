from apibara.indexer import IndexerRunner, IndexerRunnerConfiguration, Info
from apibara.indexer.indexer import IndexerConfiguration
from apibara.protocol.proto.stream_pb2 import Cursor, DataFinality
from apibara.starknet import EventFilter, Filter, StarkNetIndexer, felt
from apibara.starknet.cursor import starknet_cursor
from apibara.starknet.proto.starknet_pb2 import Block
from loguru import logger
from pydantic import ValidationError

from spherre.indexer.config import NETWORK, SPHERRE_CONTRACT_ADDRESS
from spherre.indexer.service.event_handlers import EventHandlers
from spherre.indexer.service.types import (
    EVENT_SELECTORS,
    AccountCreationEvent,
    EventEnum,
)


class SpherreMainIndexer(StarkNetIndexer):
    def start_account_indexer(self, address: str):
        pass

    def indexer_id(self) -> str:
        return "spherre"

    def initial_configuration(self) -> Filter:
        # Return initial configuration of the indexer.
        address = felt.from_hex(SPHERRE_CONTRACT_ADDRESS)
        return IndexerConfiguration(
            filter=Filter().add_event(
                EventFilter()
                .with_from_address(address)
                .with_keys([EVENT_SELECTORS[EventEnum.ACCOUNT_CREATION]])
            ),
            starting_cursor=starknet_cursor(10_000),
            finality=DataFinality.DATA_STATUS_ACCEPTED,
        )

    async def handle_data(self, info: Info, data: Block):
        # Handle one block of data
        for event_with_tx in data.events:
            tx_hash = felt.to_hex(event_with_tx.transaction.meta.hash)
            event = event_with_tx.event

            account_address = felt.to_hex(event.data[0])
            owner = felt.to_hex(event.data[1])
            name = felt.to_hex(event.data[2])
            description = felt.to_hex(event.data[3])
            members_array_length = felt.to_int(event.data[4])
            members = []
            for i in range(5, members_array_length + 1 + 4):
                members.append(felt.to_hex(event.data[i]))
            threshold = felt.to_int(event.data[i + 1])
            deployer = felt.to_hex(event.data[i + 2])
            date_deployed = felt.to_int(event.data[i + 3])

            print("Account Deployed")
            print("Transaction Hash:", tx_hash)
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
                # handle the account creation event
                EventHandlers.handle_account_creation(account_data)
                # start a new account indexer in another thread
            except ValidationError as err:
                logger.error("Error parsing account creation event data")
                logger.error(err)

    async def handle_invalidate(self, _info: Info, _cursor: Cursor):
        raise ValueError("data must be finalized")


class AccountIndexer(StarkNetIndexer):
    def __init__(self, account_address: str):
        self.account_address = account_address
        super().__init__()

    def indexer_id(self) -> str:
        return self.account_address

    def initial_configuration(self) -> Filter:
        # Return initial configuration of the indexer.
        address = felt.from_hex(SPHERRE_CONTRACT_ADDRESS)
        return IndexerConfiguration(
            filter=Filter().add_event(
                EventFilter()
                .with_from_address(address)
                .with_keys(list(EVENT_SELECTORS.values()))
            ),
            starting_cursor=starknet_cursor(10_000),
            finality=DataFinality.DATA_STATUS_ACCEPTED,
        )

    def handle_data(self, info, data):
        pass


async def run_indexer(
    server_url=None,
    mongo_url=None,
    restart=None,
    dna_token=None,
    indexer_cls=None,
    indexer_args=None,
):
    runner = IndexerRunner(
        config=IndexerRunnerConfiguration(
            stream_url=server_url,
            storage_url=mongo_url,
            token=dna_token,
        ),
        reset_state=restart,
    )

    await runner.run(indexer_cls(indexer_args), ctx={"network": NETWORK})


async def run_main_indexer(
    server_url=None, mongo_url=None, restart=None, dna_token=None
):
    runner = IndexerRunner(
        config=IndexerRunnerConfiguration(
            stream_url=server_url,
            storage_url=mongo_url,
            token=dna_token,
        ),
        reset_state=restart,
    )

    await runner.run(SpherreMainIndexer(), ctx={"network": NETWORK})
