'use client'
import React from 'react'
import Image from 'next/image'
import { CheckCircle, Copy } from 'lucide-react'
import { Transaction, Approval } from '@/app/dapp/transactions/data'

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
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300 ${
            status === 'completed'
              ? 'bg-green-500'
              : 'bg-theme-bg-tertiary border border-theme-border'
          }`}
        >
          {status === 'completed' && (
            <CheckCircle size={14} className="text-white" />
          )}
        </div>
        {!isLast && (
          <div className="w-px h-full border-l-2 border-dotted border-theme-border my-1"></div>
        )}
      </div>
      <div>
        <p
          className={`font-medium transition-colors duration-300 ${
            status === 'future' ? 'text-theme-muted' : 'text-theme'
          }`}
        >
          {title}
        </p>
        {timestamp && (
          <p className="text-theme-secondary text-sm transition-colors duration-300">
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
  approvals: Approval[]
  title: string
}) => {
  return (
    <div>
      <p className="text-theme font-medium mb-4 transition-colors duration-300">
        {title}
      </p>
      {approvals.length > 0 ? (
        <div className="space-y-3">
          {approvals.map((approval) => (
            <div
              key={approval.member.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={approval.member.avatar}
                  alt={approval.member.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-theme text-sm transition-colors duration-300">
                  {approval.member.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-theme-secondary text-sm transition-colors duration-300">
          ----------
        </p>
      )}
    </div>
  )
}

export const TransactionDetailsBody = ({
  transaction,
}: {
  transaction: Transaction
}) => {
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
    <div className="space-y-6">
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-theme-bg-secondary border border-theme-border p-6 rounded-lg space-y-4 transition-colors duration-300">
          {detailItem(
            'Initiator',
            <div className="flex items-center gap-2">
              <Image
                src={transaction.initiator.avatar}
                alt={transaction.initiator.name}
                width={20}
                height={20}
                className="rounded-full"
              />
              <p className="text-theme text-sm truncate transition-colors duration-300">
                {transaction.initiator.address || transaction.initiator.name}
              </p>
            </div>,
          )}
          {detailItem(
            'Date initiated',
            <p className="text-theme text-sm transition-colors duration-300">
              {transaction.dateInitiated}
            </p>,
          )}
          {isExecuted &&
            transaction.dateExecuted &&
            detailItem(
              'Date Executed',
              <p className="text-theme text-sm transition-colors duration-300">
                {transaction.dateExecuted}
              </p>,
            )}
          {detailItem(
            'Account',
            <div className="flex items-center gap-2">
              <Image
                src={transaction.account.avatar}
                alt={transaction.account.name}
                width={20}
                height={20}
                className="rounded-full"
              />
              <p className="text-theme text-sm transition-colors duration-300">
                {transaction.account.name}
              </p>
            </div>,
          )}
          {detailItem(
            'Transaction Link',
            <div className="flex items-center gap-2">
              <p className="text-theme text-sm truncate transition-colors duration-300">
                {transaction.transactionLink}
              </p>
              <button className="text-theme-secondary hover:text-theme transition-colors duration-200">
                <Copy size={16} />
              </button>
            </div>,
          )}
          {detailItem(
            'Transaction ID',
            <p className="text-theme text-sm truncate transition-colors duration-300">
              {transaction.transactionId}
            </p>,
          )}
        </div>

        <div className="bg-theme-bg-secondary border border-theme-border p-6 rounded-lg transition-colors duration-300">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src={transaction.account.avatar}
              alt={transaction.account.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="flex-1">
              <p className="text-theme font-semibold text-base transition-colors duration-300">
                {transaction.account.name}
              </p>
              <p className="text-theme-secondary text-sm transition-colors duration-300">
                {transaction.account.address}
              </p>
            </div>
            <span className="bg-theme-bg-tertiary border border-theme-border text-theme-secondary px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-300">
              Team Account
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-theme-bg-tertiary border border-theme-border p-3 rounded-md text-center transition-colors duration-300">
              <p className="text-theme-secondary text-sm mb-1">Threshold</p>
              <p className="text-theme font-semibold text-lg transition-colors duration-300">
                {transaction.threshold.required}/{transaction.approvals.length}
              </p>
            </div>
            <div className="bg-theme-bg-tertiary border border-theme-border p-3 rounded-md text-center transition-colors duration-300">
              <p className="text-theme-secondary text-sm mb-1">Members</p>
              <p className="text-theme font-semibold text-lg transition-colors duration-300">
                {transaction.approvals.length}
              </p>
            </div>
          </div>
          {transaction.dateExecuted &&
            detailItem(
              'Last transaction',
              <p className="text-theme text-sm transition-colors duration-300">
                {transaction.dateExecuted.split(' ')[0]}
              </p>,
            )}
        </div>

        <div className="bg-theme-bg-secondary border border-theme-border p-6 rounded-lg transition-colors duration-300">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src={transaction.to.avatar}
              alt={transaction.to.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="flex-1">
              <p className="text-theme font-semibold text-base transition-colors duration-300">
                {transaction.to.name}
              </p>
              <p className="text-theme-secondary text-sm transition-colors duration-300">
                {transaction.to.address}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {transaction.dateExecuted &&
              detailItem(
                'Last transaction',
                <p className="text-theme text-sm transition-colors duration-300">
                  {transaction.dateExecuted.split(' ')[0]}
                </p>,
              )}
            {detailItem(
              'Member Number',
              <p className="text-theme text-sm transition-colors duration-300">
                2
              </p>,
            )}
            {detailItem(
              'Email Address',
              <p className="text-theme text-sm transition-colors duration-300">
                denzieesmith@gmail.com
              </p>,
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-theme-bg-secondary border border-theme-border p-6 rounded-lg transition-colors duration-300">
          <h3 className="text-theme text-base font-medium mb-6 transition-colors duration-300">
            Updates/Transaction Progress
          </h3>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-theme-bg-tertiary border border-theme-border p-3 rounded-md text-center transition-colors duration-300">
              <p className="text-theme-secondary text-sm mb-2">Threshold</p>
              <p className="text-theme font-bold text-2xl transition-colors duration-300">
                {transaction.threshold.required}/{transaction.approvals.length}
              </p>
            </div>
            <div className="bg-theme-bg-tertiary border border-theme-border p-3 rounded-md text-center transition-colors duration-300">
              <p className="text-theme-secondary text-sm mb-2">Confirmed</p>
              <p className="text-theme font-bold text-2xl transition-colors duration-300">
                {transaction.approvals.length}
              </p>
            </div>
            <div className="bg-theme-bg-tertiary border border-theme-border p-3 rounded-md text-center transition-colors duration-300">
              <p className="text-theme-secondary text-sm mb-2">Rejections</p>
              <p className="text-theme font-bold text-2xl transition-colors duration-300">
                {transaction.rejections.length}
              </p>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="flex-shrink-0">
              <TimelineStep
                title="Initiated Transaction"
                timestamp={transaction.dateInitiated}
                status="completed"
              />
              <TimelineStep
                title="Pending"
                timestamp={`Threshold: ${transaction.approvals.length}/${transaction.threshold.required} approved`}
                status={isExecuted || isRejected ? 'completed' : 'pending'}
              />
              <TimelineStep
                title={isRejected ? 'Rejected' : 'Executed'}
                timestamp={transaction.dateExecuted}
                status={isExecuted || isRejected ? 'completed' : 'future'}
                isLast={true}
              />
            </div>
            <div className="flex-grow grid grid-cols-2 gap-8">
              <ApprovalList
                approvals={transaction.approvals}
                title="Confirmed Approvals"
              />
              <ApprovalList
                approvals={transaction.rejections}
                title="Rejections"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
