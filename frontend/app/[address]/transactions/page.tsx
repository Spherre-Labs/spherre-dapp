'use client'

import { useState } from 'react'
import Transaction from './components/transaction'
import {
  transactions as allTransactions,
  Transaction as TransactionType,
} from './data'
import { useTheme } from '@/app/context/theme-context-provider'
import {
  TransactionDisplayInfo,
  TransactionType as ContractTransactionType,
} from '@/lib/contracts/types'

// Convert mock data to TransactionDisplayInfo format
const convertToTransactionDisplayInfo = (
  transaction: TransactionType,
): TransactionDisplayInfo => {
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
      dateCreated: BigInt(Date.now()),
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

// Group transactions by date
const groupedTransactions = allTransactions.reduce(
  (acc, transaction) => {
    if (!acc[transaction.date]) {
      acc[transaction.date] = []
    }
    acc[transaction.date].push(convertToTransactionDisplayInfo(transaction))
    return acc
  },
  {} as Record<string, TransactionDisplayInfo[]>,
)

export default function TransactionPage() {
  useTheme()
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
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
              {txns.map((transactionInfo) => (
                <div
                  key={transactionInfo.transaction.id.toString()}
                  className="bg-theme-bg-tertiary border border-theme-border rounded-lg overflow-hidden transition-colors duration-300"
                >
                  <Transaction
                    transactionInfo={transactionInfo}
                    isExpanded={
                      expandedId === Number(transactionInfo.transaction.id)
                    }
                    onToggle={() =>
                      handleToggle(Number(transactionInfo.transaction.id))
                    }
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
