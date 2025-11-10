from apibara.indexer import IndexerRunner, IndexerRunnerConfiguration, Info
from apibara.indexer.indexer import IndexerConfiguration
from apibara.protocol.proto.stream_pb2 import Cursor, DataFinality
from apibara.starknet import EventFilter, Filter, StarkNetIndexer, felt
from apibara.starknet.cursor import starknet_cursor
from apibara.starknet.proto.starknet_pb2 import Block
from loguru import logger

from spherre.indexer.config import NETWORK, SPHERRE_CONTRACT_ADDRESS
from spherre.indexer.service.event_handlers import DATA_HANDLERS
from spherre.indexer.service.types import (
    EVENT_SELECTORS,
    EventEnum,
)
from spherre.indexer.service.utils import DATA_TRANSFORMERS


class SpherreMainIndexer(StarkNetIndexer):
    def start_account_indexer(self, address: str):
        # create a new filter for the account address
        account_address = felt.from_hex(address)
        filter = (
            EventFilter()
            .with_from_address(account_address)
            .with_keys([EVENT_SELECTORS.values()])
        )
        # add the filter to the indexer
        self.update_filter(filter)

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
            event_address = felt.to_hex(event.from_address)
            logger.info("Transaction Hash:", tx_hash)

            if event_address != SPHERRE_CONTRACT_ADDRESS:
                event_type = event.keys
                event_enum = EVENT_SELECTORS.inverse[event_type]
                transformed_data = DATA_TRANSFORMERS[event_enum](event)
                if transformed_data:
                    DATA_HANDLERS[event_enum](transformed_data)
                    logger.info(
                        (
                            f"Event with type '{event_type}' from address"
                            f"'{event_address}' handled"
                        )
                    )
                else:
                    logger.error(
                        (
                            f"Failed to handle event of type '{event_type}'"
                            f"from address '{event_address}'"
                        )
                    )
            else:
                event_type = event.keys
                if event_type == EVENT_SELECTORS[EventEnum.ACCOUNT_CREATION]:
                    transformed_data = DATA_TRANSFORMERS[EventEnum.ACCOUNT_CREATION](
                        event
                    )
                    if transformed_data:
                        DATA_HANDLERS[EventEnum.ACCOUNT_CREATION](transformed_data)
                        self.start_account_indexer(transformed_data.account_address)
                        logger.info(
                            (
                                "Account created for address "
                                f"'{transformed_data.account_address}'"
                            )
                        )
                    else:
                        account_address = felt.to_hex(event.data[0])
                        logger.error(
                            (
                                "Failed to handle account creation event"
                                f"of address '{account_address}'"
                            )
                        )

    async def handle_invalidate(self, _info: Info, _cursor: Cursor):
        raise ValueError("data must be finalized")


def run_in_thread(self):
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
