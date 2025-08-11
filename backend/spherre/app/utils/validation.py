import re

def is_valid_starknet_address(address):
    return bool(re.fullmatch(r"0x[a-fA-F0-9]{64}", address))
