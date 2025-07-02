'use client'

import { useReadContract } from '@starknet-react/core'
import type {
  ContractConfig,
  ContractReadResult,
  ContractFunctionArgs,
} from '@/lib/contracts/types'
import { useMemo, useCallback } from 'react'

interface UseScaffoldReadContractProps {
  contractConfig: ContractConfig
  functionName: string
  args?: ContractFunctionArgs
  enabled?: boolean
  watch?: boolean
  blockIdentifier?: 'latest' | 'pending'
}

/**
 * Enhanced useReadContract hook with type safety and argument validation
 */
export function useScaffoldReadContract<T = any>({
  contractConfig,
  functionName,
  args = {},
  enabled = true,
  watch = false,
  blockIdentifier = 'latest',
}: UseScaffoldReadContractProps): ContractReadResult<T> {
  // Convert args object to array format expected by starknet-react
  const calldata = useMemo(() => {
    if (!args || Object.keys(args).length === 0) return []
    return Object.values(args)
  }, [args])

  // Validate contract address
  const isValidAddress = useMemo(() => {
    return (
      contractConfig.address &&
      contractConfig.address !== '0x0' &&
      contractConfig.address.length > 10
    )
  }, [contractConfig.address])

  const { data, error, isLoading, refetch } = useReadContract({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    functionName,
    args: calldata,
    enabled: Boolean(enabled && isValidAddress && contractConfig.address),
    watch,
    blockIdentifier,
  })

  // Enhanced refetch with error handling
  const enhancedRefetch = useCallback(async () => {
    try {
      await refetch()
    } catch (error) {
      console.error(`Error refetching ${functionName}:`, error)
    }
  }, [refetch, functionName])

  // Process error to provide more helpful messages
  const processedError = useMemo(() => {
    if (!error) return null

    const errorMessage = error.message || error.toString()

    if (
      errorMessage.includes('NetworkError') ||
      errorMessage.includes('fetch')
    ) {
      return new Error(
        'Network error: Unable to connect to StarkNet. Please check your internet connection and try again.',
      )
    }

    if (
      errorMessage.includes('Contract not found') ||
      errorMessage.includes('CLASS_HASH_NOT_FOUND')
    ) {
      return new Error(
        'Contract not found: The contract address may be invalid or not deployed on this network.',
      )
    }

    if (
      errorMessage.includes('Entry point') ||
      errorMessage.includes('ENTRY_POINT_NOT_FOUND')
    ) {
      return new Error(
        `Function '${functionName}' not found in contract. Please check the function name.`,
      )
    }

    if (!isValidAddress) {
      return new Error('Invalid contract address provided.')
    }

    return error as Error
  }, [error, functionName, isValidAddress])

  return {
    data: data as T,
    error: processedError,
    isLoading,
    refetch: enhancedRefetch,
  }
}
