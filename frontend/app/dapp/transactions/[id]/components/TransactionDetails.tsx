'use client'
import React from 'react'
import Image from 'next/image'
import { useTheme } from '@/app/context/theme-context-provider'
import { type TransactionDisplayInfo } from '@/lib/contracts/types'
import { formatTimestamp, formatTime } from '@/lib/utils/transaction-utils'

import reviewers1 from '../../../../../public/Images/reviewers1.png'
import reviewers2 from '../../../../../public/Images/reviewers2.png'
import reviewers3 from '../../../../../public/Images/reviewers3.png'
import member1 from '../../../../../public/member1.svg'
import member2 from '../../../../../public/member2.svg'
import member3 from '../../../../../public/member3.svg'
import member4 from '../../../../../public/member4.svg'
import member5 from '../../../../../public/member5.svg'

const memberAvatars = [
  reviewers1,
  reviewers2,
  reviewers3,
  member1,
  member2,
  member3,
  member4,
  member5,
]

export const TransactionDetails = ({
  transactionInfo,
}: {
  transactionInfo: TransactionDisplayInfo
}) => {
  useTheme()
  const { transaction } = transactionInfo

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Transaction Details */}
        <div className="bg-theme-bg-secondary border border-theme-border p-6 rounded-lg">
          <h3 className="text-theme font-medium mb-4">Transaction Details</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-theme text-sm font-mono">
                {transaction.proposer.slice(0, 8)}...
                {transaction.proposer.slice(-6)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-theme-secondary text-sm">
                Date initiated:
              </span>
              <span className="text-theme text-sm">
                {formatTimestamp(transaction.dateCreated)}{' '}
                {formatTime(transaction.dateCreated)}
              </span>
            </div>

            {transaction.dateExecuted && (
              <div className="flex justify-between">
                <span className="text-theme-secondary text-sm">
                  Date Executed:
                </span>
                <span className="text-theme text-sm">
                  {formatTimestamp(transaction.dateExecuted)}{' '}
                  {formatTime(transaction.dateExecuted)}
                </span>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-theme text-sm">Backstage Boys</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-theme-secondary text-sm">
                Transaction Link:
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-theme text-sm font-mono">
                  {transaction.id.toString().slice(0, 8)}...
                  {transaction.id.toString().slice(-6)}
                </span>
                <svg
                  className="w-4 h-4 text-theme-secondary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                </svg>
                <svg
                  className="w-4 h-4 text-theme-secondary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-theme-secondary text-sm">
                Transaction ID:
              </span>
              <span className="text-theme text-sm font-mono">
                {transaction.id.toString().slice(0, 12)}...
              </span>
            </div>
          </div>
        </div>

        {/* From */}
        <div className="bg-theme-bg-secondary border border-theme-border p-6 rounded-lg">
          <h3 className="text-theme font-medium mb-4">From</h3>
          <div className="space-y-4">
            <div className="bg-theme-bg-tertiary border border-theme-border p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-theme font-medium">Backstage Boys</span>
                </div>
                <span className="text-theme-secondary text-xs bg-theme-bg-secondary px-2 py-1 rounded">
                  Team Account
                </span>
              </div>
              <p className="text-theme-secondary text-sm">0x233r...6574</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-theme-bg-tertiary border border-theme-border p-3 rounded-lg">
                <p className="text-theme-secondary text-xs">Threshold</p>
                <p className="text-theme font-medium">3/5</p>
              </div>
              <div className="bg-theme-bg-tertiary border border-theme-border p-3 rounded-lg">
                <p className="text-theme-secondary text-xs">Members</p>
                <p className="text-theme font-medium">5</p>
              </div>
            </div>

            <p className="text-theme-secondary text-sm">
              Last transaction {formatTimestamp(transaction.dateCreated)}
            </p>
          </div>
        </div>

        {/* To */}
        <div className="bg-theme-bg-secondary border border-theme-border p-6 rounded-lg">
          <h3 className="text-theme font-medium mb-4">To</h3>
          <div className="space-y-4">
            <div className="bg-theme-bg-tertiary border border-theme-border p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-theme font-medium">Denzel Smith</span>
              </div>
              <p className="text-theme-secondary text-sm">0x233r...6574</p>
            </div>

            <p className="text-theme-secondary text-sm">
              Last transaction {formatTimestamp(transaction.dateCreated)}
            </p>
            <p className="text-theme-secondary text-sm">Member Number 2</p>
            <p className="text-theme-secondary text-sm">
              Email Address denzieesmith@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* Updates/Transaction Progress */}
      <div className="bg-theme-bg-secondary border border-theme-border p-6 rounded-lg">
        <h3 className="text-theme font-medium mb-6">
          Updates/Transaction Progress
        </h3>

        {/* Summary Boxes */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-theme-bg-tertiary border border-theme-border p-4 rounded-lg text-center">
            <p className="text-theme-secondary text-sm">Threshold</p>
            <p className="text-theme font-bold text-lg">3/5</p>
          </div>
          <div className="bg-theme-bg-tertiary border border-theme-border p-4 rounded-lg text-center">
            <p className="text-theme-secondary text-sm">Confirmed</p>
            <p className="text-theme font-bold text-lg">
              {transaction.approved.length}
            </p>
          </div>
          <div className="bg-theme-bg-tertiary border border-theme-border p-4 rounded-lg text-center">
            <p className="text-theme-secondary text-sm">Rejections</p>
            <p className="text-theme font-bold text-lg">
              {transaction.rejected.length}
            </p>
          </div>
        </div>

        {/* Progress Timeline and Approvals - Side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Timeline */}
          <div>
            <h4 className="text-theme font-medium mb-4">Progress Timeline</h4>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-2 h-2 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="w-0.5 h-8 bg-theme-border mt-1"></div>
                </div>
                <div>
                  <p className="text-theme font-medium">
                    Initiated Transaction
                  </p>
                  <p className="text-theme-secondary text-sm">
                    {formatTimestamp(transaction.dateCreated)}{' '}
                    {formatTime(transaction.dateCreated)}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-2 h-2 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="w-0.5 h-8 bg-theme-border mt-1"></div>
                </div>
                <div>
                  <p className="text-theme font-medium">Pending</p>
                  <p className="text-theme-secondary text-sm">
                    Threshold: {transaction.approved.length}/5 approved
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-2 h-2 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-theme font-medium">Executed</p>
                  <p className="text-theme-secondary text-sm">
                    {transaction.dateExecuted
                      ? `${formatTimestamp(transaction.dateExecuted)} ${formatTime(transaction.dateExecuted)}`
                      : 'Pending execution'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmed Approvals and Rejections */}
          <div>
            <h4 className="text-theme font-medium mb-4">Confirmed Approvals</h4>
            <div className="space-y-3 mb-6">
              {['Denzel Smith', 'Hichens', 'Jives', 'Kerkeze', 'Haley'].map(
                (name, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={memberAvatars[index % memberAvatars.length]}
                        width={32}
                        height={32}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-theme text-sm">{name}</span>
                    <svg
                      className="w-4 h-4 text-green-500 ml-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ),
              )}
            </div>

            <h4 className="text-theme font-medium mb-4">Rejections</h4>
            <div className="border-2 border-dashed border-theme-border rounded-lg p-4 text-center">
              <p className="text-theme-secondary text-sm">No rejections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
