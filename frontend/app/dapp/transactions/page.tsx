'use client'

import { useState } from 'react'
import Transaction from './components/transaction'
import {
  transactions as allTransactions,
  Transaction as TransactionType,
} from './data'

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
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="overflow-x-hidden">
      <div className="p-4 sm:p-6 lg:p-10 bg-[#1C1D1F] rounded-xl">
        {Object.entries(groupedTransactions).map(([date, txns]) => (
          <div key={date} className="mb-4 sm:mb-6">
            <h2 className="text-gray-400 text-xs sm:text-sm mb-2">{date}</h2>
            <div className="space-y-4 sm:space-y-6">
              {txns.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-[#2A2A2A] rounded-lg overflow-hidden"
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
