import type { TokenInfo } from '../contracts/types'

/**
 * Token value conversion utilities
 */
export class TokenUtils {
  /**
   * Convert from wei to human readable format
   */
  static fromWei(value: bigint | string, decimals = 18): string {
    const bigIntValue = typeof value === 'string' ? BigInt(value) : value
    const divisor = BigInt(10 ** decimals)
    const quotient = bigIntValue / divisor
    const remainder = bigIntValue % divisor

    if (remainder === BigInt(0)) {
      return quotient.toString()
    }

    const remainderStr = remainder.toString().padStart(decimals, '0')
    const trimmedRemainder = remainderStr.replace(/0+$/, '')

    return `${quotient}.${trimmedRemainder}`
  }

  /**
   * Convert from human readable to wei
   */
  static toWei(value: string | number, decimals = 18): bigint {
    const stringValue = value.toString()
    const [whole, decimal = ''] = stringValue.split('.')

    if (decimal.length > decimals) {
      throw new Error(`Too many decimal places. Maximum ${decimals} allowed.`)
    }

    const paddedDecimal = decimal.padEnd(decimals, '0')
    return BigInt(whole + paddedDecimal)
  }

  /**
   * Format token amount with symbol
   */
  static formatTokenAmount(
    amount: bigint | string,
    token: TokenInfo,
    options: {
      showSymbol?: boolean
      maxDecimals?: number
    } = {},
  ): string {
    const { showSymbol = true, maxDecimals = 6 } = options

    let formatted = this.fromWei(amount, token.decimals)

    // Limit decimal places
    if (formatted.includes('.')) {
      const [whole, decimal] = formatted.split('.')
      if (decimal.length > maxDecimals) {
        formatted = `${whole}.${decimal.slice(0, maxDecimals)}`
      }
    }

    return showSymbol ? `${formatted} ${token.symbol}` : formatted
  }

  /**
   * Parse token amount from user input
   */
  static parseTokenAmount(input: string, decimals = 18): bigint {
    const trimmed = input.trim()

    if (!trimmed || isNaN(Number(trimmed))) {
      throw new Error('Invalid token amount')
    }

    return this.toWei(trimmed, decimals)
  }

  /**
   * Calculate percentage of total supply
   */
  static calculatePercentage(amount: bigint, total: bigint): number {
    if (total === BigInt(0)) return 0
    return Number((amount * BigInt(10000)) / total) / 100 // 2 decimal places
  }

  /**
   * Format large numbers with K, M, B suffixes
   */
  static formatLargeNumber(value: number): string {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K`
    }
    return value.toFixed(2)
  }

  /**
   * Validate token amount input
   */
  static validateTokenAmount(amount: string, maxDecimals = 18): boolean {
    const regex = new RegExp(`^\\d+(\\.\\d{1,${maxDecimals}})?$`)
    return regex.test(amount.trim())
  }
}

export const COMMON_TOKENS_SEPOLIA: {
  address: `0x${string}`
  name: string
  symbol: string
  decimals: number
}[] = [
  {
    address:
      '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  {
    address:
      '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    name: 'StarkNet Token',
    symbol: 'STRK',
    decimals: 18,
  },
]

export const COMMON_TOKENS_SEPOLIA_MAINNET: {
  address: `0x${string}`
  name: string
  symbol: string
  decimals: number
}[] = [
  {
    address:
      '0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7',
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  {
    address:
      '0x04718f5a0Fc34cC1AF16A1cdee98fFB20C31f5cD61D6Ab07201858f4287c938D',
    name: 'Starknet Token',
    symbol: 'STRK',
    decimals: 18,
  },
  {
    address:
      '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
  },
  {
    address:
      '0x053C91253BC9682c04929cA02ED00b3E423f6710D2ee7e0D5EBB06F3eCF368A8',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
  },
  {
    address:
      '0x03Fe2b97C1Fd336E750087D68B9b867997Fd64a2661fF3ca5A7C771641e8e7AC',
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    decimals: 8,
  },
]
