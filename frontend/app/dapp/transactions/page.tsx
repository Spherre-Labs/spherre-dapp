'use client'

import { useState, useMemo } from 'react'
import Transaction from './components/transaction'
import { useTheme } from '@/app/context/theme-context-provider'
import { useAccount } from '@starknet-react/core'
import { useTokenTransactionList, useGetAccountDetails } from '@/hooks/useSpherreHooks'
import type { SpherreTransaction } from '@/lib/contracts/types'
import { TransactionType } from '@/lib/contracts/types'
import type { Transaction as UITransaction } from './data'

// Transaction type mapping
const getTransactionTypeDisplay = (txType: TransactionType): 'withdraw' | 'swap' | 'limitSwap' => {
  switch (txType) {
    case TransactionType.TOKEN_SEND:
      return 'withdraw'
    case TransactionType.NFT_SEND:
      return 'swap' // Using swap for NFT for now
    default:
      return 'limitSwap' // Default for other types
  }
}

// Format date for grouping
const formatDateGroup = (dateCreated: bigint): string => {
  const date = new Date(Number(dateCreated) * 1000)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    })
  }
}

// Convert SpherreTransaction to UI Transaction
const mapToUITransaction = (spherreTransaction: SpherreTransaction): UITransaction => {
  const date = new Date(Number(spherreTransaction.date_created) * 1000)
  
  // Create Member objects for UI compatibility
  const createMemberFromAddress = (address: string) => ({
    name: `${address.slice(0, 6)}...${address.slice(-4)}`,
    avatar: '/Images/avatar.png', // Default avatar
    address: address
  })
  
  return {
    id: Number(spherreTransaction.id),
    date: date.toLocaleDateString(),
    type: getTransactionTypeDisplay(spherreTransaction.tx_type),
    amount: '0.00', // Will be fetched from transaction details
    toAddress: 'Unknown', // Will be fetched from transaction details
    time: date.toLocaleTimeString(),
    status: spherreTransaction.tx_status === 2 ? 'Executed' : 
            spherreTransaction.rejected.length > 0 ? 'Rejected' : 'Pending',
    initiator: createMemberFromAddress(spherreTransaction.proposer),
    dateInitiated: date.toLocaleDateString(),
    account: {
      name: 'Spherre Account',
      address: '0x0000000000000000000000000000000000000000', // Placeholder
      avatar: '/Images/spherrelogo.png'
    },
    to: createMemberFromAddress('0x0000000000000000000000000000000000000000'), // Placeholder
    threshold: {
      current: spherreTransaction.approved.length,
      required: 2 // Default threshold, will be overridden by blockchain data
    },
    approvals: spherreTransaction.approved.map(addr => ({
      member: createMemberFromAddress(addr),
      status: 'Confirmed' as const
    })),
    rejections: spherreTransaction.rejected.map(addr => ({
      member: createMemberFromAddress(addr),
      status: 'Rejected' as const
    }))
  }
}

export default function TransactionPage() {
  useTheme()
  const { address: accountAddress } = useAccount()
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // Fetch transactions and account details (only if wallet is connected)
  const { 
    data: transactions, 
    isLoading: transactionsLoading, 
    error: transactionsError 
  } = useTokenTransactionList(accountAddress as `0x${string}`)
  
  const { 
    data: accountDetails, 
    isLoading: accountLoading 
  } = useGetAccountDetails(accountAddress as `0x${string}`)

  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Group transactions by date and convert to UI format
  const groupedTransactions = useMemo(() => {
    if (!transactions) return {}
    
    return transactions.reduce((acc, spherreTransaction) => {
      const uiTransaction = mapToUITransaction(spherreTransaction)
      const dateGroup = formatDateGroup(spherreTransaction.date_created)
      if (!acc[dateGroup]) {
        acc[dateGroup] = []
      }
      acc[dateGroup].push(uiTransaction)
      return acc
    }, {} as Record<string, UITransaction[]>)
  }, [transactions])

  // Loading state
  if (transactionsLoading || accountLoading) {
    return (
      <div className="overflow-x-hidden bg-theme transition-colors duration-300">
        <div className="p-4 sm:p-6 lg:p-10 bg-theme-bg-secondary border border-theme-border rounded-xl transition-colors duration-300">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-theme">Loading transactions...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (transactionsError) {
    return (
      <div className="overflow-x-hidden bg-theme transition-colors duration-300">
        <div className="p-4 sm:p-6 lg:p-10 bg-theme-bg-secondary border border-theme-border rounded-xl transition-colors duration-300">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-theme font-medium mb-2">Failed to load transactions</h3>
            <p className="text-theme-secondary text-sm">Please check your wallet connection and try again.</p>
          </div>
        </div>
      </div>
    )
  }

  // No wallet connected
  if (!accountAddress) {
    return (
      <div className="overflow-x-hidden bg-theme transition-colors duration-300">
        <div className="p-4 sm:p-6 lg:p-10 bg-theme-bg-secondary border border-theme-border rounded-xl transition-colors duration-300">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-theme font-medium mb-2">Wallet Required</h3>
            <p className="text-theme-secondary text-sm">Connect your wallet to view transactions.</p>
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (!transactions || transactions.length === 0) {
    return (
      <div className="overflow-x-hidden bg-theme transition-colors duration-300">
        <div className="p-4 sm:p-6 lg:p-10 bg-theme-bg-secondary border border-theme-border rounded-xl transition-colors duration-300">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-12 h-12 bg-theme-bg-tertiary rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-theme font-medium mb-2">No transactions yet</h3>
            <p className="text-theme-secondary text-sm">Transaction proposals will appear here once created.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-hidden bg-theme transition-colors duration-300">
      <div className="p-4 sm:p-6 lg:p-10 bg-theme-bg-secondary border border-theme-border rounded-xl transition-colors duration-300">
        {Object.entries(groupedTransactions).map(([date, txns]) => (
          <div key={date} className="mb-4 sm:mb-6">
            <h2 className="text-theme-secondary text-xs sm:text-sm mb-2 transition-colors duration-300">
              {date}
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {txns.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-theme-bg-tertiary border border-theme-border rounded-lg overflow-hidden transition-colors duration-300"
                >
                  <Transaction
                    transaction={transaction}
                    isExpanded={expandedId === transaction.id}
                    onToggle={() => handleToggle(transaction.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
