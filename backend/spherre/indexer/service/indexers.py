from apibara.indexer import IndexerRunner, IndexerRunnerConfiguration, Info
from apibara.indexer.indexer import IndexerConfiguration
from apibara.protocol.proto.stream_pb2 import Cursor, DataFinality
from apibara.starknet import EventFilter, Filter, StarkNetIndexer, felt
from apibara.starknet.cursor import starknet_cursor
from apibara.starknet.proto.starknet_pb2 import Block

from spherre.indexer.config import NETWORK, SPHERRE_CONTRACT_ADDRESS
from spherre.indexer.service.types import EVENT_SELECTORS, EventEnum


class SpherreMainIndexer(StarkNetIndexer):
    def start_account_indexer(self, address: str):
        pass

    def indexer_id(self) -> str:
        return "starknet-example"

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

            from_addr = felt.to_hex(event.data[0])
            to_addr = felt.to_hex(event.data[1])
            token_id = felt.to_int(event.data[2]) + (felt.to_int(event.data[3]) << 128)
            print("Transfer")
            print(f"   Tx Hash: {tx_hash}")
            print(f"      From: {from_addr}")
            print(f"        To: {to_addr}")
            print(f"  Token ID: {token_id}")
            print()

    async def handle_invalidate(self, _info: Info, _cursor: Cursor):
        raise ValueError("data must be finalized")


class AccountIndexer(StarkNetIndexer):
    pass


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
