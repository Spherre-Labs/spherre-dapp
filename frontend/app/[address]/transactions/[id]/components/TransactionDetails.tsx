'use client'
import React from 'react'
import { useTheme } from '@/app/context/theme-context-provider'
import { type TransactionDisplayInfo } from '@/lib/contracts/types'
import { formatTimestamp, formatTime } from '@/lib/utils/transaction-utils'

const TimelineStep = ({
  title,
  timestamp,
  status,
  isLast = false,
}: {
  title: string
  timestamp?: string
  status: 'completed' | 'pending' | 'future'
  isLast?: boolean
}) => {
  return (
    <div className="flex items-start mb-4">
      <div className="flex flex-col items-center mr-4">
        <div
          className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${status === 'completed'
            ? 'bg-green-500 border-green-500'
            : status === 'pending'
              ? 'bg-yellow-500 border-yellow-500'
              : 'bg-gray-300 border-gray-300'
            }`}
        />
        {!isLast && (
          <div className="w-0.5 h-8 bg-theme-border mt-1 transition-colors duration-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium transition-colors duration-300 ${status === 'completed' ? 'text-theme' : 'text-theme-secondary'
            }`}
        >
          {title}
        </p>
        {timestamp && (
          <p className="text-xs text-theme-secondary mt-1 transition-colors duration-300">
            {timestamp}
          </p>
        )}
      </div>
    </div>
  )
}

const ApprovalList = ({
  approvals,
  title,
}: {
  approvals: Array<{
    member: { name: string; avatar: string }
    status: 'Confirmed' | 'Rejected' | 'Pending'
  }>
  title: string
}) => {
  return (
    <div>
      <h4 className="text-theme-secondary text-sm font-medium mb-2 transition-colors duration-300">
        {title}
      </h4>
      <div className="space-y-2">
        {approvals.map((approval, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-6 h-6 bg-theme-border rounded-full flex items-center justify-center">
              <span className="text-xs text-theme-secondary">
                {approval.member.name.charAt(0)}
              </span>
            </div>
            <span className="text-theme text-sm transition-colors duration-300">
              {approval.member.name}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full transition-colors duration-300 ${approval.status === 'Confirmed'
                ? 'text-green-400 bg-green-400/10'
                : approval.status === 'Rejected'
                  ? 'text-red-400 bg-red-400/10'
                  : 'text-yellow-400 bg-yellow-400/10'
                }`}
            >
              {approval.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const TransactionDetails = ({
  transactionInfo,
}: {
  transactionInfo: TransactionDisplayInfo
}) => {
  useTheme()
  const { transaction } = transactionInfo
  const isExecuted = transaction.status === 'Executed'
  const isRejected = transaction.status === 'Rejected'

  const detailItem = (label: string, value: React.ReactNode) => (
    <div className="flex justify-between items-center">
      <p className="text-theme-secondary text-sm transition-colors duration-300">
        {label}
      </p>
      {value}
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Transaction Details */}
      <section className="bg-theme-bg-tertiary border border-theme-border p-4 rounded-lg transition-colors duration-300">
        <h3 className="text-theme font-medium mb-4 transition-colors duration-300">
          Transaction Details
        </h3>
        <div className="space-y-3">
          {detailItem(
            'Transaction ID',
            <span className="text-theme text-sm font-mono transition-colors duration-300">
              {transaction.id.toString().slice(0, 20)}...
            </span>
          )}
          {detailItem(
            'Type',
            <span className="text-theme text-sm transition-colors duration-300">
              {transactionInfo.title}
            </span>
          )}
          {detailItem(
            'Proposer',
            <span className="text-theme text-sm font-mono transition-colors duration-300">
              {transaction.proposer.slice(0, 10)}...{transaction.proposer.slice(-6)}
            </span>
          )}
          {detailItem(
            'Date Created',
            <span className="text-theme text-sm transition-colors duration-300">
              {formatTimestamp(transaction.dateCreated)} {formatTime(transaction.dateCreated)}
            </span>
          )}
          {transaction.dateExecuted && detailItem(
            'Date Executed',
            <span className="text-theme text-sm transition-colors duration-300">
              {formatTimestamp(transaction.dateExecuted)} {formatTime(transaction.dateExecuted)}
            </span>
          )}
          {transaction.executor && detailItem(
            'Executor',
            <span className="text-theme text-sm font-mono transition-colors duration-300">
              {transaction.executor.slice(0, 10)}...{transaction.executor.slice(-6)}
            </span>
          )}
          {transactionInfo.amount && detailItem(
            'Amount',
            <span className="text-theme text-sm transition-colors duration-300">
              {transactionInfo.amount}
            </span>
          )}
          {transactionInfo.recipient && detailItem(
            'Recipient',
            <span className="text-theme text-sm font-mono transition-colors duration-300">
              {transactionInfo.recipient}
            </span>
          )}
          {transactionInfo.token && detailItem(
            'Token',
            <span className="text-theme text-sm font-mono transition-colors duration-300">
              {transactionInfo.token}
            </span>
          )}
        </div>
      </section>

      {/* Approval Status */}
      <section className="bg-theme-bg-tertiary border border-theme-border p-4 rounded-lg transition-colors duration-300">
        <h3 className="text-theme font-medium mb-4 transition-colors duration-300">
          Approval Status
        </h3>
        <div className="space-y-4">
          {/* Progress Timeline */}
          <div className="flex gap-8">
            <div className="flex-shrink-0">
              <TimelineStep
                title="Initiated Transaction"
                timestamp={`${formatTimestamp(transaction.dateCreated)} ${formatTime(transaction.dateCreated)}`}
                status="completed"
              />
              <TimelineStep
                title="Approval Status"
                timestamp={`Approved: ${transaction.approved.length} | Rejected: ${transaction.rejected.length}`}
                status={isExecuted || isRejected ? 'completed' : 'pending'}
              />
              <TimelineStep
                title={isRejected ? 'Rejected' : 'Executed'}
                timestamp={transaction.dateExecuted ?
                  `${formatTimestamp(transaction.dateExecuted)} ${formatTime(transaction.dateExecuted)}` :
                  undefined
                }
                status={isExecuted || isRejected ? 'completed' : 'future'}
                isLast={true}
              />
            </div>
            <div className="flex-grow grid grid-cols-1 gap-4">
              {transaction.approved.length > 0 && (
                <ApprovalList
                  approvals={transaction.approved.map(addr => ({
                    member: { name: `${addr.slice(0, 8)}...`, avatar: '/placeholder.svg' },
                    status: 'Confirmed' as const
                  }))}
                  title="Confirmed Approvals"
                />
              )}
              {transaction.rejected.length > 0 && (
                <ApprovalList
                  approvals={transaction.rejected.map(addr => ({
                    member: { name: `${addr.slice(0, 8)}...`, avatar: '/placeholder.svg' },
                    status: 'Rejected' as const
                  }))}
                  title="Rejections"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}