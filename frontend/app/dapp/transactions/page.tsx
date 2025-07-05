'use client'

import { useState } from 'react'
import Transaction from './components/transaction'
import {
  transactions as allTransactions,
  Transaction as TransactionType,
} from './data'
import { useTheme } from '@/app/context/theme-context-provider'

// Group transactions by date
const groupedTransactions = allTransactions.reduce(
  (acc, transaction) => {
    if (!acc[transaction.date]) {
      acc[transaction.date] = []
    }
    acc[transaction.date].push(transaction)
    return acc
  },
  {} as Record<string, TransactionType[]>,
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
