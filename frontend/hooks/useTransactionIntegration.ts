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

const mockTransactions: TransactionDisplayInfo[] = [
  {
    transaction: {
      id: BigInt(1),
      status: 'Pending',
      proposer: 'a2gjaj...7wyw',
      executor: undefined,
      approved: ['hichens'],
      rejected: [],
      dateCreated: BigInt(Math.floor(Date.now() / 1000) - 86400),
      dateExecuted: undefined,
      transactionType: TransactionType.TOKEN_SEND,
      data: {
        recipient: 'a2gjaj...7wyw',
        amount: BigInt(25000000000000000000),
        token: '0x123',

      },
      project: 'Backstage Boys',
    },
    title: 'Withdraw',
    subtitle: 'Send STRK tokens',
    amount: '25',
    token: 'STRK',
    recipient: 'a2gjaj...7wyw',
  },
  {
    transaction: {
      id: BigInt(2),
      status: 'Executed',
      proposer: 'a2gjaj...7wyw',
      executor: 'denzel',
      approved: ['hichens', 'denzel'],
      rejected: [],
      dateCreated: BigInt(Math.floor(Date.now() / 1000) - 86400),
      dateExecuted: BigInt(Math.floor(Date.now() / 1000) - 3600),
      transactionType: TransactionType.NFT_SEND,
      data: {
        recipient: 'a2gjaj...7wyw',
        amount: BigInt(25000000000000000000),
        token: '0x123',
      },
      project: 'Backstage Boys',
      transaction_id: '433344...7uyrr',

    },
    title: 'Swap',
    subtitle: 'Exchange tokens',
    amount: '25',
    token: 'STRK',
    recipient: 'a2gjaj...7wyw',
  },
  {
    transaction: {
      id: BigInt(3),
      status: 'Pending',
      proposer: 'a2gjaj...7wyw',
      executor: undefined,
      approved: [],
      rejected: [],
      dateCreated: BigInt(Math.floor(Date.now() / 1000) - 172800),
      dateExecuted: undefined,
      transactionType: TransactionType.TOKEN_SEND,
      data: {
        recipient: 'a2gjaj...7wyw',
        amount: BigInt(25000000000000000000),
        token: '0x123',
      },
      project: 'Backstage Boys',

    },
    title: 'Withdraw',
    subtitle: 'Send STRK tokens',
    amount: '25',
    token: 'STRK',
    recipient: 'a2gjaj...7wyw',
  },
  {
    transaction: {
      id: BigInt(4),
      status: 'Executed',
      proposer: 'a2gjaj...7wyw',
      executor: 'jives',
      approved: ['hichens', 'jives'],
      rejected: [],
      dateCreated: BigInt(Math.floor(Date.now() / 1000) - 259200),
      dateExecuted: BigInt(Math.floor(Date.now() / 1000) - 172800),
      transactionType: TransactionType.TOKEN_SEND,
      data: {
        recipient: 'a2gjaj...7wyw',
        amount: BigInt(25000000000000000000),
        token: '0x123',
      },
      project: 'Backstage Boys',
      transaction_id: '433344...7uyrr',

    },
    title: 'Limit Swap',
    subtitle: 'Automated token exchange',
    amount: '25',
    token: 'STRK',
    recipient: 'a2gjaj...7wyw',
  },
  {
    transaction: {
      id: BigInt(5),
      status: 'Executed',
      proposer: 'a2gjaj...7wyw',
      executor: 'kerkeze',
      approved: ['denzel', 'kerkeze'],
      rejected: [],
      dateCreated: BigInt(Math.floor(Date.now() / 1000) - 864000),
      dateExecuted: BigInt(Math.floor(Date.now() / 1000) - 863000),
      transactionType: TransactionType.MEMBER_ADD,
      data: {
        member: 'a2gjaj...7wyw',
        permissions: 7,
      },
      project: 'Backstage Boys',
      transaction_id: '433344...7uyrr',
    },
    title: 'Add Member',
    subtitle: 'New member added',
    recipient: 'a2gjaj...7wyw',
  },
  {
    transaction: {
      id: BigInt(6),
      status: 'Rejected',
      proposer: 'a2gjaj...7wyw',
      executor: undefined,
      approved: ['hichens'],
      rejected: ['denzel', 'jives'],
      dateCreated: BigInt(Math.floor(Date.now() / 1000) - 864000),
      dateExecuted: undefined,
      transactionType: TransactionType.MEMBER_REMOVE,
      data: {
        member_address: 'a2gjaj...7wyw',
      },
      project: 'Backstage Boys',
      transaction_id: '433344...7uyrr',
    },
    title: 'Remove Member',
    subtitle: 'Member removal request',
    recipient: 'a2gjaj...7wyw',
  },
]

export function useTransactionIntegration(
  options: UseTransactionIntegrationOptions = {},
): UseTransactionIntegrationResult {
  const { accountAddress } = useSpherreAccount()
  const {
    start = BigInt(0),
    limit = BigInt(50),
    filterStatus,
    filterType,
  } = options

  // TODO: REMOVE THIS - Mock data for testing UI (set to false to use real data)
  const USE_MOCK_DATA = true

  const {
    data: baseTransactions,
    isLoading: isLoadingBase,
    error: errorBase,
    refetch: refetchBase,
  } = useTransactionList(accountAddress!, start, limit)

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

    const unified: UnifiedTransaction[] = []

    baseTransactions.forEach((baseTransaction: SpherreTransaction) => {
      let transactionData = null

      try {
        // Find the corresponding transaction data based on type
        switch (baseTransaction.tx_type) {
          case TransactionType.TOKEN_SEND: {
            transactionData = transactionDataArrays.token?.find(
              (t: TokenTransactionData) => {
                const txId = getTransactionId(t)
                return txId?.toString() === baseTransaction.id.toString()
              },
            )
            break
          }

          case TransactionType.NFT_SEND: {
            transactionData = transactionDataArrays.nft?.find(
              (t: NFTTransactionData) => {
                const txId = getTransactionId(t)
                return txId?.toString() === baseTransaction.id.toString()
              },
            )
            break
          }

          case TransactionType.MEMBER_ADD: {
            transactionData = transactionDataArrays.memberAdd?.find(
              (t: MemberAddData) => {
                const txId = getTransactionId(t)
                return txId?.toString() === baseTransaction.id.toString()
              },
            )
            break
          }

          case TransactionType.MEMBER_REMOVE: {
            transactionData = transactionDataArrays.memberRemoval?.find(
              (t: MemberRemoveData) => {
                const txId = getTransactionId(t)
                return txId?.toString() === baseTransaction.id.toString()
              },
            )
            break
          }

          case TransactionType.MEMBER_PERMISSION_EDIT: {
            transactionData = transactionDataArrays.editPermission?.find(
              (t: EditPermissionTransaction) => {
                const txId = getTransactionId(t)
                return txId?.toString() === baseTransaction.id.toString()
              },
            )
            break
          }

          case TransactionType.THRESHOLD_CHANGE: {
            transactionData = transactionDataArrays.threshold?.find(
              (t: ThresholdChangeData) => {
                const txId = getTransactionId(t)
                return txId?.toString() === baseTransaction.id.toString()
              },
            )
            break
          }

          case TransactionType.SMART_TOKEN_LOCK: {
            transactionData = transactionDataArrays.smartLock?.find(
              (t: SmartTokenLockTransaction) =>
                t.transaction_id.toString() === baseTransaction.id.toString(),
            )
            break
          }

          default:
            console.warn(`Unknown transaction type: ${baseTransaction.tx_type}`)
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
            `No transaction data found for transaction ${baseTransaction.id} of type ${baseTransaction.tx_type}`,
          )
        }
      } catch (processingError) {
        console.error('Error processing transaction:', processingError, {
          transactionId: baseTransaction.id,
          type: baseTransaction.tx_type,
        })
      }
    })

    return unified
  }, [baseTransactions, transactionDataArrays, accountAddress])

  // Convert to display format and apply filters
  const displayTransactions = useMemo(() => {
    let transactions = processedTransactions.map(getTransactionDisplayInfo)

    // Apply status filter
    if (filterStatus) {
      transactions = filterTransactionsByStatus(transactions, filterStatus)
    }

    // Apply type filter
    if (filterType) {
      transactions = filterTransactionsByType(transactions, filterType)
    }

    return sortTransactionsByDate(transactions)
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

    // Log detailed error information
    console.error('Transaction integration error details:', {
      baseError: errorBase?.message,
      tokenError: errorToken?.message,
      nftError: errorNft?.message,
      memberAddError: errorMemberAdd?.message,
      memberRemovalError: errorMemberRemoval?.message,
      editPermissionError: errorEditPermission?.message,
      smartLockError: errorSmartLock?.message,
      thresholdError: errorThreshold?.message,
      accountAddress,
    })

    // Return user-friendly error
    return new Error(
      'Unable to fetch transactions. Please check network or contract state.',
    )
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

  // Return mock data if enabled
  if (USE_MOCK_DATA) {
    const mockGroupedTransactions = mockTransactions.reduce((acc, txInfo) => {
      const dateKey = new Date(Number(txInfo.transaction.dateCreated) * 1000).toLocaleDateString()
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(txInfo)
      return acc
    }, {} as Record<string, TransactionDisplayInfo[]>)

    return {
      transactions: mockTransactions,
      groupedTransactions: mockGroupedTransactions,
      isLoading: false,
      error: null,
      refetch: () => { },
      pendingTransactions: mockTransactions.filter(tx => tx.transaction.status === 'Pending'),
      executedTransactions: mockTransactions.filter(tx => tx.transaction.status === 'Executed'),
      rejectedTransactions: mockTransactions.filter(tx => tx.transaction.status === 'Rejected'),
    }
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
  const { accountAddress } = useSpherreAccount()

  // Fetch the base transaction first
  const {
    data: baseTransaction,
    isLoading: isLoadingBase,
    error: errorBase,
    refetch: refetchBase,
  } = useTransactionList(accountAddress!)

  const USE_MOCK_DATA = true

  // Find the specific transaction from the list
  const targetTransaction = useMemo(() => {
    if (!baseTransaction) return null
    return baseTransaction.find(
      (tx: SpherreTransaction) => tx.id.toString() === transactionId.toString(),
    )
  }, [baseTransaction, transactionId])

  // Fetch specific transaction data based on type
  const transactionType = targetTransaction?.tx_type

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
    switch (targetTransaction.tx_type) {
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

  if (USE_MOCK_DATA) {
    return {
      transaction: mockTransactions.find(tx => tx.transaction.id.toString() === transactionId.toString()) || null,
      isLoading: false,
      error: null,
      refetch: () => { },
    }
  }

  return {
    transaction: processedTransaction,
    isLoading,
    error: errorBase,
    refetch,
  }
}
