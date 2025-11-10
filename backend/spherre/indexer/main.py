import asyncio
from functools import wraps

import click

from spherre.indexer.config import DNA_TOKEN, MONGO_URL, SERVER_URL
from spherre.indexer.service.indexers import run_main_indexer


def async_command(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        return asyncio.run(f(*args, **kwargs))

    return wrapper


@click.group()
def cli():
    pass


@cli.command()
@click.option("--server-url", default=None, help="Apibara stream url.")
@click.option("--mongo-url", default=None, help="MongoDB url.")
@click.option("--restart", is_flag=True, help="Restart indexing from the beginning.")
@async_command
async def start(server_url, mongo_url, restart):
    """Start the indexer."""
    if server_url is None:
        server_url = SERVER_URL
    if mongo_url is None:
        mongo_url = MONGO_URL

    print("Starting Apibara indexer...")
    print(f"Server url: {server_url}")
    await run_main_indexer(
        restart=restart,
        server_url=server_url,
        mongo_url=mongo_url,
        dna_token=DNA_TOKEN,
    )
