'use client'
import React, { use, useMemo } from 'react'
import { TransactionDetailsHeader } from './components/TransactionDetailsHeader'
import { TransactionSummary } from './components/TransactionSummary'
import { TransactionDetails } from './components/TransactionDetails'
import { useTheme } from '@/app/context/theme-context-provider'
import { useSpherreAccount } from '@/app/context/account-context'
import { useTransactionDetails } from '@/hooks/useTransactionIntegration'
import { useGetAccountName, useGetThreshold } from '@/hooks/useSpherreHooks'
import { transactions } from '../data'
import type { Transaction as MockTransactionType } from '../data'
import {
  TransactionDisplayInfo,
  TransactionType as ContractTransactionType,
} from '@/lib/contracts/types'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * MOCK DATA FALLBACK SECTION
 * ========================
 * This section provides mock data as fallback when smart contract data is not available.
 *
 * TODO: Remove this entire section once smart contract integration is complete and stable.
 *
 * To remove mock fallback:
 * 1. Delete the convertMockToTransactionDisplayInfo function
 * 2. Delete the getMockTransactionFallback function
 * 3. Remove the mock data imports at the top
 * 4. Remove the fallback logic in the main component (marked with "MOCK FALLBACK")
 */

// Convert mock data to TransactionDisplayInfo format
const convertMockToTransactionDisplayInfo = (
  transaction: MockTransactionType,
): TransactionDisplayInfo => {
  // Use a fixed timestamp for SSR consistency
  const fixedTimestamp = new Date('2024-01-01').getTime()

  // Safely convert values to prevent NaN errors
  const safeId = Number.isInteger(transaction.id) ? transaction.id : 1
  const safeAmount = parseFloat(transaction.amount.split(' ')[0] || '0')
  const validAmount = Number.isFinite(safeAmount) ? safeAmount : 0

  const safeDateExecuted = transaction.dateExecuted
    ? new Date(transaction.dateExecuted).getTime()
    : undefined
  const validDateExecuted =
    safeDateExecuted && Number.isFinite(safeDateExecuted)
      ? safeDateExecuted
      : undefined

  return {
    transaction: {
      id: BigInt(safeId),
      transactionType: ContractTransactionType.TOKEN_SEND, // Default type
      status:
        transaction.status === 'Pending'
          ? 'Pending'
          : transaction.status === 'Executed'
            ? 'Executed'
            : 'Rejected',
      proposer: transaction.initiator?.name || 'Unknown',
      executor: transaction.account?.address || '0x0',
      approved:
        transaction.approvals?.map((a) => a.member?.name || 'Unknown') || [],
      rejected:
        transaction.rejections?.map((a) => a.member?.name || 'Unknown') || [],
      dateCreated: BigInt(fixedTimestamp),
      dateExecuted: validDateExecuted ? BigInt(validDateExecuted) : undefined,
      transaction_id: transaction.transactionId || undefined,
      data: {
        token: 'STRK',
        amount: BigInt(validAmount * 1e18),
        recipient: transaction.toAddress || '0x0',
        type: ContractTransactionType.TOKEN_SEND,
      },
    },
    title: `${transaction.type} ${transaction.amount}`,
    subtitle: `To: ${transaction.toAddress}`,
    amount: transaction.amount.split(' ')[0] || '0',
    recipient: transaction.toAddress || '0x0',
    token: transaction.amount.split(' ')[1] || 'STRK',
  }
}

// Get mock transaction as fallback
const getMockTransactionFallback = (
  transactionId: string,
): TransactionDisplayInfo | null => {
  const numericId = parseInt(transactionId)
  const mockTransaction = transactions.find((t) => t.id === numericId)
  if (!mockTransaction) return null
  return convertMockToTransactionDisplayInfo(mockTransaction)
}

/**
 * END OF MOCK DATA FALLBACK SECTION
 * ================================
 */

export default function TransactionDetailsPage({ params }: PageProps) {
  useTheme()
  const { accountAddress } = useSpherreAccount()
  const resolvedParams = use(params)

  // Get account name and threshold
  const { data: accountName } = useGetAccountName(accountAddress || '0x0')
  const { data: thresholdData } = useGetThreshold(accountAddress || '0x0')

  // PRIMARY: Try to fetch real transaction data from smart contract
  const {
    transaction: realTransactionInfo,
    isLoading,
    error,
    refetch,
  } = useTransactionDetails(resolvedParams.id)

  // MOCK FALLBACK: Get mock data as fallback (TODO: Remove this when smart contract is stable)
  const mockTransactionFallback = useMemo(() => {
    return getMockTransactionFallback(resolvedParams.id)
  }, [resolvedParams.id])

  // DEVELOPMENT NOTE: Log data source for debugging
  React.useEffect(() => {
    if (realTransactionInfo) {
      console.log('📡 Using REAL transaction data from smart contract')
    } else if (mockTransactionFallback) {
      console.log('🎭 Using MOCK transaction data as fallback')
    }
  }, [realTransactionInfo, mockTransactionFallback])

  // Handle error logging as per requirements
  if (error) {
    console.error('Failed to fetch transaction details:', error)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-theme-bg-secondary border border-theme-border text-theme p-6 rounded-lg h-[95.5vh] transition-colors duration-300">
        <div className="flex justify-center items-center h-full">
          <div className="text-theme-secondary transition-colors duration-300">
            Loading transaction details...
          </div>
        </div>
      </div>
    )
  }

  // Error state with retry option (still try mock fallback)
  if (error && !isLoading && !mockTransactionFallback) {
    return (
      <div className="bg-theme-bg-secondary border border-theme-border text-theme p-6 rounded-lg h-[95.5vh] transition-colors duration-300">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-red-500 mb-4 text-center">
            Unable to fetch transaction details. Please try again later.
          </div>
          <button
            onClick={() => refetch()}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Determine which data to use (real data takes precedence)
  const transactionInfo = realTransactionInfo || mockTransactionFallback

  // Transaction not found in either real or mock data
  if (!transactionInfo) {
    return (
      <div className="text-theme text-center p-10 bg-theme min-h-screen transition-colors duration-300">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Transaction not found</h1>
          <p className="text-theme-secondary mb-6">
            The transaction with ID {resolvedParams.id} could not be found.
          </p>
          <div className="space-y-3">
            {error && (
              <button
                onClick={() => refetch()}
                className="w-full bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200"
              >
                Retry Smart Contract
              </button>
            )}
            <button
              onClick={() => window.history.back()}
              className="w-full bg-theme-bg-tertiary text-theme px-6 py-2 rounded-lg hover:bg-theme-border transition-colors duration-200 border border-theme-border"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 rounded-lg h-[95.5vh] transition-colors duration-300">
      {/* Development indicator (TODO: Remove in production) */}
      {!realTransactionInfo && mockTransactionFallback && (
        <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-800 dark:text-yellow-200 text-sm">
              🎭 Displaying mock data (Smart contract data not available)
            </span>
          </div>
        </div>
      )}

      <TransactionDetailsHeader
        status={transactionInfo.transaction.status}
        transactionId={transactionInfo.transaction.id}
      />
      <TransactionSummary transactionInfo={transactionInfo} />
      <TransactionDetails
        transactionInfo={transactionInfo}
        accountName={accountName}
        thresholdData={thresholdData}
      />
    </div>
  )
}
