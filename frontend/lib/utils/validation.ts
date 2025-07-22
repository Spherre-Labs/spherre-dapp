// Re-export your existing validation function and add more
export function isValidStarknetAddress(address: string): boolean {
  const addressRegex = /^0x[0-9a-fA-F]{64}$/
  return addressRegex.test(address)
}

export function validateContractAddress(address: string): void {
  if (!isValidStarknetAddress(address)) {
    throw new Error(`Invalid StarkNet contract address: ${address}`)
  }
}

// Convert felt value to Starknet address
export function feltToAddress(felt: string | number | bigint): string {
  // Convert to string and ensure it's a valid number
  const feltStr = felt.toString()

  // Convert to hex and ensure it's 64 characters (32 bytes)
  const hex = BigInt(feltStr).toString(16)
  const paddedHex = hex.padStart(64, '0')

  return `0x${paddedHex}`
}

// Convert Starknet address to felt value
export function addressToFelt(address: string): string {
  if (!address.startsWith('0x')) {
    throw new Error('Address must start with 0x')
  }

  const hex = address.slice(2) // Remove 0x prefix
  return BigInt(`0x${hex}`).toString()
}

export function validatePositiveInteger(
  value: number,
  fieldName: string,
): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive integer`)
  }
}

export function validateArrayNotEmpty<T>(array: T[], fieldName: string): void {
  if (!Array.isArray(array) || array.length === 0) {
    throw new Error(`${fieldName} cannot be empty`)
  }
}

export function validateUniqueAddresses(addresses: string[]): void {
  const uniqueAddresses = new Set(addresses.map((addr) => addr.toLowerCase()))
  if (uniqueAddresses.size !== addresses.length) {
    throw new Error('All addresses must be unique')
  }
}
