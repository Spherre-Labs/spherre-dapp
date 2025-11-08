import {
  Abi,
  Contract,
  RpcProvider,
  type ProviderInterface,
} from 'starknet'

let sharedProvider: ProviderInterface | null = null

function getSharedProvider() {
  if (sharedProvider) {
    return sharedProvider
  }

  const nodeUrl =
    process.env.NEXT_PUBLIC_RPC_URL || 'https://alpha4.starknet.io'

  sharedProvider = new RpcProvider({
    nodeUrl,
  })

  return sharedProvider
}

export async function readContractFunction({
  functionName,
  contractAddress,
  abi,
  args = [],
  provider,
}: {
  functionName: string
  contractAddress: `0x${string}`
  abi: Abi
  args?: (string | number | bigint)[]
  provider?: ProviderInterface
}): Promise<unknown> {
  if (!abi) {
    throw new Error('No ABI found for the contract.')
  }

  const resolvedProvider = provider ?? getSharedProvider()

  // Instantiate contract
  const contract = new Contract(abi, contractAddress, resolvedProvider)

  // Dynamically call the function
  if (typeof contract[functionName] !== 'function') {
    throw new Error(
      `Function '${functionName}' does not exist on the contract.`,
    )
  }

  const result = await contract.call(functionName, args)
  return result
}
