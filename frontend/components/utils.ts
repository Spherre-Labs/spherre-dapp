export function isValidStarknetAddress(address: string) {
  // Regular expression to match the StarkNet address format (0x + 64 hexadecimal chars)
  const addressRegex = /^0x[0-9a-fA-F]{64}$/

  // Check if the address matches the regex
  return addressRegex.test(address)
}

export function sliceWalletAddress(
  address: `0x${string}` | null,
  start: number = 6,
  end: number = 4,
): string {
  if (!address) return 'null'
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}
