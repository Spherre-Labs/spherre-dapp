import { Abi, Contract, RpcProvider, ArgsOrCalldata } from 'starknet'

export async function readContractFunction(
  functionName: string,
  contract_address: `0x${string}`,
  abi: Abi,
  args: ArgsOrCalldata[] = [],
): Promise<unknown> {
  if (!abi) {
    throw new Error('No ABI found for the contract.')
  }

  // Instantiate contract
  const contract = new Contract(abi, contract_address)

  // Dynamically call the function
  if (typeof contract[functionName] !== 'function') {
    throw new Error(
      `Function '${functionName}' does not exist on the contract.`,
    )
  }

  const result = await contract.call(functionName, args)
  return result
}
