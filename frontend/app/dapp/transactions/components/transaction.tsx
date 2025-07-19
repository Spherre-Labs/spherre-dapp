import { ReactNode, useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import limit from '../../../../public/Images/limit.png'
import swap from '../../../../public/Images/swap.png'
import withdraw from '../../../../public/Images/withdraw.png'
import strk from '../../../../public/Images/strk.png'
import Link from 'next/link'
import { useTheme } from '@/app/context/theme-context-provider'
import { useSpherreAccount } from '@/app/context/account-context'
import {
  useApproveTransaction,
  useRejectTransaction,
  useExecuteTransaction
} from '@/hooks/useSpherreHooks'
import {
  TransactionType,
  type TransactionDisplayInfo
} from '@/lib/contracts/types'
import { formatTimestamp, formatTime } from '@/lib/utils/transaction-utils'

interface TransactionProps {
  transactionInfo: TransactionDisplayInfo
  isExpanded: boolean
  onToggle: () => void
}

export default function Transaction({
  transactionInfo,
  isExpanded,
  onToggle,
}: TransactionProps) {
  useTheme()
  const { accountAddress } = useSpherreAccount()

  // Contract interaction hooks
  const { writeAsync: approveAsync, isLoading: isApproving } = useApproveTransaction(accountAddress!)
  const { writeAsync: rejectAsync, isLoading: isRejecting } = useRejectTransaction(accountAddress!)
  const { writeAsync: executeAsync, isLoading: isExecuting } = useExecuteTransaction(accountAddress!)

  const { transaction } = transactionInfo

  // Define type-specific elements
  const getTypeIcon = (type: TransactionType): ReactNode => {
    switch (type) {
      case TransactionType.TOKEN_SEND:
        return <Image src={withdraw} width={20} height={20} alt="token transfer" />
      case TransactionType.NFT_SEND:
        return <Image src={swap} width={20} height={20} alt="nft transfer" />
      case TransactionType.MEMBER_ADD:
      case TransactionType.MEMBER_REMOVE:
      case TransactionType.MEMBER_PERMISSION_EDIT:
        return <Image src={limit} width={20} height={20} alt="member action" />
      case TransactionType.THRESHOLD_CHANGE:
        return <Image src={limit} width={20} height={20} alt="threshold change" />
      case TransactionType.SMART_TOKEN_LOCK:
        return <Image src={swap} width={20} height={20} alt="smart lock" />
      default:
        return <Image src={withdraw} width={20} height={20} alt="transaction" />
    }
  }

  // Handle transaction actions
  const handleApprove = async () => {
    if (!transaction.id || !accountAddress) {
      console.error('Missing transaction ID or account address for approval')
      return
    }

    try {
      await approveAsync({ tx_id: transaction.id })
      console.log('Transaction approved successfully:', transaction.id)
    } catch (error) {
      console.error('Failed to approve transaction:', error, {
        transactionId: transaction.id,
        accountAddress,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      })
      // You could add a toast notification here in the future
    }
  }

  const handleReject = async () => {
    if (!transaction.id || !accountAddress) {
      console.error('Missing transaction ID or account address for rejection')
      return
    }

    try {
      await rejectAsync({ tx_id: transaction.id })
      console.log('Transaction rejected successfully:', transaction.id)
    } catch (error) {
      console.error('Failed to reject transaction:', error, {
        transactionId: transaction.id,
        accountAddress,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      })
      // You could add a toast notification here in the future
    }
  }

  const handleExecute = async () => {
    if (!transaction.id || !accountAddress) {
      console.error('Missing transaction ID or account address for execution')
      return
    }

    try {
      await executeAsync({ transaction_id: transaction.id })
      console.log('Transaction executed successfully:', transaction.id)
    } catch (error) {
      console.error('Failed to execute transaction:', error, {
        transactionId: transaction.id,
        accountAddress,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      })
      // You could add a toast notification here in the future
    }
  }

  // Add refs for smooth height animation
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | undefined>(0)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? contentRef.current.scrollHeight : 0)
    }
  }, [isExpanded])

  return (
    <div className="w-full bg-theme-bg-secondary border border-theme-border overflow-hidden transition-colors duration-300">
      <button
        onClick={onToggle}
        className="w-full p-4 sm:p-6 lg:p-8 flex items-center justify-between text-left hover:bg-theme-bg-tertiary transition-colors duration-200"
      >
        {/* Left side content with responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4 items-center flex-grow min-w-0">
          <div className="flex items-center space-x-2">
            {getTypeIcon(transaction.transactionType)}
            <span className="text-theme font-medium text-sm sm:text-base truncate transition-colors duration-300">
              {transactionInfo.title}
            </span>
          </div>

          {transactionInfo.amount && (
            <div className="text-theme-secondary flex items-center text-sm sm:text-base transition-colors duration-300">
              Amount:
              <span className="inline-flex items-center ml-1">
                <Image
                  src={strk}
                  width={16}
                  height={16}
                  className="sm:w-5 sm:h-5"
                  alt="token"
                />
                <span className="truncate">{transactionInfo.amount}</span>
              </span>
            </div>
          )}

          {transactionInfo.recipient && (
            <div className="text-theme-secondary truncate text-sm sm:text-base transition-colors duration-300">
              To: {transactionInfo.recipient}
            </div>
          )}

          <div className="text-theme-secondary truncate text-sm sm:text-base transition-colors duration-300">
            Initiated: {transactionInfo.transaction.proposer.slice(0, 8)}...
          </div>

          <div className="flex items-center justify-end space-x-2 sm:space-x-4">
            <span className="text-theme-secondary text-xs sm:text-sm transition-colors duration-300">
              {formatTime(transaction.dateCreated)}
            </span>
            <span
              className={`text-xs sm:text-sm ${transaction.status === 'Pending'
                ? 'text-yellow-400'
                : transaction.status === 'Executed'
                  ? 'text-green-400'
                  : 'text-red-500'
                }`}
            >
              {transaction.status}
            </span>
            <svg
              className={`w-4 h-4 sm:w-5 sm:h-5 text-theme-secondary transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* Expandable content with smooth height transition */}
      <div
        ref={contentRef}
        className="transition-all duration-300 ease-in-out border-t border-theme-border overflow-hidden"
        style={{ maxHeight: `${contentHeight}px`, opacity: isExpanded ? 1 : 0 }}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left: Transaction Progress */}
          <div className="lg:w-1/2 p-3 sm:p-4 border-theme-border flex flex-col">
            <h3 className="text-theme font-medium mb-3 sm:mb-4 text-sm sm:text-base transition-colors duration-300">
              Transaction Progress
            </h3>

            {/* Approvals */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
              <div className="flex items-center mb-2">
                <h4 className="text-theme font-medium mr-2 text-xs sm:text-sm transition-colors duration-300">
                  Pending Approvals
                </h4>
                <div className="border-2 border-theme-border text-theme-secondary text-xs px-2 py-1 sm:px-2.5 sm:py-2 rounded-full ml-2 transition-colors duration-300">
                  Pending
                </div>
              </div>
              <div className="flex items-center mb-2">
                <h4 className="text-[#19B360] font-medium mr-2 text-xs sm:text-sm">
                  Confirmed Approvals: {transaction.approved.length}
                </h4>
                {transaction.rejected.length > 0 && (
                  <h4 className="text-red-500 font-medium mr-2 text-xs sm:text-sm ml-4">
                    Rejections: {transaction.rejected.length}
                  </h4>
                )}
              </div>
            </div>

            <div className="flex-grow">
              <div className="flex mb-2 mt-2">
                <div className="flex">
                  <div className="flex flex-col items-center mr-3 sm:mr-4">
                    <div className="w-2 h-2 bg-theme rounded-full flex items-center justify-center mb-1 transition-colors duration-300">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-theme"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="h-full w-0.5 bg-theme-border transition-colors duration-300"></div>
                  </div>
                  <div>
                    <p className="text-theme text-sm sm:text-base transition-colors duration-300">
                      Initiated Transaction
                    </p>
                    <p className="text-theme-secondary text-xs sm:text-sm transition-colors duration-300">
                      {formatTimestamp(transaction.dateCreated)} {formatTime(transaction.dateCreated)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex mb-2 mt-2">
                <div className="flex">
                  <div className="flex flex-col items-center mr-3 sm:mr-4">
                    <div className="w-2 h-3 bg-theme rounded-full flex items-center justify-center mb-1 transition-colors duration-300">
                      {transaction.status === 'Pending'}
                    </div>
                    <div className="h-full w-0.5 bg-theme-border transition-colors duration-300"></div>
                  </div>
                  <div>
                    <p className="text-theme text-sm sm:text-base transition-colors duration-300">
                      {transaction.status}
                    </p>
                    <div className="flex items-center text-theme-secondary text-xs sm:text-sm transition-colors duration-300">
                      <p>Approvals: {transaction.approved.length} | Rejections: {transaction.rejected.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex mb-2 mt-2">
                <div className="flex">
                  <div className="flex flex-col items-center mr-3 sm:mr-4">
                    <div
                      className={`w-2 h-2 border border-theme-border ${transaction.status === 'Executed' ? 'bg-theme' : ''
                        } rounded-full flex items-center justify-center mb-1 transition-colors duration-300`}
                    >
                      {transaction.status === 'Executed' ? (
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-theme"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          />
                        </svg>
                      ) : null}
                    </div>
                  </div>
                  <div>
                    <p
                      className={`text-sm sm:text-base transition-colors duration-300 ${transaction.status === 'Executed'
                        ? 'text-theme'
                        : 'text-theme-secondary'
                        }`}
                    >
                      Executed
                    </p>
                    {transaction.dateExecuted && (
                      <p className="text-theme-secondary text-xs sm:text-sm transition-colors duration-300">
                        {formatTimestamp(transaction.dateExecuted)} {formatTime(transaction.dateExecuted)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto pt-3 sm:pt-4">
              {transaction.status === 'Pending' && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="bg-[#6F2FCE] hover:bg-purple-700 text-white px-4 sm:px-6 py-2 rounded-md transition duration-200 text-sm sm:text-base w-full sm:w-1/3 disabled:opacity-50"
                  >
                    {isApproving ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={isRejecting}
                    className="bg-theme-bg-tertiary hover:bg-theme-border text-theme px-4 sm:px-6 py-2 rounded-md transition duration-200 text-sm sm:text-base w-full sm:w-1/3 border border-theme-border disabled:opacity-50"
                  >
                    {isRejecting ? 'Rejecting...' : 'Reject'}
                  </button>
                  <button
                    onClick={handleExecute}
                    disabled={isExecuting}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-md transition duration-200 text-sm sm:text-base w-full sm:w-1/3 disabled:opacity-50"
                  >
                    {isExecuting ? 'Executing...' : 'Execute'}
                  </button>
                </div>
              )}
              {(transaction.status === 'Executed' || transaction.status === 'Rejected') && (
                <button className="bg-[#6F2FCE] hover:bg-purple-700 text-white px-4 sm:px-6 py-2 rounded-md transition duration-200 text-sm sm:text-base w-full">
                  Download CSV
                </button>
              )}
            </div>
          </div>

          {/* Right: Transaction Details */}
          <div className="lg:w-1/2 p-3 sm:p-4 flex flex-col">
            <h3 className="text-theme font-medium mb-3 sm:mb-4 text-sm sm:text-base transition-colors duration-300">
              Transaction Details
            </h3>
            <div className="text-theme-secondary text-xs sm:text-sm space-y-2 flex-grow transition-colors duration-300">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="text-theme truncate transition-colors duration-300">
                  {transactionInfo.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Proposer:</span>
                <span className="text-theme truncate transition-colors duration-300">
                  {transaction.proposer.slice(0, 8)}...{transaction.proposer.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Date initiated:</span>
                <span className="text-theme truncate transition-colors duration-300">
                  {formatTimestamp(transaction.dateCreated)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="text-theme truncate transition-colors duration-300">
                  {transaction.id.toString().slice(0, 12)}...
                </span>
              </div>
              {transactionInfo.subtitle && (
                <div className="flex justify-between">
                  <span>Details:</span>
                  <span className="text-theme truncate transition-colors duration-300">
                    {transactionInfo.subtitle}
                  </span>
                </div>
              )}
            </div>
            <Link href={`/dapp/transactions/${transaction.id}`}>
              <button className="mt-3 sm:mt-4 w-full bg-theme-bg-tertiary hover:bg-theme-border text-theme py-2 rounded-lg transition-colors text-sm sm:text-base border border-theme-border">
                See transaction details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
