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
  const feltStr = felt.toString()
  try {
    // Validate the input can be converted to BigInt
    const feltBigInt = BigInt(feltStr)
    // Convert to hex and ensure it's 64 characters (32 bytes)
    const hex = feltBigInt.toString(16)
    const paddedHex = hex.padStart(64, '0')
    return `0x${paddedHex}`
  } catch (error) {
    throw new Error(`Invalid felt value: ${feltStr}. Error: ${error}`)
  }
}

// Convert Starknet address to felt value
export function addressToFelt(address: string): string {
  // Reuse existing validation
  if (!isValidStarknetAddress(address)) {
    throw new Error('Invalid Starknet address format')
  }
  const hex = address.slice(2) // Remove 0x prefix
  return BigInt(`0x${hex}`).toString()
}

// Convert ByteArray (felt values) back to string
export function byteArrayToString(byteArray: string[]): string {
  console.log('Converting ByteArray:', byteArray)

  if (!Array.isArray(byteArray) || byteArray.length === 0) {
    console.log('Empty or invalid ByteArray')
    return ''
  }

  try {
    // The first element is the number of full words
    const numFullWords = parseInt(byteArray[0])
    console.log('Number of full words:', numFullWords)

    const result: number[] = []

    // Process full words (31 bytes each)
    for (let i = 1; i <= numFullWords; i++) {
      if (byteArray[i]) {
        console.log(`Processing word ${i}:`, byteArray[i])
        const hex = BigInt(byteArray[i]).toString(16)
        const paddedHex = hex.padStart(62, '0') // 31 bytes = 62 hex chars
        console.log(`Word ${i} hex:`, paddedHex)
        const bytes = Buffer.from(paddedHex, 'hex')
        result.push(...Array.from(bytes))
      }
    }

    // Process remaining bytes
    if (byteArray[numFullWords + 1]) {
      console.log('Processing remaining bytes:', byteArray[numFullWords + 1])
      const remainingHex = BigInt(byteArray[numFullWords + 1]).toString(16)
      const paddedRemainingHex = remainingHex.padStart(62, '0')
      console.log('Remaining hex:', paddedRemainingHex)
      const remainingBytes = Buffer.from(paddedRemainingHex, 'hex')
      const remainingLength = parseInt(byteArray[byteArray.length - 1])
      console.log('Remaining length:', remainingLength)
      result.push(...Array.from(remainingBytes.slice(0, remainingLength)))
    }

    console.log('Final bytes array:', result)
    // Convert bytes to string
    const finalString = new TextDecoder().decode(new Uint8Array(result))
    console.log('Final string:', finalString)
    return finalString
  } catch (error) {
    console.warn('Failed to convert ByteArray to string:', error)
    return ''
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
