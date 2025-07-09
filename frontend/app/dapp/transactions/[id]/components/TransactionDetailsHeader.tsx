'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useTheme } from '@/app/context/theme-context-provider'

interface TransactionDetailsHeaderProps {
  status: 'Pending' | 'Executed' | 'Rejected'
}

export const TransactionDetailsHeader = ({
  status,
}: TransactionDetailsHeaderProps) => {
  useTheme()

  return (
    <>
      <Link
        href="/dapp/transactions"
        className="flex items-center gap-2 text-theme-secondary hover:text-theme mb-6 transition-colors duration-200"
      >
        <ArrowLeft size={20} />
        <span>Back to Transactions</span>
      </Link>

      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-theme transition-colors duration-300">
            Transaction Details
          </h1>
          <p className="text-theme-secondary transition-colors duration-300">
            See the full detailed information about this transaction
          </p>
        </div>
        <div className="flex gap-4">
          {status === 'Pending' && (
            <>
              <button className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-200">
                Approve
              </button>
              <button className="bg-theme-bg-tertiary border border-theme-border text-theme px-6 py-2 rounded-lg hover:bg-theme-bg-secondary transition-colors duration-200">
                Reject
              </button>
            </>
          )}
          {(status === 'Executed' || status === 'Rejected') && (
            <button className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-200">
              Download CSV
            </button>
          )}
        </div>
      </header>
    </>
  )
}
