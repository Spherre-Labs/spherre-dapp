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
import { routes } from '@/lib/utils/routes'
import { Button } from '@/components/ui/button'

interface TransactionDetailsHeaderProps {
  status: 'Initiated' | 'Approved' | 'Executed' | 'Rejected'
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
        href={routes(accountAddress).transactions}
        className="w-fit block gap-2 p-1.5 rounded-[5px] border border-theme-border bg-theme-bg-secondary hover:text-theme mb-5 transition-colors duration-200"
      >
        <ArrowLeft size={20} />
      </Link>

      <header className="flex justify-between items-center mb-6 font-sans">
        <div>
          <h1 className="text-2xl font-bold text-theme transition-colors duration-300">
            Transaction Details
          </h1>
          <p className="text-theme-text-secondary transition-colors duration-300">
            See the full detailed information about this transaction
          </p>
        </div>
        <div className="flex gap-4">
          {status.toLowerCase() === 'initiated' && (
            <>
              <Button
                onClick={handleApprove}
                disabled={isApproving}
                className="text-white px-4 min-w-44 font-medium py-2.5 rounded-md transition duration-200 w-full"
              >
                {isApproving ? 'Approving...' : 'Approve'}
              </Button>
              <Button
                onClick={handleReject}
                disabled={isRejecting}
                className="bg-theme-bg-secondary hover:bg-theme-bg-secondary text-theme px-4 min-w-44 font-medium py-2.5 rounded-md transition duration-200 w-full"
              >
                {isRejecting ? 'Rejecting...' : 'Reject'}
              </Button>
            </>
          )}
          {status.toLowerCase() === 'approved' && (
            <Button
              onClick={handleExecute}
              disabled={isExecuting}
              className="bg-light-green text-white px-4 min-w-44 font-medium py-2.5 rounded-md transition duration-200 w-full"
            >
              {isExecuting ? 'Executing...' : 'Execute'}
            </Button>
          )}
          {(status.toLowerCase() === 'executed' ||
            status.toLowerCase() === 'rejected') && (
              <button className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-200">
                Download CSV
              </button>
            )}
        </div>
      </header>
    </>
  )
}
