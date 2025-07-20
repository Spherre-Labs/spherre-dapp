import { useAccount, useBalance } from '@starknet-react/core'
import { useState, useEffect } from 'react'
import { DEFAULT_TOKEN } from '@/lib/contracts/token-contracts'

export const useTokenBalance = (
  tokenAddress?: `0x${string}`,
  walletAddress?: `0x${string}`,
) => {
  const { address } = useAccount()
  const [balance, setBalance] = useState(0)

  const { data, error } = useBalance({
    address: walletAddress || address,
    token: tokenAddress || DEFAULT_TOKEN,
    enabled: !!address,
  })

  useEffect(() => {
    if (data) {
      setBalance(Number(data.formatted))
    }
  }, [data])

  return { balance, symbol: data?.symbol, decimals: data?.decimals }
}
