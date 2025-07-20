'use client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useTheme } from '@/app/context/theme-context-provider'
import { useSpherreAccount } from '@/app/context/account-context'
import {
  useApproveTransaction,
  useRejectTransaction,
  useExecuteTransaction,
} from '@/hooks/useSpherreHooks'

interface TransactionDetailsHeaderProps {
  status: 'Pending' | 'Executed' | 'Rejected'
  transactionId?: string | bigint
}

export const TransactionDetailsHeader = ({
  status,
  transactionId,
}: TransactionDetailsHeaderProps) => {
  useTheme()
  const { accountAddress } = useSpherreAccount()

  // Contract interaction hooks
  const { writeAsync: approveAsync, isLoading: isApproving } =
    useApproveTransaction(accountAddress || '0x0')
  const { writeAsync: rejectAsync, isLoading: isRejecting } =
    useRejectTransaction(accountAddress || '0x0')
  const { writeAsync: executeAsync, isLoading: isExecuting } =
    useExecuteTransaction(accountAddress || '0x0')

  // Handle transaction actions
  const handleApprove = async () => {
    if (!transactionId || !accountAddress) {
      console.error('Missing transaction ID or account address for approval')
      return
    }

    try {
      await approveAsync({ transaction_id: transactionId })
      console.log('Transaction approved successfully:', transactionId)
    } catch (error) {
      console.error('Failed to approve transaction:', error, {
        transactionId,
        accountAddress,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const handleReject = async () => {
    if (!transactionId || !accountAddress) {
      console.error('Missing transaction ID or account address for rejection')
      return
    }

    try {
      await rejectAsync({ transaction_id: transactionId })
      console.log('Transaction rejected successfully:', transactionId)
    } catch (error) {
      console.error('Failed to reject transaction:', error, {
        transactionId,
        accountAddress,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const handleExecute = async () => {
    if (!transactionId || !accountAddress) {
      console.error('Missing transaction ID or account address for execution')
      return
    }

    try {
      await executeAsync({ transaction_id: transactionId })
      console.log('Transaction executed successfully:', transactionId)
    } catch (error) {
      console.error('Failed to execute transaction:', error, {
        transactionId,
        accountAddress,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

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
              <button
                onClick={handleApprove}
                disabled={isApproving}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50"
              >
                {isApproving ? 'Approving...' : 'Approve'}
              </button>
              <button
                onClick={handleReject}
                disabled={isRejecting}
                className="bg-theme-bg-tertiary border border-theme-border text-theme px-6 py-2 rounded-lg hover:bg-theme-bg-secondary transition-colors duration-200 disabled:opacity-50"
              >
                {isRejecting ? 'Rejecting...' : 'Reject'}
              </button>
              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
              >
                {isExecuting ? 'Executing...' : 'Execute'}
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
