'use client'
import React, { useState, useEffect } from 'react'
import { transactions } from './data'
import Transaction from './components/transaction'
import type { Transaction as MockTransactionType } from './data'
import {
  TransactionDisplayInfo,
  TransactionType as ContractTransactionType,
  TransactionData,
} from '@/lib/contracts/types'
import { useTransactionIntegration } from '@/hooks/useTransactionIntegration'

/**
 * TRANSACTIONS PAGE WITH SMART CONTRACT + MOCK FALLBACK
 * ====================================================
 *
 * This page is designed to:
 * 1. Try to fetch real transaction data from smart contracts FIRST
 * 2. Fall back to mock data if smart contract data is not available
 * 3. Make it easy for developers to remove mock fallback later
 *
 * DEVELOPMENT WORKFLOW:
 * 1. Current: Uses mock data as fallback when smart contract fails
 * 2. Future: Remove mock fallback once smart contract integration is stable
 *
 * TO REMOVE MOCK FALLBACK (when smart contract is ready):
 * 1. Delete the "MOCK DATA FALLBACK SECTION" below
 * 2. Remove mock data imports at the top
 * 3. Replace the hybrid logic with direct smart contract calls
 * 4. Remove fallback logic marked with "TODO: Remove"
 */

/**
 * MOCK DATA FALLBACK SECTION
 * ==========================
 * TODO: Remove this entire section once smart contract integration is complete
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
      data: {
        token: 'STRK',
        amount: BigInt(validAmount * 1e18),
        recipient: transaction.toAddress || '0x0',
      } as TransactionData,
    },
    title: `${transaction.type} ${transaction.amount}`,
    subtitle: `To: ${transaction.toAddress}`,
    amount: transaction.amount.split(' ')[0] || '0',
    recipient: transaction.toAddress || '0x0',
    token: transaction.amount.split(' ')[1] || 'STRK',
  }
}

/**
 * END OF MOCK DATA FALLBACK SECTION
 * ================================
 */

export default function TransactionsPage() {
  const [mounted, setMounted] = useState(false)
  const [expandedTransactions, setExpandedTransactions] = useState<Set<number>>(
    new Set([1]),
  ) // First transaction expanded by default

  // TODO: Add smart contract transaction fetching here
  // const { transactions: realTransactions, isLoading, error } = useSmartContractTransactions()
  const { transactions: realTransactions } = useTransactionIntegration();
  console.log(realTransactions)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Toggle transaction expansion
  const toggleTransaction = (transactionId: number) => {
    setExpandedTransactions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(transactionId)) {
        newSet.delete(transactionId)
      } else {
        newSet.add(transactionId)
      }
      return newSet
    })
  }

  // DEVELOPMENT NOTE: Log data source for debugging
  useEffect(() => {
    if (mounted) {
      console.log('🎭 Transactions page using MOCK data as fallback')
      console.log('📝 TODO: Integrate smart contract transaction fetching')
    }
  }, [mounted])

  if (!mounted) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-theme">
          Transaction Activity
        </h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-theme-bg-secondary rounded-lg border border-theme-border"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-theme">Transaction Activity</h1>
        {/* Development indicator (TODO: Remove in production) */}
        <div className="hidden lg:block">
          <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-full">
            <span className="text-yellow-800 dark:text-yellow-200 text-xs">
              🎭 Mock Data
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* TODO: Replace with real smart contract data when available */}
        {transactions.map((transaction: MockTransactionType) => {
          const transactionInfo =
            convertMockToTransactionDisplayInfo(transaction)
          return (
            <Transaction
              key={transaction.id}
              transactionInfo={transactionInfo}
              isExpanded={expandedTransactions.has(transaction.id)}
              onToggle={() => toggleTransaction(transaction.id)}
            />
          )
        })}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-theme-secondary text-lg">
            No transactions found
          </div>
          <div className="text-theme-secondary text-sm mt-2">
            Transactions will appear here once they are available from the smart
            contract
          </div>
        </div>
      )}
    </div>
  )
}
