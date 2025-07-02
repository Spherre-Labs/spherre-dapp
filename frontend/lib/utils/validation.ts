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
