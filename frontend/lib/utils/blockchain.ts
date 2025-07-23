import { Abi, Contract } from 'starknet'

export async function readContractFunction({
  functionName,
  contractAddress,
  abi,
  args = [],
}: {
  functionName: string
  contractAddress: `0x${string}`
  abi: Abi
  args?: (string | number | bigint)[]
}): Promise<unknown> {
  if (!abi) {
    throw new Error('No ABI found for the contract.')
  }

  // Instantiate contract
  const contract = new Contract(abi, contractAddress)

  // Dynamically call the function
  if (typeof contract[functionName] !== 'function') {
    throw new Error(
      `Function '${functionName}' does not exist on the contract.`,
    )
  }

  const result = await contract.call(functionName, args)
  return result
}
