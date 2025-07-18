import { Abi, Contract, RpcProvider } from 'starknet'

export async function readContractFunction(
  functionName: string,
  args: any[] = [],
  contract_address: `0x${string}`,
  abi: Abi,
): Promise<any> {
  const provider = new RpcProvider({
    nodeUrl: process.env.NEXT_PUBLIC_RPC_URL,
  })

  if (!abi) {
    throw new Error('No ABI found for the contract.')
  }

  // Instantiate contract
  const contract = new Contract(abi, contract_address, provider)

  // Dynamically call the function
  if (typeof contract[functionName] !== 'function') {
    throw new Error(
      `Function '${functionName}' does not exist on the contract.`,
    )
  }

  const result = await contract[functionName](...args)
  return result
}
