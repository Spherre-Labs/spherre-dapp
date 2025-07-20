import { ReactNode, useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Reviewer1 from '../../../../public/Images/reviewers1.png'
import Reviewer2 from '../../../../public/Images/reviewers2.png'
import Reviewer3 from '../../../../public/Images/reviewers3.png'
import limit from '../../../../public/Images/limit.png'
import swap from '../../../../public/Images/swap.png'
import withdraw from '../../../../public/Images/withdraw.png'
import strk from '../../../../public/Images/strk.png'
import Link from 'next/link'
import { Transaction as TransactionType } from '../data'
import { useTheme } from '@/app/context/theme-context-provider'

interface TransactionProps {
  transaction: TransactionType
  isExpanded: boolean
  onToggle: () => void
}

export default function Transaction({
  transaction,
  isExpanded,
  onToggle,
}: TransactionProps) {
  useTheme() // Just call useTheme to ensure theme context is active

  // Define type-specific elements
  const typeIcons: Record<string, ReactNode> = {
    withdraw: <Image src={withdraw} width={20} height={20} alt="withdraw" />,
    swap: <Image src={swap} width={20} height={20} alt="swap" />,
    limitSwap: <Image src={limit} width={20} height={20} alt="limit swap" />,
  }

  const typeLabels: Record<string, string> = {
    withdraw: 'Withdraw',
    swap: 'Swap',
    limitSwap: 'Limit Swap',
  }

  // Add refs for smooth height animation
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | undefined>(0)

  useEffect(() => {
    if (contentRef.current) {
      // Set the max height to the actual scrollHeight of the content
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
            {typeIcons[transaction.type]}
            <span className="text-theme font-medium text-sm sm:text-base truncate transition-colors duration-300">
              {typeLabels[transaction.type]}
            </span>
          </div>

          <div className="text-theme-secondary flex items-center text-sm sm:text-base transition-colors duration-300">
            Amount:
            <span className="inline-flex items-center ml-1">
              <Image
                src={strk}
                width={16}
                height={16}
                className="sm:w-5 sm:h-5"
                alt="strk"
              />
              <span className="truncate">{transaction.amount}</span>
            </span>
          </div>

          <div className="text-theme-secondary truncate text-sm sm:text-base transition-colors duration-300">
            To: {transaction.toAddress}
          </div>

          <div className="text-theme-secondary truncate text-sm sm:text-base transition-colors duration-300">
            Initiated: {transaction.initiator.name}
          </div>

          <div className="flex items-center justify-end space-x-2 sm:space-x-4">
            <span className="text-theme-secondary text-xs sm:text-sm transition-colors duration-300">
              {transaction.time}
            </span>
            <span
              className={`text-xs sm:text-sm ${
                transaction.status === 'Pending'
                  ? 'text-yellow-400'
                  : transaction.status === 'Executed'
                    ? 'text-green-400'
                    : 'text-red-500'
              }`}
            >
              {transaction.status}
            </span>
            <svg
              className={`w-4 h-4 sm:w-5 sm:h-5 text-theme-secondary transform transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
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
                <Image
                  src={Reviewer1}
                  width={24}
                  height={16}
                  className="sm:w-[30px] sm:h-[30px]"
                  alt="reviewer"
                />
                <Image
                  src={Reviewer2}
                  width={24}
                  height={16}
                  className="ml-[-8px] sm:ml-[-10px] sm:w-[30px] sm:h-[30px]"
                  alt="reviewer"
                />
                <div className="border-2 border-theme-border text-theme-secondary text-xs px-2 py-1 sm:px-2.5 sm:py-2 rounded-full ml-2 transition-colors duration-300">
                  +2
                </div>
              </div>
              <div className="flex items-center mb-2">
                <h4 className="text-[#19B360] font-medium mr-2 text-xs sm:text-sm">
                  Confirmed Approvals
                </h4>
                <Image
                  src={Reviewer3}
                  width={24}
                  height={16}
                  className="sm:w-[30px] sm:h-[30px]"
                  alt="reviewer"
                />
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
                      {transaction.dateInitiated}
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
                      Pending
                    </p>
                    <div className="flex items-center text-theme-secondary text-xs sm:text-sm transition-colors duration-300">
                      <p>Threshold: 1/5 approved</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex mb-2 mt-2">
                <div className="flex">
                  <div className="flex flex-col items-center mr-3 sm:mr-4">
                    <div
                      className={`w-2 h-2 border border-theme-border ${
                        transaction.status === 'Executed' ? 'bg-theme' : ''
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
                      className={`text-sm sm:text-base transition-colors duration-300 ${
                        transaction.status === 'Executed'
                          ? 'text-theme'
                          : 'text-theme-secondary'
                      }`}
                    >
                      Executed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto pt-3 sm:pt-4">
              {transaction.status === 'Pending' && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button className="bg-[#6F2FCE] hover:bg-purple-700 text-white px-4 sm:px-6 py-2 rounded-md transition duration-200 text-sm sm:text-base w-full sm:w-1/2">
                    Approve
                  </button>
                  <button className="bg-theme-bg-tertiary hover:bg-theme-border text-theme px-4 sm:px-6 py-2 rounded-md transition duration-200 text-sm sm:text-base w-full sm:w-1/2 border border-theme-border">
                    Reject
                  </button>
                </div>
              )}
              {(transaction.status === 'Executed' ||
                transaction.status === 'Rejected') && (
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
                <span>Account:</span>
                <span className="text-theme truncate transition-colors duration-300">
                  {transaction.account.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Initiator:</span>
                <span className="text-theme truncate transition-colors duration-300">
                  {transaction.initiator.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Date initiated:</span>
                <span className="text-theme truncate transition-colors duration-300">
                  {transaction.dateInitiated}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="text-theme truncate transition-colors duration-300">
                  {transaction.transactionId}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Transaction Link:</span>
                <span className="text-theme truncate transition-colors duration-300">
                  {transaction.transactionLink}
                </span>
              </div>
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
