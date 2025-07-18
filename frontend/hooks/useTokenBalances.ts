import { useState, useEffect } from 'react'
import { useAccount } from '@starknet-react/core'
import { COMMON_TOKENS_SEPOLIA } from '@/lib'
import { readContractFunction } from '@/lib/utils/blockchain'
import { ERC20_ABI } from '@/lib/contracts/erc20-contracts'

export type TokenDisplay = {
  coin: string
  price: string
  balance: string
  value: string
  size: string
}

export function useTokenBalances() {
  const { address } = useAccount()
  const [loadingTokenData, setLoadingTokenData] = useState(false)
  const [tokensDisplay, setTokensDisplay] = useState<TokenDisplay[]>([])

  useEffect(() => {
    if (!address) return

    async function getBalances() {
      try {
        setLoadingTokenData(true)

        const prices: Record<string, number> = {
          ETH: 3000, // Dummy ETH price
          STRK: 0.46, // Dummy STRK price
        }

        const rawData: {
          symbol: string
          decimals: number
          balance: bigint
        }[] = []

        for (const token of COMMON_TOKENS_SEPOLIA) {
          const balance = await readContractFunction(
            'balance_of',
            [address],
            token.address,
            ERC20_ABI,
          )

          rawData.push({
            symbol: token.symbol,
            decimals: token.decimals,
            balance: balance as bigint,
          })
        }

        const tokenWithValues = rawData.map((t) => {
          const floatBalance = Number(t.balance) / 10 ** t.decimals
          const price = prices[t.symbol] ?? 1
          const value = floatBalance * price

          return {
            coin: t.symbol,
            price,
            balance: floatBalance,
            value,
          }
        })

        const totalValue = tokenWithValues.reduce((acc, t) => acc + t.value, 0)

        const finalDisplay: TokenDisplay[] = tokenWithValues.map((t) => ({
          coin: t.coin,
          price: `$${t.price.toFixed(2)}`,
          balance: t.balance.toFixed(2),
          value: `$${t.value.toFixed(2)}`,
          size:
            totalValue > 0
              ? `${((t.value / totalValue) * 100).toFixed(2)}%`
              : '0%',
        }))

        setTokensDisplay(finalDisplay)
      } catch (err) {
        console.error('Balance fetch error:', err)
      } finally {
        setLoadingTokenData(false)
      }
    }

    getBalances()
  }, [address])

  return {
    tokensDisplay,
    loadingTokenData,
  }
}
