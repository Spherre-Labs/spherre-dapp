import { useState, useEffect, useContext } from 'react'
import { COMMON_TOKENS_SEPOLIA } from '@/lib'
import { readContractFunction } from '@/lib/utils/blockchain'
import { ERC20_ABI } from '@/lib/contracts/erc20-contracts'
import { SpherreAccountContext } from '@/app/context/account-context'
import {
  getETHPrice,
  getETHPriceEquivalent,
  getSTRKPrice,
  getSTRKPriceEquivalent,
  tokenPriceFecther,
} from '@/lib/utils/token_prices'

export type TokenDisplay = {
  coin: string
  price: string
  balance: string
  value: string
  size: string
  contract_address: `0x${string}`
  id: string
}

export function useTokenBalances() {
  const { accountAddress } = useContext(SpherreAccountContext)
  const [loadingTokenData, setLoadingTokenData] = useState(false)
  const [tokensDisplay, setTokensDisplay] = useState<TokenDisplay[]>([])
  const [totalValue, setTotalValue] = useState(0)

  useEffect(() => {
    if (!accountAddress) return

    const getBalances = async () => {
      try {
        setLoadingTokenData(true)

        const rawData: {
          symbol: string
          decimals: number
          balance: bigint
          contract_address: `0x${string}`
          id: string
        }[] = []

        for (const token of COMMON_TOKENS_SEPOLIA) {
          try {
            const balance = await readContractFunction({
              functionName: 'balance_of',
              contractAddress: token.address,
              abi: ERC20_ABI,
              args: [accountAddress],
            })

            rawData.push({
              symbol: token.symbol,
              decimals: token.decimals,
              balance: balance as bigint,
              contract_address: token.address,
              id: token.id,
            })
          } catch (error) {
            console.warn(`Failed to fetch balance for ${token.symbol}:`, error)
            rawData.push({
              symbol: token.symbol,
              decimals: token.decimals,
              balance: BigInt(0),
              contract_address: token.address,
              id: token.id,
            })
          }
        }

        const tokenWithValues = await Promise.all(
          rawData.map(async (t) => {
            const divisor = BigInt(10 ** t.decimals)
            const floatBalance = Number(t.balance) / Number(divisor)

            if (floatBalance === Infinity || isNaN(floatBalance)) {
              console.warn(`Balance conversion overflow for token ${t.symbol}`)
              return {
                coin: t.symbol,
                price: 0,
                balance: 0,
                value: 0,
              }
            }

            let value = 0
            let price = 0

            if (tokenPriceFecther[t.symbol]) {
              try {
                price = await tokenPriceFecther[t.symbol]()
                value = price * floatBalance
              } catch (error) {
                console.warn(`Failed to fetch price for ${t.symbol}:`, error)
                price = 0
                value = 0
              }
            }

            return {
              coin: t.symbol,
              price,
              balance: floatBalance,
              value,
              contract_address: t.contract_address,
              id: t.id,
            }
          }),
        )

        const totalValue = tokenWithValues.reduce((acc, t) => acc + t.value, 0)
        setTotalValue(totalValue)

        const finalDisplay: TokenDisplay[] = tokenWithValues.map((t) => ({
          coin: t.coin,
          price: `$${t.price.toFixed(2)}`,
          balance: t.balance.toFixed(2),
          value: `$${t.value.toFixed(2)}`,
          size:
            totalValue > 0
              ? `${((t.value / totalValue) * 100).toFixed(2)}%`
              : '0%',
          contract_address: t.contract_address as `0x${string}`,
          id: t.id as string,
        }))

        setTokensDisplay(finalDisplay)
      } catch (err) {
        console.error('Balance fetch error:', err)
      } finally {
        setLoadingTokenData(false)
      }
    }

    getBalances()
  }, [accountAddress])

  return {
    tokensDisplay,
    loadingTokenData,
    totalValue,
  }
}
