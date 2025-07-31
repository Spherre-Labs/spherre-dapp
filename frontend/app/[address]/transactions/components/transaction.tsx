import { ReactNode, useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import limit from '../../../../public/Images/limit.png'
import members from '../../../../public/Images/Members.png'
import backstageboys from '../../../../public/Images/backstageboys.png'
import avatar from '../../../../public/Images/avatar.png'
import swap from '../../../../public/Images/swap.png'
import withdraw from '../../../../public/Images/withdraw.png'
import strk from '../../../../public/Images/strk.png'
import member1 from '../../../../public/member1.svg'
import member2 from '../../../../public/member2.svg'
import member3 from '../../../../public/member3.svg'
import Link from 'next/link'
import { useTheme } from '@/app/context/theme-context-provider'
import { useSpherreAccount } from '@/app/context/account-context'
import {
  useApproveTransaction,
  useRejectTransaction,
  useExecuteTransaction,
} from '@/hooks/useSpherreHooks'
import {
  TransactionType,
  type TransactionDisplayInfo,
} from '@/lib/contracts/types'
import { formatTimestamp, formatTime } from '@/lib/utils/transaction-utils'
import { BadgeCheck, ChevronDown, CircleArrowRight, CircleX, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { routes } from '@/lib/utils/routes'

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
  const { writeAsync: approveAsync, isLoading: isApproving } =
    useApproveTransaction(accountAddress || '0x0')
  const { writeAsync: rejectAsync, isLoading: isRejecting } =
    useRejectTransaction(accountAddress || '0x0')
  const { writeAsync: executeAsync, isLoading: isExecuting } =
    useExecuteTransaction(accountAddress || '0x0')

  const { transaction } = transactionInfo

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
        return <Image src={members} width={20} height={20} alt="member action" />
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
      <button
        onClick={onToggle}
        className="w-full p-4 lg:p-6 flex items-center gap-[85px] bg-theme-bg-tertiary transition-colors duration-200"
      >

        {/* Icon + Title - takes more space */}
        <div className="flex items-center space-x-2 flex-[2] min-w-0">
          {getTypeIcon(transaction.transactionType)}
          <span className="font-sans text-theme font-medium truncate transition-colors duration-300">
            {transactionInfo.title}
          </span>
        </div>

        {/* Amount */}
        {transactionInfo.amount && (
          <div className="text-theme-secondary flex items-center transition-colors duration-300 flex-[2] min-w-0">
            <span className="text-sm text-theme-secondary mr-1">Amount:</span>
            <span className="inline-flex items-center">
              <Image
                src={strk}
                width={16}
                height={16}
                className="sm:w-5 sm:h-5"
                alt="token"
              />
              <span className='ml-1 text-theme font-semibold'>
                {`${transactionInfo.amount} ${transactionInfo.token}`}
              </span>
            </span>
          </div>
        )}

        {/* Initiator */}
        <div className="text-theme-secondary truncate transition-colors duration-300 flex-[2] min-w-0">
          {[TransactionType.MEMBER_ADD, TransactionType.MEMBER_REMOVE, TransactionType.MEMBER_PERMISSION_EDIT].includes(transaction.transactionType) ? null :
            <span className="text-sm text-theme-secondary mr-1">Initiator:</span>
          }
          <span className="text-theme font-medium">{transactionInfo.transaction.proposer.slice(0, 6)}...{transactionInfo.transaction.proposer.slice(-4)}</span>
        </div>

        {/* Time */}
        <div className="text-theme-secondary  transition-colors duration-300 flex-1 text-center lowercase">
          {formatTime(transaction.dateCreated)}
        </div>

        {/* Status */}
        <div className="flex-1 text-center">
          <span
            className={` px-3 py-1 rounded-full ${transaction.status === 'Pending'
              ? 'text-light-yellow'
              : transaction.status === 'Executed'
                ? 'text-green'
                : 'text-[#D44B4B]'
              }`}
          >
            {transaction.status}
          </span>
        </div>

        {/* Dropdown Arrow */}
        <div className="flex-shrink-0 ml-auto">
          <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-theme-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
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

            <div className='grid grid-cols-2 gap-2'>

              {/* Approvals */}
              <div className="flex items-center mb-2">
                <h4 className="text-xs text-light-yellow font-semibold mr-2 transition-colors duration-300">
                  Pending Approvals
                </h4>
                <div className='flex items-center gap-0'>
                  <Image src={member1} alt="member1" width={21} height={21} className='rounded-full' />
                  <Image src={member3} alt="member3" width={21} height={21} className='rounded-full -ml-1' />
                </div>
                <div className="border border-ash w-5 h-5 text-[11px] py-[2px] px-[3px] font-bold text-theme-text-secondary flex items-center justify-center rounded-full ml-2 transition-colors duration-300">
                  +2
                </div>
              </div>
              <div className="flex justify-start gap-2 items-center mb-2">
                <h4 className="text-xs text-green font-semibold mr-2 transition-colors duration-300">
                  Confirmed Approvals
                </h4>
                <Image src={member2} alt="member2" width={21} height={21} className='rounded-full' />
              </div>

              {/* Txn Timeline */}
              <div className="flex-grow font-sans">
                <div className="flex items-start mt-2 space-x-2 mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-[9px] h-[9px] bg-white rounded-full flex items-center justify-center">
                    </div>
                    <div className="w-[1px] h-12 bg-white mt-0"></div>
                  </div>
                  <div className="flex-1 pt-0">
                    <h3 className="text-theme flex items-center gap-1 font-semibold -mt-1.5">
                      Initiated Transaction
                      <BadgeCheck className="w-5 h-5 text-secondary" fill='#19B360' />
                    </h3>
                    <p className="text-theme-secondary font-semibold text-xs transition-colors duration-300">
                      {formatTimestamp(transaction.dateCreated)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start mt-0 space-x-2 mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-[9px] h-[9px] bg-white rounded-full flex items-center justify-center">
                    </div>
                    <div className={`w-[1px] h-12 mt-0 ${transaction.status === 'Pending' ? 'bg-[#55534E]' : 'bg-white'}`}></div>
                  </div>
                  <div className="flex-1 pt-0">
                    <h3 className="text-theme flex items-center gap-1 font-semibold -mt-1.5">
                      Pending
                      {transaction.status === 'Executed' && (
                        <BadgeCheck className="w-5 h-5 text-secondary" fill='#19B360' />
                      )}
                      {transaction.status === 'Rejected' && (
                        <CircleX className="w-5 h-5 text-secondary" fill='#D44B4B' />
                      )}
                    </h3>
                    <p className="text-theme-secondary font-semibold text-xs transition-colors duration-300">
                      {`Threshold: ${transaction.approved.length} / ${Math.min(5, transaction.approved.length * 5)} approved`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start mt-0 space-x-2 mb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-[9px] h-[9px] rounded-full flex items-center justify-center
                    ${transaction.status !== 'Executed' ? 'border border-[#55534E]' : 'bg-white'}
                    `}>
                    </div>
                  </div>
                  {transaction.status === 'Pending' && (
                    < div className="flex-1 pt-0">
                      <h3 className="text-theme font-semibold -mt-1.5">
                        Execution
                      </h3>
                      <p className="text-theme-secondary font-semibold text-xs transition-colors duration-300">
                        ---------------------
                      </p>
                    </div>
                  )}
                  {transaction.status === 'Executed' && transaction.dateExecuted && (
                    <div className="flex-1 pt-0">
                      <h3 className="text-theme flex items-center gap-1 font-semibold -mt-1.5">
                        Executed
                        {transaction.status === 'Executed' && (
                          <BadgeCheck className="w-5 h-5 text-secondary" fill='#19B360' />
                        )}
                      </h3>
                      <p className="text-theme-secondary font-semibold text-xs transition-colors duration-300">
                        {formatTimestamp(transaction.dateExecuted)}
                      </p>
                    </div>
                  )}
                  {transaction.status === 'Rejected' && (
                    < div className="flex-1 pt-0">
                      <h3 className="text-theme font-semibold -mt-1.5">Rejected</h3>
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
            <div className="mt-auto pt-3 sm:pt-4">
              {transaction.status === 'Pending' && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className=" text-theme px-4 sm:px-6 py-3.5 rounded-md transition duration-200 w-full"
                  >
                    {isApproving ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    onClick={handleExecute}
                    disabled={isExecuting}
                    className="bg-theme-bg-secondary hover:bg-theme-bg-secondary text-theme px-4 sm:px-6 py-3.5 rounded-md transition duration-200 w-full disabled:opacity-50"
                  >
                    {isExecuting ? 'Executing...' : 'Execute'}
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={isRejecting}
                    className="bg-red-500 hover:bg-red-500 text-theme px-4 sm:px-6 py-3.5 rounded-md transition duration-200 w-full disabled:opacity-50"
                  >
                    {isRejecting ? 'Rejecting...' : 'Reject'}
                  </Button>
                </div>
              )}
              {(transaction.status === 'Executed' ||
                transaction.status === 'Rejected') && (
                  <button className="bg-[#6F2FCE] hover:bg-purple-700 text-theme px-4 sm:px-6 py-2 rounded-md transition duration-200 w-full">
                    Download CSV
                  </button>
                )}
            </div>
          </div>

          <div className='bg-[#55534E] w-0.5 my-2 mx-6'></div>

          {/* Right: Transaction Details */}
          <div className="lg:w-2/3 flex flex-col mt-1.5">
            <h3 className="text-theme font-medium mb-8 transition-colors duration-300">
              Transaction Details
            </h3>
            <div className="text-theme-secondary space-y-4 flex-grow transition-colors duration-300">
              <div className="flex justify-between">
                <span>Initiator:</span>
                <span className="text-theme flex items-center gap-2 truncate transition-colors duration-300">
                  <Image src={avatar} alt="avatar" width={21} height={21} />
                  <span className="text-sm">{transaction.proposer.slice(0, 8)}...{transaction.proposer.slice(-4)}</span>
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
                  <Image src={backstageboys} alt="backstageboys" width={21} height={21} />
                  <span className="text-sm">Backstage Boys</span>
                </span>
              </div>
              {transaction.status !== 'Pending' && transaction.transaction_id && (
                <div className="flex justify-between">
                  <span>Transaction Link:</span>
                  <div className="text-theme flex items-center gap-0 truncate transition-colors duration-300">
                    {transaction.transaction_id}
                    <Button variant="ghost" size="icon" className="p-0" onClick={() => navigator.clipboard.writeText(transaction.transaction_id ?? "")}>
                      <Copy className="w-4 h-4 text-theme-secondary" />
                    </Button>
                    <Link href={`https://etherscan.io/tx/${transaction.transaction_id}`} target="_blank" className="text-sm">
                      <CircleArrowRight className="w-4 h-4 text-theme-secondary -rotate-45" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link
              href={routes(accountAddress).transactionDetails(
                transaction.id.toString(),
              )}>
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
