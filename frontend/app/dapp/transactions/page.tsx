'use client'

import { useState } from 'react'
import Transaction from './components/transaction'
import { transactions as allTransactions } from './data'
import { useTheme } from '@/app/context/theme-context-provider'
import { type TransactionDisplayInfo } from '@/lib/contracts/types'

// Convert data to TransactionDisplayInfo format and group by date
const groupedTransactions = allTransactions.reduce(
  (acc, transaction) => {
    // Convert to TransactionDisplayInfo format
    const transactionInfo: TransactionDisplayInfo = {
      transaction: {
        id: BigInt(transaction.id),
        status: transaction.status,
        proposer: transaction.initiator.address || '0x0',
        approved: transaction.approvals.map((a) => a.member.address || '0x0'),
        rejected: transaction.rejections.map((r) => r.member.address || '0x0'),
        dateCreated: BigInt(Date.now()),
        transactionType:
          transaction.type === 'withdraw'
            ? 5
            : transaction.type === 'swap'
              ? 6
              : 7,
        data: {
          token: 'STRK',
          amount: BigInt(
            Math.floor(parseFloat(transaction.amount.split(' ')[0] || '0')),
          ),
          recipient: transaction.toAddress,
        },
      },
      title: `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} ${transaction.amount}`,
      subtitle: `To: ${transaction.toAddress}`,
      amount: transaction.amount,
      recipient: transaction.toAddress,
    }

    if (!acc[transaction.date]) {
      acc[transaction.date] = []
    }
    acc[transaction.date].push(transactionInfo)
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
              {date}image.png
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {txns.map((transaction) => (
                <div
                  key={Number(transaction.transaction.id)}
                  className="bg-theme-bg-tertiary border border-theme-border rounded-lg overflow-hidden transition-colors duration-300"
                >
                  <Transaction
                    transactionInfo={transaction}
                    isExpanded={
                      expandedId === Number(transaction.transaction.id)
                    }
                    onToggle={() =>
                      handleToggle(Number(transaction.transaction.id))
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
