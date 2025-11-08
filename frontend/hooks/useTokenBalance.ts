import { useAccount, useBalance } from '@starknet-react/core'
import { useState, useEffect } from 'react'
import { DEFAULT_TOKEN } from '@/lib/contracts/token-contracts'

export const useTokenBalance = (
  tokenAddress?: `0x${string}`,
  walletAddress?: `0x${string}`,
) => {
  const { address } = useAccount()
  const [balance, setBalance] = useState(0)

  const {
    data,
    error,
    refetch,
    isFetching,
  } = useBalance({
    address: walletAddress || address,
    token: tokenAddress || DEFAULT_TOKEN,
    enabled: !!(walletAddress || address),
    watch: true,
  })

  useEffect(() => {
    if (data) {
      setBalance(Number(data.formatted))
    }
  }, [data])

  useEffect(() => {
    if (!address && !walletAddress) return

    const interval = setInterval(() => {
      if (refetch) {
        void refetch()
      }
    }, 15000)

    return () => {
      clearInterval(interval)
    }
  }, [address, walletAddress, refetch])

  return {
    balance,
    symbol: data?.symbol,
    decimals: data?.decimals,
    isLoading: isFetching,
    error,
    refresh: () => {
      if (refetch) {
        void refetch()
      }
    },
  }
}
