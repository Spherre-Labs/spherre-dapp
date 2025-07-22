'use client'
import React, { useState, useEffect } from 'react'
import { mockTransactions } from './data'
import Transaction from './components/transaction'
import type { Transaction as TransactionType } from './data'
import { TransactionDisplayInfo } from './components/types'
import { ContractTransactionType } from '@/lib/api/spherre-api'

export default function TransactionsPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Convert mock data to TransactionDisplayInfo format
  const convertToTransactionDisplayInfo = (
    transaction: TransactionType,
  ): TransactionDisplayInfo => {
    // Use a fixed timestamp for SSR consistency
    const fixedTimestamp = new Date('2024-01-01').getTime()

    return {
      transaction: {
        id: BigInt(transaction.id),
        transactionType: ContractTransactionType.TOKEN_SEND, // Default type
        status:
          transaction.status === 'Pending'
            ? 'Pending'
            : transaction.status === 'Executed'
              ? 'Executed'
              : 'Rejected',
        proposer: transaction.initiator.name,
        executor: transaction.account.address,
        approved: transaction.approvals.map((a) => a.member.name),
        rejected: transaction.rejections.map((a) => a.member.name),
        dateCreated: BigInt(fixedTimestamp),
        dateExecuted: transaction.dateExecuted
          ? BigInt(new Date(transaction.dateExecuted).getTime())
          : undefined,
        data: {
          token: 'STRK',
          amount: BigInt(parseFloat(transaction.amount) * 1e18),
          recipient: transaction.toAddress,
        },
      },
      title: `${transaction.type} ${transaction.amount} ${transaction.tokenIn?.name || 'STRK'}`,
      subtitle: `To: ${transaction.toAddress}`,
      amount: transaction.amount,
      recipient: transaction.toAddress,
      token: transaction.tokenIn?.name || 'STRK',
    }
  }

  if (!mounted) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-theme-bg-tertiary rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-theme-bg-tertiary rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-theme">
        Transaction Activity
      </h1>
      <div className="space-y-4">
        {mockTransactions.map((transaction, index) => {
          const transactionInfo = convertToTransactionDisplayInfo(transaction)
          return (
            <Transaction
              key={transaction.id}
              transactionInfo={transactionInfo}
              isExpanded={index === 0}
              onToggle={() => {}}
            />
          )
        })}
      </div>
    </div>
  )
}
