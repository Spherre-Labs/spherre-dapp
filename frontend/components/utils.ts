export function isValidStarknetAddress(address: string) {
    // Regular expression to match the StarkNet address format (0x + 64 hexadecimal chars)
    const addressRegex = /^0x[0-9a-fA-F]{64}$/;
    
    // Check if the address matches the regex
    return addressRegex.test(address);
}
