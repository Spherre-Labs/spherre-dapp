'use client'
import React from 'react'
import { transactions } from '@/app/dapp/transactions/data'
import { TransactionDetailsHeader } from './components/TransactionDetailsHeader'
import { TransactionSummary } from './components/TransactionSummary'
import { TransactionDetailsBody } from './components/TransactionParticipants'
import { useTheme } from '@/app/context/theme-context-provider'

interface PageProps {
  params: {
    id: string
  }
}

export default function TransactionDetailsPage({ params }: PageProps) {
  useTheme()
  const transaction = transactions.find(
    (t) => t.id === parseInt(params.id),
  )

  if (!transaction) {
    return (
      <div className="text-theme text-center p-10 bg-theme min-h-screen transition-colors duration-300">
        Transaction not found.
      </div>
    )
  }

  return (
    <div className="bg-theme-bg-secondary border border-theme-border text-theme p-6 rounded-lg h-[95.5vh] transition-colors duration-300">
      <TransactionDetailsHeader status={transaction.status} />
      <TransactionSummary transaction={transaction} />
      <TransactionDetailsBody transaction={transaction} />
    </div>
  )
}
