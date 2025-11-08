'use client'

import { useMemo } from 'react'
import { useSpherreAccount } from '@/app/context/account-context'
import {
  useTransactionList,
  useTokenTransactionList,
  useNftTransactionList,
  useMemberAddTransactionList,
  useMemberRemovalTransactionList,
  useEditPermissionTransactionList,
  useSmartTokenLockTransactionList,
  useAllThresholdChangeTransactions,
  useGetTokenTransaction,
  useGetNftTransaction,
  useGetMemberAddTransaction,
  useGetMemberRemovalTransaction,
  useGetEditPermissionTransaction,
  useGetSmartTokenLockTransaction,
  useGetThresholdChangeTransaction,
} from './useSpherreHooks'
import {
  TransactionType,
  type UnifiedTransaction,
  type TransactionDisplayInfo,
  type SpherreTransaction,
  type TokenTransactionData,
  type NFTTransactionData,
  type MemberAddData,
  type MemberRemoveData,
  type EditPermissionTransaction,
  type ThresholdChangeData,
  type SmartTokenLockTransaction,
} from '@/lib/contracts/types'
import {
  transformTransaction,
  getTransactionDisplayInfo,
  groupTransactionsByDate,
  sortTransactionsByDate,
  filterTransactionsByStatus,
  filterTransactionsByType,
} from '@/lib/utils/transaction-utils'
import { CairoCustomEnum } from 'starknet'

interface UseTransactionIntegrationOptions {
  start?: bigint
  limit?: bigint
  filterStatus?: 'Pending' | 'Executed' | 'Rejected'
  filterType?: TransactionType
}

interface UseTransactionIntegrationResult {
  transactions: TransactionDisplayInfo[]
  groupedTransactions: Record<string, TransactionDisplayInfo[]>
  isLoading: boolean
  error: Error | null
  refetch: () => void
  // Filter helpers
  pendingTransactions: TransactionDisplayInfo[]
  executedTransactions: TransactionDisplayInfo[]
  rejectedTransactions: TransactionDisplayInfo[]
}

export function useTransactionIntegration(
  options: UseTransactionIntegrationOptions = {},
): UseTransactionIntegrationResult {
  const { accountAddress } = useSpherreAccount()
  const {
    start = BigInt(1),
    limit = BigInt(1),
    filterStatus,
    filterType,
  } = options

  const {
    data: baseTransactions,
    isLoading: isLoadingBase,
    error: errorBase,
    refetch: refetchBase,
  } = useTransactionList(accountAddress!)
  // Removed start and limit from here, because they don't seem to work well from the contract

  // Only fetch additional lists if we have base transactions
  const shouldFetchDetails = !!baseTransactions && baseTransactions.length > 0

  // Fetch all specific transaction lists (only when needed)
  const {
    data: tokenTransactions,
    isLoading: isLoadingToken,
    error: errorToken,
    refetch: refetchToken,
  } = useTokenTransactionList(
    shouldFetchDetails ? accountAddress! : ('0x' as const),
  )

  const {
    data: nftTransactions,
    isLoading: isLoadingNft,
    error: errorNft,
    refetch: refetchNft,
  } = useNftTransactionList(
    shouldFetchDetails ? accountAddress! : ('0x' as const),
  )

  const {
    data: memberAddTransactions,
    isLoading: isLoadingMemberAdd,
    error: errorMemberAdd,
  } = useMemberAddTransactionList(
    shouldFetchDetails ? accountAddress! : ('0x' as const),
  )

  const {
    data: memberRemovalTransactions,
    isLoading: isLoadingMemberRemoval,
    error: errorMemberRemoval,
  } = useMemberRemovalTransactionList(
    shouldFetchDetails ? accountAddress! : ('0x' as const),
  )

  const {
    data: editPermissionTransactions,
    isLoading: isLoadingEditPermission,
    error: errorEditPermission,
  } = useEditPermissionTransactionList(
    shouldFetchDetails ? accountAddress! : ('0x' as const),
  )

  const {
    data: smartLockTransactions,
    isLoading: isLoadingSmartLock,
    error: errorSmartLock,
  } = useSmartTokenLockTransactionList(
    shouldFetchDetails ? accountAddress! : ('0x' as const),
  )

  const {
    data: thresholdTransactions,
    isLoading: isLoadingThreshold,
    error: errorThreshold,
  } = useAllThresholdChangeTransactions(
    shouldFetchDetails ? accountAddress! : ('0x' as const),
  )

  // Helper function to get transaction ID from different transaction types
  // This cannot work, because those transactions don't return id or transaction_id
  // It might be used in the future, else I think I will remove
  const getTransactionId = (transaction: unknown): bigint | string | null => {
    if (
      !transaction ||
      typeof transaction !== 'object' ||
      transaction === null
    ) {
      return null
    }

    const tx = transaction as Record<string, unknown>

    // Try different possible ID field names with proper type checking
    for (const key of ['transaction_id', 'id']) {
      const value = tx[key]
      if (typeof value === 'bigint' || typeof value === 'string') {
        return value
      }
    }

    return null
  }

  // Memoize transaction data arrays to prevent unnecessary re-computations
  const transactionDataArrays = useMemo(
    () => ({
      token: tokenTransactions,
      nft: nftTransactions,
      memberAdd: memberAddTransactions,
      memberRemoval: memberRemovalTransactions,
      editPermission: editPermissionTransactions,
      smartLock: smartLockTransactions,
      threshold: thresholdTransactions,
    }),
    [
      tokenTransactions,
      nftTransactions,
      memberAddTransactions,
      memberRemovalTransactions,
      editPermissionTransactions,
      smartLockTransactions,
      thresholdTransactions,
    ],
  )

  // Combine all transactions and transform them
  const processedTransactions = useMemo(() => {
    if (!baseTransactions || !accountAddress) return []

    const typeCounters: Record<string, number> = {
      [TransactionType.TOKEN_SEND]: 0,
      [TransactionType.NFT_SEND]: 0,
      [TransactionType.MEMBER_ADD]: 0,
      [TransactionType.MEMBER_REMOVE]: 0,
      [TransactionType.MEMBER_PERMISSION_EDIT]: 0,
      [TransactionType.THRESHOLD_CHANGE]: 0,
      [TransactionType.SMART_TOKEN_LOCK]: 0,
    }

    const unified: UnifiedTransaction[] = []

    baseTransactions.forEach(
      (baseTransaction: SpherreTransaction, index: number) => {
        const txType = baseTransaction.tx_type.activeVariant()
        let transactionData = null

        try {
          const currentIndex = typeCounters[txType]
          // Find the corresponding transaction data based on type
          switch (baseTransaction.tx_type.activeVariant()) {
            case TransactionType.TOKEN_SEND: {
              transactionData = transactionDataArrays.token?.[currentIndex]
              typeCounters[txType] = currentIndex + 1

              break
            }

            case TransactionType.NFT_SEND: {
              transactionData = transactionDataArrays.nft?.[currentIndex]
              typeCounters[txType] = currentIndex + 1
              break
            }

            case TransactionType.MEMBER_ADD: {
              transactionData = transactionDataArrays.memberAdd?.[currentIndex]
              typeCounters[txType] = currentIndex + 1

              break
            }

            case TransactionType.MEMBER_REMOVE: {
              transactionData =
                transactionDataArrays.memberRemoval?.[currentIndex]
              typeCounters[txType] = currentIndex + 1
              break
            }

            case TransactionType.MEMBER_PERMISSION_EDIT: {
              transactionData =
                transactionDataArrays.editPermission?.[currentIndex]
              typeCounters[txType] = currentIndex + 1
              break
            }

            case TransactionType.THRESHOLD_CHANGE: {
              transactionData = transactionDataArrays.threshold?.[currentIndex]
              typeCounters[txType] = currentIndex + 1
              break
            }

            case TransactionType.SMART_TOKEN_LOCK: {
              transactionData = transactionDataArrays.smartLock?.[currentIndex]
              typeCounters[txType] = currentIndex + 1
              break
            }

            default:
              console.warn(
                `Unknown transaction type: ${baseTransaction.tx_type}`,
              )
              break
          }

          // Only add if we have the transaction data
          if (transactionData) {
            try {
              const unifiedTransaction = transformTransaction(
                baseTransaction,
                transactionData,
              )
              unified.push(unifiedTransaction)
            } catch (transformError) {
              console.error('Error transforming transaction:', transformError, {
                baseTransaction: baseTransaction.id,
                type: baseTransaction.tx_type,
                hasData: !!transactionData,
              })
            }
          } else {
            console.warn(
              `No transaction data found for transaction ${baseTransaction.id} of type ${(baseTransaction.tx_type as any as CairoCustomEnum).activeVariant()}`,
            )
          }
        } catch (processingError) {
          console.error('Error processing transaction:', processingError, {
            transactionId: baseTransaction.id,
            type: baseTransaction.tx_type,
          })
        }
      },
    )

    return unified
  }, [baseTransactions, transactionDataArrays, accountAddress])

  // Convert to display format and apply filters
  const displayTransactions = useMemo(() => {
    const sanitized = processedTransactions
      .map(getTransactionDisplayInfo)
      .filter(
        (tx): tx is TransactionDisplayInfo =>
          tx !== null &&
          tx.transaction !== undefined &&
          !!tx.transaction.transactionType,
      )

    const statusFiltered = filterStatus
      ? filterTransactionsByStatus(sanitized, filterStatus)
      : sanitized

    const typeFiltered = filterType
      ? filterTransactionsByType(statusFiltered, filterType)
      : statusFiltered

    return sortTransactionsByDate(typeFiltered)
  }, [processedTransactions, filterStatus, filterType])

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    return groupTransactionsByDate(displayTransactions)
  }, [displayTransactions])

  // Loading and error states
  const isLoading =
    isLoadingBase ||
    isLoadingToken ||
    isLoadingNft ||
    isLoadingMemberAdd ||
    isLoadingMemberRemoval ||
    isLoadingEditPermission ||
    isLoadingSmartLock ||
    isLoadingThreshold

  const error =
    errorBase ||
    errorToken ||
    errorNft ||
    errorMemberAdd ||
    errorMemberRemoval ||
    errorEditPermission ||
    errorSmartLock ||
    errorThreshold

  // Enhanced error handling
  const enhancedError = useMemo(() => {
    if (!error) return null

    const errorDetails = {
      baseError: errorBase?.message,
      tokenError: errorToken?.message,
      nftError: errorNft?.message,
      memberAddError: errorMemberAdd?.message,
      memberRemovalError: errorMemberRemoval?.message,
      editPermissionError: errorEditPermission?.message,
      smartLockError: errorSmartLock?.message,
      thresholdError: errorThreshold?.message,
      accountAddress,
    }

    console.error('Transaction integration error details:', errorDetails)

    const messages = Object.entries(errorDetails)
      .filter(([, value]) => Boolean(value))
      .map(([key, value]) => `${key}: ${value}`)

    const message =
      messages.length > 0
        ? `Unable to fetch transactions:\n${messages.join('\n')}`
        : 'Unable to fetch transactions. Please check network or contract state.'

    return new Error(message)
  }, [
    error,
    errorBase,
    errorToken,
    errorNft,
    errorMemberAdd,
    errorMemberRemoval,
    errorEditPermission,
    errorSmartLock,
    errorThreshold,
    accountAddress,
  ])

  // Helper filters
  const pendingTransactions = useMemo(
    () => filterTransactionsByStatus(displayTransactions, 'Pending'),
    [displayTransactions],
  )

  const executedTransactions = useMemo(
    () => filterTransactionsByStatus(displayTransactions, 'Executed'),
    [displayTransactions],
  )

  const rejectedTransactions = useMemo(
    () => filterTransactionsByStatus(displayTransactions, 'Rejected'),
    [displayTransactions],
  )

  const refetch = () => {
    refetchBase()
    refetchToken()
    refetchNft()
  }

  return {
    transactions: displayTransactions,
    groupedTransactions,
    isLoading,
    error: enhancedError,
    refetch,
    pendingTransactions,
    executedTransactions,
    rejectedTransactions,
  }
}

// Hook for individual transaction details
export function useTransactionDetails(transactionId: string | bigint) {
  const accountAddress =
    '0x065f067f0f621ed571a33ee6d5959e342ee5fd3f1df5c7609e54a6e5c29f8080'

  // Fetch the base transaction first
  const {
    data: baseTransaction,
    isLoading: isLoadingBase,
    error: errorBase,
    refetch: refetchBase,
  } = useTransactionList(accountAddress!)

  // Find the specific transaction from the list
  const targetTransaction = useMemo(() => {
    if (!baseTransaction) return null
    return baseTransaction.find(
      (tx: SpherreTransaction) => tx.id.toString() === transactionId.toString(),
    )
  }, [baseTransaction, transactionId])

  // Fetch specific transaction data based on type
  const transactionType = targetTransaction?.tx_type.activeVariant()

  const { data: tokenData, isLoading: isLoadingToken } = useGetTokenTransaction(
    accountAddress!,
    transactionType === TransactionType.TOKEN_SEND ? transactionId : undefined!,
  )

  const { data: nftData, isLoading: isLoadingNft } = useGetNftTransaction(
    accountAddress!,
    transactionType === TransactionType.NFT_SEND ? transactionId : undefined!,
  )

  const { data: memberAddData, isLoading: isLoadingMemberAdd } =
    useGetMemberAddTransaction(
      accountAddress!,
      transactionType === TransactionType.MEMBER_ADD
        ? transactionId
        : undefined!,
    )

  const { data: memberRemovalData, isLoading: isLoadingMemberRemoval } =
    useGetMemberRemovalTransaction(
      accountAddress!,
      transactionType === TransactionType.MEMBER_REMOVE
        ? transactionId
        : undefined!,
    )

  const { data: editPermissionData, isLoading: isLoadingEditPermission } =
    useGetEditPermissionTransaction(
      accountAddress!,
      transactionType === TransactionType.MEMBER_PERMISSION_EDIT
        ? transactionId
        : undefined!,
    )

  const { data: smartLockData, isLoading: isLoadingSmartLock } =
    useGetSmartTokenLockTransaction(
      accountAddress!,
      transactionType === TransactionType.SMART_TOKEN_LOCK
        ? transactionId
        : undefined!,
    )

  const { data: thresholdData, isLoading: isLoadingThreshold } =
    useGetThresholdChangeTransaction(
      accountAddress!,
      transactionType === TransactionType.THRESHOLD_CHANGE
        ? transactionId
        : undefined!,
    )

  const refetch = () => {
    refetchBase()
  }

  // Process the transaction data
  const processedTransaction = useMemo(() => {
    if (!targetTransaction) return null

    let transactionData = null
    switch (targetTransaction.tx_type.activeVariant()) {
      case TransactionType.TOKEN_SEND:
        transactionData = tokenData
        break
      case TransactionType.NFT_SEND:
        transactionData = nftData
        break
      case TransactionType.MEMBER_ADD:
        transactionData = memberAddData
        break
      case TransactionType.MEMBER_REMOVE:
        transactionData = memberRemovalData
        break
      case TransactionType.MEMBER_PERMISSION_EDIT:
        transactionData = editPermissionData
        break
      case TransactionType.SMART_TOKEN_LOCK:
        transactionData = smartLockData
        break
      case TransactionType.THRESHOLD_CHANGE:
        transactionData = thresholdData
        break
      default:
        return null
    }

    if (!transactionData) return null

    try {
      const unified = transformTransaction(targetTransaction, transactionData)
      return getTransactionDisplayInfo(unified)
    } catch (error) {
      console.error('Error processing transaction details:', error)
      return null
    }
  }, [
    targetTransaction,
    tokenData,
    nftData,
    memberAddData,
    memberRemovalData,
    editPermissionData,
    smartLockData,
    thresholdData,
  ])

  const isLoading =
    isLoadingBase ||
    isLoadingToken ||
    isLoadingNft ||
    isLoadingMemberAdd ||
    isLoadingMemberRemoval ||
    isLoadingEditPermission ||
    isLoadingSmartLock ||
    isLoadingThreshold

  return {
    transaction: processedTransaction,
    isLoading,
    error: errorBase,
    refetch,
  }
}
