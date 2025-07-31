'use client'
import React from 'react'
import { useTheme } from '@/app/context/theme-context-provider'
import { type TransactionDisplayInfo } from '@/lib/contracts/types'

export const TransactionSummary = ({
  transactionInfo,
}: {
  transactionInfo: TransactionDisplayInfo
}) => {
  useTheme()

  return (
    <section className="mb-6">
      <h2 className="text-lg font-medium text-theme mb-4 transition-colors duration-300">
        Transaction Summary
      </h2>
      <div className="bg-theme-bg-tertiary border border-theme-border p-4 rounded-lg transition-colors duration-300">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-theme font-medium transition-colors duration-300">
              {transactionInfo.title}
            </h3>
            <p className="text-theme-secondary text-sm transition-colors duration-300">
              {transactionInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Additional details based on transaction type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {transactionInfo.amount && (
            <div className="flex justify-between">
              <span className="text-theme-secondary">Amount:</span>
              <span className="text-theme font-medium">
                {transactionInfo.amount}
              </span>
            </div>
          )}

          {transactionInfo.recipient && (
            <div className="flex justify-between">
              <span className="text-theme-secondary">Recipient:</span>
              <span className="text-theme font-medium">
                {transactionInfo.recipient}
              </span>
            </div>
          )}

          {transactionInfo.token && (
            <div className="flex justify-between">
              <span className="text-theme-secondary">Token:</span>
              <span className="text-theme font-medium">
                {transactionInfo.token}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-theme-secondary">Status:</span>
            <span
              className={`font-medium ${
                transactionInfo.transaction.status.toLowerCase() === 'initiated'
                  ? 'text-yellow-300'
                  : transactionInfo.transaction.status.toLowerCase() ===
                      'approved'
                    ? 'text-[#2dd4bf]'
                    : transactionInfo.transaction.status.toLowerCase() ===
                        'executed'
                      ? 'text-[#22c55e]'
                      : transactionInfo.transaction.status.toLowerCase() ===
                          'rejected'
                        ? 'text-[#ef4444]'
                        : 'text-[#a78bfa]'
              }`}
            >
              {transactionInfo.transaction.status}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
