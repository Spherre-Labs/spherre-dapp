'use client'
import React from 'react'
import { transactions } from '@/app/dapp/transactions/data'
import { TransactionDetailsHeader } from './components/TransactionDetailsHeader'
import { TransactionSummary } from './components/TransactionSummary'
import { TransactionDetailsBody } from './components/TransactionParticipants'

export default function TransactionDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const transaction = transactions.find((t) => t.id === parseInt(params.id))

  if (!transaction) {
    return (
      <div className="text-white text-center p-10">Transaction not found.</div>
    )
  }

  return (
    <div className="bg-[#1C1D1F] text-white p-6 rounded-lg h-[95.5vh]">
      <TransactionDetailsHeader status={transaction.status} />
      <TransactionSummary transaction={transaction} />
      <TransactionDetailsBody transaction={transaction} />
    </div>
  )
}
