import { useState, useEffect, useContext } from 'react'
import { COMMON_TOKENS_SEPOLIA } from '@/lib'
import { readContractFunction } from '@/lib/utils/blockchain'
import { ERC20_ABI } from '@/lib/contracts/erc20-contracts'
import { SpherreAccountContext } from '@/app/context/account-context'
import { tokenPriceFecther } from '@/lib/utils/token_prices'

const UINT128 = BigInt(2) ** BigInt(128)
const POLL_INTERVAL_MS = 15_000
const STALE_THRESHOLD_MS = 30_000

type BalancesState = {
  tokensDisplay: TokenDisplay[]
  totalValue: number
  lastUpdated: number | null
  loadingTokenData: boolean
}

const createDefaultState = (): BalancesState => ({
  tokensDisplay: [],
  totalValue: 0,
  lastUpdated: null,
  loadingTokenData: false,
})

const balanceStore = new Map<string, BalancesState>()
const balanceSubscribers = new Map<string, Set<(state: BalancesState) => void>>()
const pollers = new Map<string, ReturnType<typeof setInterval>>()
const inFlightRequests = new Set<string>()

function normalizeToBigInt(value: unknown): bigint {
  if (typeof value === 'bigint') {
    return value
  }

  if (typeof value === 'number') {
    return BigInt(Math.floor(value))
  }

  if (typeof value === 'string') {
    try {
      return BigInt(value)
    } catch {
      return BigInt(0)
    }
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return BigInt(0)
    }
    if (value.length === 2) {
      const [low, high] = value
      return normalizeToBigInt({
        low,
        high,
      })
    }

    return normalizeToBigInt(value[0])
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>

    if ('balance' in record) {
      return normalizeToBigInt(record.balance)
    }

    const lowCandidate =
      record.low ?? record.lo ?? record.LOW ?? record[0] ?? undefined
    const highCandidate =
      record.high ?? record.hi ?? record.HIGH ?? record[1] ?? undefined

    if (lowCandidate !== undefined && highCandidate !== undefined) {
      try {
        const low = normalizeToBigInt(lowCandidate)
        const high = normalizeToBigInt(highCandidate)
        return high * UINT128 + low
      } catch {
        return BigInt(0)
      }
    }
  }

  return BigInt(0)
}

function getCurrentState(address: `0x${string}`): BalancesState {
  return balanceStore.get(address) ?? createDefaultState()
}

function updateState(
  address: `0x${string}`,
  updates: Partial<BalancesState>,
): void {
  const previous = balanceStore.get(address) ?? createDefaultState()
  const next: BalancesState = {
    ...previous,
    ...updates,
  }

  balanceStore.set(address, next)

  const listeners = balanceSubscribers.get(address)
  if (listeners) {
    for (const listener of listeners) {
      listener(next)
    }
  }
}

function subscribeToBalances(
  address: `0x${string}`,
  listener: (state: BalancesState) => void,
): () => void {
  let listeners = balanceSubscribers.get(address)
  if (!listeners) {
    listeners = new Set()
    balanceSubscribers.set(address, listeners)
  }

  listeners.add(listener)

  if (listeners.size === 1) {
    startPolling(address)
  }

  return () => {
    const currentListeners = balanceSubscribers.get(address)
    currentListeners?.delete(listener)

    if (currentListeners && currentListeners.size === 0) {
      balanceSubscribers.delete(address)
      stopPolling(address)
    }
  }
}

function startPolling(address: `0x${string}`) {
  if (pollers.has(address)) {
    return
  }

  const id = setInterval(() => {
    void fetchBalances(address)
  }, POLL_INTERVAL_MS)

  pollers.set(address, id)
}

function stopPolling(address: `0x${string}`) {
  const poller = pollers.get(address)
  if (poller !== undefined) {
    clearInterval(poller)
    pollers.delete(address)
  }
}

async function fetchBalances(
  address: `0x${string}`,
  options: { force?: boolean; showLoading?: boolean } = {},
): Promise<void> {
  const { force = false, showLoading = false } = options

  if (inFlightRequests.has(address) && !force) {
    return
  }

  if (inFlightRequests.has(address) && force) {
    // Let the existing request finish instead of starting a second one
    return
  }

  const currentState = balanceStore.get(address) ?? createDefaultState()
  const shouldShowLoading =
    showLoading || currentState.tokensDisplay.length === 0

  if (shouldShowLoading) {
    updateState(address, { loadingTokenData: true })
  }

  inFlightRequests.add(address)

  try {
    const rawData: {
      symbol: string
      decimals: number
      balance: bigint
      contract_address: `0x${string}`
      id: string
    }[] = []

    for (const token of COMMON_TOKENS_SEPOLIA) {
      try {
        const balanceResult = await readContractFunction({
          functionName: 'balance_of',
          contractAddress: token.address,
          abi: ERC20_ABI,
          args: [address],
        })

        rawData.push({
          symbol: token.symbol,
          decimals: token.decimals,
          balance: normalizeToBigInt(balanceResult),
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
        const divisor = BigInt(10) ** BigInt(t.decimals)
        const floatBalance =
          Number(t.balance) / Number(divisor === BigInt(0) ? BigInt(1) : divisor)

        if (!Number.isFinite(floatBalance)) {
          console.warn(`Balance conversion overflow for token ${t.symbol}`)
          return {
            coin: t.symbol,
            price: 0,
            balance: 0,
            value: 0,
            contract_address: t.contract_address,
            id: t.id,
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

    const computedTotalValue = tokenWithValues.reduce(
      (acc, t) => acc + t.value,
      0,
    )

    const finalDisplay: TokenDisplay[] = tokenWithValues.map((t) => ({
      coin: t.coin,
      price: `$${t.price.toFixed(2)}`,
      balance: t.balance.toFixed(4),
      value: `$${t.value.toFixed(2)}`,
      size:
        computedTotalValue > 0
          ? `${((t.value / computedTotalValue) * 100).toFixed(2)}%`
          : '0%',
      contract_address: t.contract_address as `0x${string}`,
      id: t.id as string,
    }))

    updateState(address, {
      tokensDisplay: finalDisplay,
      totalValue: computedTotalValue,
      lastUpdated: Date.now(),
      loadingTokenData: false,
    })
  } catch (error) {
    console.error('Balance fetch error:', error)
    updateState(address, { loadingTokenData: false })
  } finally {
    inFlightRequests.delete(address)
  }
}

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
  const [state, setState] = useState<BalancesState>(createDefaultState())

  useEffect(() => {
    if (!accountAddress) {
      setState(createDefaultState())
      return
    }

    setState(getCurrentState(accountAddress))

    const listener = (next: BalancesState) => {
      setState(next)
    }

    const unsubscribe = subscribeToBalances(accountAddress, listener)

    const current = getCurrentState(accountAddress)
    const isStale =
      !current.lastUpdated ||
      Date.now() - current.lastUpdated > STALE_THRESHOLD_MS

    if (!current.tokensDisplay.length || isStale) {
      void fetchBalances(accountAddress, { force: true, showLoading: false })
    }

    return () => {
      unsubscribe()
    }
  }, [accountAddress])

  const refreshBalances = () => {
    if (accountAddress) {
      void fetchBalances(accountAddress, { force: true })
    }
  }

  return {
    tokensDisplay: state.tokensDisplay,
    loadingTokenData: state.loadingTokenData,
    totalValue: state.totalValue,
    refreshBalances,
    lastUpdated: state.lastUpdated ? new Date(state.lastUpdated) : null,
  }
}
