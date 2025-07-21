'use client'
import React, { use } from 'react'
import { TransactionDetailsHeader } from './components/TransactionDetailsHeader'
import { TransactionSummary } from './components/TransactionSummary'
import { TransactionDetails } from './components/TransactionDetails'
import { useTheme } from '@/app/context/theme-context-provider'
import { useTransactionDetails } from '@/hooks/useTransactionIntegration'
import { transactions as allTransactions } from '../data'
import { type TransactionDisplayInfo } from '@/lib/contracts/types'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function TransactionDetailsPage({ params }: PageProps) {
  useTheme()
  const resolvedParams = use(params)

  // Fetch real transaction data from smart contract
  const {
    transaction: transactionInfo,
    isLoading,
    error,
    refetch,
  } = useTransactionDetails(resolvedParams.id)

  // Handle error logging as per requirements
  if (error) {
    console.error('Failed to fetch transaction details:', error)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-theme-bg-secondary border border-theme-border text-theme p-6 rounded-lg min-h-screen transition-colors duration-300">
        <div className="flex justify-center items-center h-full">
          <div className="text-theme-secondary transition-colors duration-300">
            Loading transaction details...
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !isLoading) {
    return (
      <div className="bg-theme-bg-secondary border border-theme-border text-theme p-6 rounded-lg min-h-screen transition-colors duration-300">
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

  // Transaction not found - try to find in mock data as fallback
  if (!transactionInfo) {
    const mockTransaction = allTransactions.find(
      (t) => t.id.toString() === resolvedParams.id,
    )

    if (!mockTransaction) {
      return (
        <div className="text-theme text-center p-10 bg-theme min-h-screen transition-colors duration-300">
          Transaction not found.
        </div>
      )
    }

    // Convert mock data to TransactionDisplayInfo format
    const fallbackTransactionInfo: TransactionDisplayInfo = {
      transaction: {
        id: BigInt(mockTransaction.id),
        status: mockTransaction.status,
        proposer: mockTransaction.initiator.address || '0x0',
        approved: mockTransaction.approvals.map(
          (a) => a.member.address || '0x0',
        ),
        rejected: mockTransaction.rejections.map(
          (r) => r.member.address || '0x0',
        ),
        dateCreated: BigInt(Date.now()),
        transactionType:
          mockTransaction.type === 'withdraw'
            ? 5
            : mockTransaction.type === 'swap'
              ? 6
              : 7,
        data: {
          token: 'STRK',
          amount: BigInt(
            Math.floor(parseFloat(mockTransaction.amount.split(' ')[0] || '0')),
          ),
          recipient: mockTransaction.toAddress,
        },
      },
      title: `${mockTransaction.type.charAt(0).toUpperCase() + mockTransaction.type.slice(1)} ${mockTransaction.amount}`,
      subtitle: `To: ${mockTransaction.toAddress}`,
      amount: mockTransaction.amount,
      recipient: mockTransaction.toAddress,
    }

    return (
      <div className="bg-theme-bg-secondary border border-theme-border text-theme p-6 rounded-lg min-h-screen transition-colors duration-300">
        <TransactionDetailsHeader
          status={fallbackTransactionInfo.transaction.status}
          transactionId={fallbackTransactionInfo.transaction.id}
        />
        <TransactionSummary transactionInfo={fallbackTransactionInfo} />
        <TransactionDetails transactionInfo={fallbackTransactionInfo} />
      </div>
    )
  }

  return (
    <div className="bg-theme-bg-secondary border border-theme-border text-theme p-6 rounded-lg min-h-screen transition-colors duration-300">
      <TransactionDetailsHeader
        status={transactionInfo.transaction.status}
        transactionId={transactionInfo.transaction.id}
      />
      <TransactionSummary transactionInfo={transactionInfo} />
      <TransactionDetails transactionInfo={transactionInfo} />
    </div>
  )
}
