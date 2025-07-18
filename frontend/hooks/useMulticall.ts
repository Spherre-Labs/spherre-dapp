'use client'

import {
  useSendTransaction,
  useTransactionReceipt,
  useAccount,
} from '@starknet-react/core'
import type {
  ContractConfig,
  ContractFunctionArgs,
} from '@/lib/contracts/types'
import { useCallback, useState, useMemo } from 'react'
import type { InvokeFunctionResponse } from 'starknet'
import { Contract } from 'starknet'

interface MulticallCall {
  contractConfig: ContractConfig
  functionName: string
  args: ContractFunctionArgs
}

interface UseMulticallProps {
  onSuccess?: (data: InvokeFunctionResponse) => void
  onError?: (error: Error) => void
}

interface MulticallResult {
  writeAsync: (calls: MulticallCall[]) => Promise<InvokeFunctionResponse>
  data: InvokeFunctionResponse | undefined
  error: Error | null
  isLoading: boolean
  isSuccess: boolean
  reset: () => void
}

/**
 * Enhanced multicall hook for executing multiple contract calls in a single transaction
 */
export function useMulticall({
  onSuccess,
  onError,
}: UseMulticallProps = {}): MulticallResult {
  const [lastTransactionHash, setLastTransactionHash] = useState<string>()
  const { account } = useAccount()

  const {
    sendAsync,
    data: transactionData,
    error: transactionError,
    isPending: isTransactionPending,
    reset: resetTransaction,
  } = useSendTransaction({
    calls: undefined,
  })

  // Track transaction receipt
  const {
    data: receiptData,
    error: receiptError,
    isLoading: isReceiptLoading,
  } = useTransactionReceipt({
    hash: lastTransactionHash,
    watch: !!lastTransactionHash,
  })

  const writeAsync = useCallback(
    async (calls: MulticallCall[]): Promise<InvokeFunctionResponse> => {
      if (!calls || calls.length === 0) {
        throw new Error('No calls provided for multicall')
      }

      if (!account) {
        throw new Error('Account not connected')
      }

      try {
        console.log('🔍 Multicall Debug Info:')
        console.log('Number of calls:', calls.length)

        // Create contract instances and populate calls
        const populatedCalls = calls.map((call, index) => {
          // Validate contract config
          if (!call.contractConfig.address || !call.contractConfig.abi) {
            throw new Error(
              `Invalid contract config for call ${index + 1}: missing address or ABI`,
            )
          }

          // Create contract instance using Contract constructor
          const contract = new Contract(
            call.contractConfig.abi,
            call.contractConfig.address.startsWith('0x')
              ? call.contractConfig.address
              : `0x${call.contractConfig.address}`,
            account,
          )

          // Convert args object to array format and ensure correct type
          const calldata = Object.values(call.args) as (
            | string
            | number
            | bigint
          )[]

          console.log(`📋 Call ${index + 1}:`)
          console.log('  Contract Address:', call.contractConfig.address)
          console.log('  Function Name:', call.functionName)
          console.log('  Arguments:', call.args)
          console.log('  Calldata:', calldata)

          // Use contract.populate
          return contract.populate(call.functionName, calldata)
        })

        console.log(
          '📤 Sending multicall transaction with calls:',
          populatedCalls,
        )

        const result = await sendAsync(populatedCalls)
        setLastTransactionHash(result.transaction_hash)

        console.log('✅ Multicall transaction sent:', result)

        if (onSuccess) {
          onSuccess(result)
        }

        return result
      } catch (error) {
        console.error('❌ Multicall transaction error:', error)

        let errorMessage = 'Multicall transaction failed'
        let isUserRejection = false

        if (error instanceof Error) {
          const msg = error.message.toLowerCase()
          const originalMessage = error.message

          console.log('Original error message:', originalMessage)

          if (
            msg.includes('user rejected') ||
            msg.includes('user denied') ||
            msg.includes('user cancelled') ||
            msg.includes('rejected by user') ||
            msg.includes('user abort')
          ) {
            errorMessage = 'Transaction was rejected by user'
            isUserRejection = true
          } else if (
            msg.includes('insufficient funds') ||
            msg.includes('insufficient balance')
          ) {
            errorMessage =
              'Insufficient funds to complete multicall transaction'
          } else if (msg.includes('network') || msg.includes('fetch')) {
            errorMessage =
              'Network error: Please check your connection and try again'
          } else if (msg.includes('nonce')) {
            errorMessage = 'Nonce error: Please try again'
          } else if (
            msg.includes('contract not found') ||
            msg.includes('class_hash_not_found')
          ) {
            errorMessage =
              'Contract not found: Please check the contract addresses'
          } else if (msg.includes('entry point not found')) {
            errorMessage = 'One or more functions not found in contracts'
          } else {
            errorMessage = `${originalMessage} (Original error preserved for debugging)`
          }
        }

        const processedError = new Error(errorMessage)
        // Add original error for debugging
        ;(processedError as any).originalError = error
        ;(processedError as any).isUserRejection = isUserRejection

        if (onError) {
          onError(processedError)
        }
        throw processedError
      }
    },
    [account, sendAsync, onSuccess, onError],
  )

  const reset = useCallback(() => {
    resetTransaction()
    setLastTransactionHash(undefined)
  }, [resetTransaction])

  // Process errors for better user experience
  const processedError = useMemo(() => {
    const error = transactionError || receiptError
    if (!error) return null

    const errorMessage = error.message || error.toString()

    if (
      errorMessage.includes('user rejected') ||
      errorMessage.includes('user denied')
    ) {
      return new Error('Transaction was rejected by user')
    }

    if (errorMessage.includes('insufficient funds')) {
      return new Error('Insufficient funds to complete transaction')
    }

    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return new Error(
        'Network error: Please check your connection and try again',
      )
    }

    return error as Error
  }, [transactionError, receiptError])

  // Determine success state
  const isSuccess = !!(receiptData && !receiptError)
  const isLoading = isTransactionPending || isReceiptLoading

  return {
    writeAsync,
    data: transactionData,
    error: processedError,
    isLoading,
    isSuccess,
    reset,
  }
}
