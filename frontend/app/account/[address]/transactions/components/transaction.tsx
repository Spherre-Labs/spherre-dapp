import { ReactNode, useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import limit from '../../../../../public/Images/limit.png'
import members from '../../../../../public/Images/Members.png'
import backstageboys from '../../../../../public/Images/backstageboys.png'
import swap from '../../../../../public/Images/swap.png'
import withdraw from '../../../../../public/Images/withdraw.png'
import Link from 'next/link'
import { useTheme } from '@/app/context/theme-context-provider'
import { useSpherreAccount } from '@/app/context/account-context'
import {
  useApproveTransaction,
  useRejectTransaction,
  useExecuteTransaction,
  useGetAccountName,
} from '@/hooks/useSpherreHooks'
import {
  TransactionType,
  type TransactionDisplayInfo,
} from '@/lib/contracts/types'
import {
  formatTimestamp,
  formatTime,
  getAvatarUrl,
} from '@/lib/utils/transaction-utils'
import {
  BadgeCheck,
  ChevronDown,
  CircleArrowRight,
  CircleX,
  Copy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { routes } from '@/lib/utils/routes'
import { toTitleCase } from '@/lib/utils/text'
import { transactionDisplayData } from './transactionDisplayData'
import { TransactionActionButtons } from './transactionActionButtons'
import { useAccount } from '@starknet-react/core'

interface TransactionProps {
  transactionInfo: TransactionDisplayInfo
  isExpanded: boolean
  onToggle: () => void
  threshold: number
}

const displayApprovals = (approved: string[]) => {
  return (
    <>
      {approved.slice(0, 2).map((_, index) => (
        <Image
          key={index}
          src={getAvatarUrl(approved[index])}
          alt="member2"
          width={21}
          height={21}
          className={`rounded-full ${index === 0 ? '' : '-ml-1'}`}
        />
      ))}
      {approved.length > 2 && (
        <div className="border border-ash w-5 h-5 text-[11px] py-[2px] px-[3px] font-bold text-theme-text-secondary flex items-center justify-center rounded-full ml-2 transition-colors duration-300">
          +{approved.length - 2}
        </div>
      )}
    </>
  )
}

export default function Transaction({
  transactionInfo,
  isExpanded,
  onToggle,
  threshold,
}: TransactionProps) {
  useTheme()
  const { accountAddress } = useSpherreAccount()
  const { isConnected } = useAccount()

  // Contract interaction hooks
  const { writeAsync: approveAsync, isLoading: isApproving } =
    useApproveTransaction(accountAddress || '0x0')
  const { writeAsync: rejectAsync, isLoading: isRejecting } =
    useRejectTransaction(accountAddress || '0x0')
  const { writeAsync: executeAsync, isLoading: isExecuting } =
    useExecuteTransaction(accountAddress || '0x0')

  // Get account name and threshold
  const { data: accountName } = useGetAccountName(accountAddress || '0x0')

  const { transaction } = transactionInfo
  const transactionStatus = transaction.status.toLowerCase()
  const required = threshold ? threshold : Infinity
  const canExecute = transaction.approved.length >= required

  // Define type-specific elements with proper icon mapping
  const getTypeIcon = (type: string): ReactNode => {
    // Map transaction type to appropriate icon based on the transaction title
    if (!(type in TransactionType)) return
    const title = transactionInfo.title.toLowerCase()

    // Check title first for accurate mapping (since title includes the actual transaction type)
    if (title.startsWith('withdraw')) {
      return <Image src={withdraw} width={20} height={20} alt="withdraw" />
    } else if (title.startsWith('limitswap')) {
      return <Image src={limit} width={20} height={20} alt="limit swap" />
    } else if (title.startsWith('swap')) {
      return <Image src={swap} width={20} height={20} alt="swap" />
    }

    // Fallback to contract type mapping for other transaction types
    switch (type) {
      case TransactionType.TOKEN_SEND:
        return (
          <Image src={withdraw} width={20} height={20} alt="token transfer" />
        )
      case TransactionType.NFT_SEND:
        return <Image src={swap} width={20} height={20} alt="nft transfer" />
      case TransactionType.MEMBER_ADD:
      case TransactionType.MEMBER_REMOVE:
      case TransactionType.MEMBER_PERMISSION_EDIT:
        return (
          <Image src={members} width={20} height={20} alt="member action" />
        )
      case TransactionType.THRESHOLD_CHANGE:
        return (
          <Image src={limit} width={20} height={20} alt="threshold change" />
        )
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
      await approveAsync({ transaction_id: transaction.id })
      console.log('Transaction approved successfully:', transaction.id)
    } catch (error) {
      console.error('Failed to approve transaction:', error, {
        transactionId: transaction.id,
        accountAddress,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const handleReject = async () => {
    if (!transaction.id || !accountAddress) {
      console.error('Missing transaction ID or account address for rejection')
      return
    }

    try {
      await rejectAsync({ transaction_id: transaction.id })
      console.log('Transaction rejected successfully:', transaction.id)
    } catch (error) {
      console.error('Failed to reject transaction:', error, {
        transactionId: transaction.id,
        accountAddress,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })
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
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })
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
    <div className="w-full bg-theme-bg-tertiary border border-theme-border overflow-hidden transition-colors duration-300 font-sans">
      {/* className="w-full p-4 lg:p-6 flex items-center gap-[85px] bg-theme-bg-tertiary transition-colors duration-200" */}
      <button
        onClick={onToggle}
        className="w-full rounded-none bg-theme-bg-tertiary px-4 py-4 lg:px-6 transition-colors duration-200 hover:bg-theme-bg-tertiary/80"
      >
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Icon + Title */}
          <div className="flex min-w-[200px] flex-[1.1] items-center gap-2">
            {getTypeIcon(transaction.transactionType)}
            <span className="font-sans text-theme font-medium truncate transition-colors duration-300">
              {transactionInfo.title}
            </span>
          </div>

          {/* Dynamic transaction metadata */}
          <div className="flex min-w-[260px] flex-[1.2] flex-wrap items-center justify-center gap-6">
            {transactionDisplayData(transactionInfo)}
          </div>

          {/* Initiator */}
          <div className="flex min-w-[160px] flex-1 items-center justify-center gap-2 text-theme-secondary transition-colors duration-300">
            <span className="text-sm text-theme-secondary">Initiator:</span>
            <span className="text-theme font-medium">
              {transactionInfo.transaction.proposer.slice(0, 6)}...
              {transactionInfo.transaction.proposer.slice(-4)}
            </span>
          </div>

          {/* Time + Status + Chevron */}
          <div className="flex min-w-[160px] flex-1 items-center justify-end gap-3">
            <div className="text-theme-secondary transition-colors duration-300 whitespace-nowrap">
              {formatTime(transaction.dateCreated)}
            </div>
            <span
              className={`whitespace-nowrap px-3 py-1 rounded-full ${
                transactionStatus === 'initiated'
                  ? 'text-light-yellow'
                  : transactionStatus === 'executed'
                    ? 'text-green'
                    : transactionStatus === 'approved'
                      ? 'text-light-green'
                      : transactionStatus === 'rejected'
                        ? 'text-[#D44B4B]'
                        : 'text-theme-secondary'
              }`}
            >
              {toTitleCase(transactionStatus)}
            </span>
            <div className="flex-shrink-0">
              <ChevronDown
                className={`w-4 h-4 sm:w-5 sm:h-5 text-theme-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </div>
      </button>

      {/* Expandable content with smooth height transition */}
      <div
        ref={contentRef}
        className="transition-all duration-300 ease-in-out border-t border-theme-border overflow-hidden"
        style={{ maxHeight: `${contentHeight}px`, opacity: isExpanded ? 1 : 0 }}
      >
        <div className="flex flex-col mt-2 pb-3 lg:flex-row px-6 font-sans">
          {/* Left: Transaction Progress */}
          <div className="w-[400px] border-theme-border mt-1.5 flex flex-col">
            <h3 className="text-theme font-semibold mb-3 sm:mb-4 transition-colors duration-300">
              Transaction Progress
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {/* Approvals */}
              <div className="flex items-center mb-2">
                <h4 className="text-xs text-light-yellow font-semibold mr-2 transition-colors duration-300">
                  Pending Approvals
                  {transactionStatus === 'initiated' ? (
                    <span>
                      {` `}
                      {`(${threshold - transaction.approved.length})`}
                    </span>
                  ) : (
                    <></>
                  )}
                </h4>
              </div>
              <div className="flex justify-start gap-2 items-center mb-2">
                <h4 className="text-xs text-green font-semibold transition-colors duration-300">
                  {`Confirmed Approvals (${transaction.approved.length})`}
                </h4>
                {transactionStatus === 'approved' ||
                transactionStatus === 'executed' ||
                transactionStatus === 'rejected' ? (
                  <div className="flex items-center gap-0">
                    {displayApprovals(transaction.approved)}
                  </div>
                ) : (
                  <></>
                )}
              </div>

              {/* Txn Timeline */}
              <div className="flex-grow font-sans">
                <div className="flex items-start mt-2 space-x-2 mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-[9px] h-[9px] bg-white rounded-full flex items-center justify-center"></div>
                    <div className="w-[1px] h-12 bg-white mt-0"></div>
                  </div>
                  <div className="flex-1 pt-0">
                    <h3 className="text-theme flex items-center gap-1 font-semibold -mt-1.5">
                      Initiated Transaction
                      <BadgeCheck
                        className="w-5 h-5 text-secondary"
                        fill="#19B360"
                      />
                    </h3>
                    <p className="text-theme-secondary font-semibold text-xs transition-colors duration-300">
                      {formatTimestamp(transaction.dateCreated)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start mt-0 space-x-2 mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-[9px] h-[9px] bg-white rounded-full flex items-center justify-center"></div>
                    <div
                      className={`w-[1px] h-12 mt-0 ${transactionStatus === 'initiated' ? 'bg-[#55534E]' : 'bg-white'}`}
                    ></div>
                  </div>
                  <div className="flex-1 pt-0">
                    <h3 className="text-theme flex items-center gap-1 font-semibold -mt-1.5">
                      Pending
                      {transactionStatus === 'executed' && (
                        <BadgeCheck
                          className="w-5 h-5 text-secondary"
                          fill="#19B360"
                        />
                      )}
                      {transactionStatus === 'rejected' && (
                        <CircleX
                          className="w-5 h-5 text-secondary"
                          fill="#D44B4B"
                        />
                      )}
                    </h3>
                    <p className="text-theme-secondary font-semibold text-xs transition-colors duration-300">
                      {`Threshold: ${transaction.approved.length} / ${threshold} approved`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start mt-0 space-x-2 mb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-[9px] h-[9px] rounded-full flex items-center justify-center
                    ${transactionStatus !== 'executed' ? 'border border-[#55534E]' : 'bg-white'}`}
                    ></div>
                  </div>
                  {transactionStatus === 'initiated' && (
                    <div className="flex-1 pt-0">
                      <h3 className="text-theme font-semibold -mt-1.5">
                        Execution
                      </h3>
                      <p className="text-theme-secondary font-semibold text-xs transition-colors duration-300">
                        ---------------------
                      </p>
                    </div>
                  )}
                  {transactionStatus === 'executed' &&
                    transaction.dateExecuted && (
                      <div className="flex-1 pt-0">
                        <h3 className="text-theme flex items-center gap-1 font-semibold -mt-1.5">
                          Executed
                          {transactionStatus === 'executed' && (
                            <BadgeCheck
                              className="w-5 h-5 text-secondary"
                              fill="#19B360"
                            />
                          )}
                        </h3>
                        <p className="text-theme-secondary font-semibold text-xs transition-colors duration-300">
                          {formatTimestamp(transaction.dateExecuted)}
                        </p>
                      </div>
                    )}
                  {transactionStatus === 'rejected' && (
                    <div className="flex-1 pt-0">
                      <h3 className="text-theme font-semibold -mt-1.5">
                        Rejected
                      </h3>
                      <p className="text-theme-secondary font-semibold text-xs transition-colors duration-300">
                        ---------------------
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <h4 className="text-xs text-theme-secondary font-semibold mr-2">
                Rejections: ({transaction.rejected.length})
              </h4>
            </div>

            {/* Action Buttons */}
            <TransactionActionButtons
              isConnected={isConnected || false}
              transactionStatus={transactionStatus}
              handleApprove={handleApprove}
              handleExecute={handleExecute}
              handleReject={handleReject}
              isApproving={isApproving}
              isExecuting={isExecuting}
              isRejecting={isRejecting}
              canExecute={canExecute}
            />
          </div>

          <div className="bg-[#55534E] w-0.5 my-2 mx-6"></div>

          {/* Right: Transaction Details */}
          <div className="lg:w-2/3 flex flex-col mt-1.5">
            <h3 className="text-theme font-medium mb-8 transition-colors duration-300">
              Transaction Details
            </h3>
            <div className="text-theme-secondary space-y-4 flex-grow transition-colors duration-300">
              <div className="flex justify-between">
                <span>Initiator:</span>
                <span className="text-theme flex items-center gap-2 truncate transition-colors duration-300">
                  <Image
                    src={getAvatarUrl(transaction.proposer)}
                    alt="avatar"
                    width={21}
                    height={21}
                  />
                  <span className="text-sm">
                    {transaction.proposer.slice(0, 8)}...
                    {transaction.proposer.slice(-4)}
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span>Date initiated:</span>
                <span className="text-theme truncate transition-colors duration-300">
                  {formatTimestamp(transaction.dateCreated)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Account:</span>
                <span className="text-theme flex items-center gap-2 truncate transition-colors duration-300">
                  <Image
                    src={backstageboys}
                    alt="backstageboys"
                    width={21}
                    height={21}
                  />
                  <span className="text-sm">
                    {accountName || 'Backstage Boys'}
                  </span>
                </span>
              </div>
              {transactionStatus === 'executed' &&
                transaction.transaction_id && (
                  <div className="flex justify-between">
                    <span>Transaction Link:</span>
                    <div className="text-theme flex items-center gap-0 truncate transition-colors duration-300">
                      {transaction.transaction_id}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="p-0"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            transaction.transaction_id ?? '',
                          )
                        }
                      >
                        <Copy className="w-4 h-4 text-theme-secondary" />
                      </Button>
                      <Link
                        href={`https://etherscan.io/tx/${transaction.transaction_id}`}
                        target="_blank"
                        className="text-sm"
                      >
                        <CircleArrowRight className="w-4 h-4 text-theme-secondary -rotate-45" />
                      </Link>
                    </div>
                  </div>
                )}
            </div>
            <Link
              href={routes(accountAddress).transactionDetails(
                transaction.id.toString(),
              )}
            >
              <Button className="mt-3 hover:bg-theme-bg-secondary bg-theme-bg-secondary text-theme text-sm px-4 sm:px-6 py-3.5 rounded-md transition duration-200 w-full disabled:opacity-50">
                See transaction details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
