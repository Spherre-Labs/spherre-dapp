'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface TransactionDetailsHeaderProps {
  status: 'Pending' | 'Executed' | 'Rejected'
}

export const TransactionDetailsHeader = ({
  status,
}: TransactionDetailsHeaderProps) => (
  <>
    <Link
      href="/dapp/transactions"
      className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
    >
      <ArrowLeft size={20} />
      <span>Back to Transactions</span>
    </Link>

    <header className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Transaction Details</h1>
        <p className="text-gray-400">
          See the full detailed information about this transaction
        </p>
      </div>
      <div className="flex gap-4">
        {status === 'Pending' && (
          <>
            <button className="bg-[#6F2FCE] px-6 py-2 rounded-lg">
              Approve
            </button>
            <button className="bg-[#2A2A2A] px-6 py-2 rounded-lg">
              Reject
            </button>
          </>
        )}
        {(status === 'Executed' || status === 'Rejected') && (
          <button className="bg-[#6F2FCE] px-6 py-2 rounded-lg">
            Download CSV
          </button>
        )}
      </div>
    </header>
  </>
)
