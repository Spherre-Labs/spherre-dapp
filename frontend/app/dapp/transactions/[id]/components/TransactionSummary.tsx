'use client'
import React from 'react'
import Image from 'next/image'
import { Transaction } from '@/app/dapp/transactions/data'
import { useTheme } from '@/app/context/theme-context-provider'

const getSummaryTitle = (transaction: Transaction) => {
  switch (transaction.type) {
    case 'withdraw':
      return `Withdraw ${transaction.amount} to ${transaction.to.name} (${transaction.to.address})`
    case 'swap':
      return `Swap ${transaction.tokenIn?.amount} ${transaction.tokenIn?.name} for ${transaction.tokenOut?.amount} ${transaction.tokenOut?.name}`
    case 'limitSwap':
      return `Limit Swap ${transaction.tokenIn?.amount} ${transaction.tokenIn?.name} for ${transaction.tokenOut?.amount} ${transaction.tokenOut?.name}`
    default:
      return 'Transaction'
  }
}

export const TransactionSummary = ({
  transaction,
}: {
  transaction: Transaction
}) => {
  useTheme()

  return (
    <section className="p-4 rounded-lg flex justify-between items-center mb-6 border border-dashed border-theme-border bg-theme-bg-secondary transition-colors duration-300">
      <div className="flex items-center gap-4">
        <div className="bg-theme-bg-tertiary border border-theme-border p-2 rounded-lg transition-colors duration-300">
          <Image
            src="/Images/Transactions.png"
            alt="Transaction"
            width={24}
            height={24}
          />
        </div>
        <div>
          <p className="text-theme transition-colors duration-300">
            {getSummaryTitle(transaction)}
          </p>
          <span
            className={`px-2 py-1 rounded-full text-xs transition-colors duration-300 ${
              transaction.status === 'Executed'
                ? 'text-green-400 bg-green-400/10'
                : transaction.status === 'Pending'
                  ? 'text-yellow-400 bg-yellow-400/10'
                  : 'text-red-400 bg-red-400/10'
            }`}
          >
            {transaction.status}
          </span>
        </div>
      </div>
      <div className="text-right border border-theme-border bg-theme-bg-tertiary p-2 rounded-md transition-colors duration-300">
        <p className="font-bold text-lg text-theme transition-colors duration-300">
          You Send {transaction.amount}
        </p>
        <p className="text-theme-secondary text-sm transition-colors duration-300">
          130 USD
        </p>
      </div>
    </section>
  )
}
