'use client'
import React from 'react'
import Image from 'next/image'
import { CheckCircle, Copy, XCircle } from 'lucide-react'
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
}) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center ${
          status === 'completed' ? 'bg-green-500' : 'bg-gray-700'
        }`}
      >
        {status === 'completed' && (
          <CheckCircle size={14} className="text-white" />
        )}
      </div>
      {!isLast && (
        <div className="w-px h-full border-l-2 border-dotted border-gray-600 my-1"></div>
      )}
    </div>
    <div>
      <p
        className={`font-medium ${
          status === 'future' ? 'text-gray-500' : 'text-white'
        }`}
      >
        {title}
      </p>
      {timestamp && <p className="text-[#8B8B92] text-sm">{timestamp}</p>}
    </div>
  </div>
)

const ApprovalList = ({
  approvals,
  title,
}: {
  approvals: Approval[]
  title: string
}) => (
  <div>
    <p className="text-white font-medium mb-4">{title}</p>
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
              <span className="text-white text-sm">{approval.member.name}</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-[#8B8B92] text-sm">----------</p>
    )}
  </div>
)

export const TransactionDetailsBody = ({
  transaction,
}: {
  transaction: Transaction
}) => {
  const isExecuted = transaction.status === 'Executed'
  const isPending = transaction.status === 'Pending'
  const isRejected = transaction.status === 'Rejected'

  const detailItem = (label: string, value: React.ReactNode) => (
    <div className="flex justify-between items-center">
      <p className="text-[#8B8B92] text-sm">{label}</p>
      {value}
    </div>
  )

  return (
    <div className="space-y-6">
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#1a1b1f] border border-[#2a2b31] p-6 rounded-lg space-y-4">
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
              <p className="text-white text-sm truncate">
                {transaction.initiator.address || transaction.initiator.name}
              </p>
            </div>,
          )}
          {detailItem(
            'Date initiated',
            <p className="text-white text-sm">{transaction.dateInitiated}</p>,
          )}
          {isExecuted &&
            transaction.dateExecuted &&
            detailItem(
              'Date Executed',
              <p className="text-white text-sm">{transaction.dateExecuted}</p>,
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
              <p className="text-white text-sm">{transaction.account.name}</p>
            </div>,
          )}
          {detailItem(
            'Transaction Link',
            <div className="flex items-center gap-2">
              <p className="text-white text-sm truncate">
                {transaction.transactionLink}
              </p>
              <button className="text-[#8B8B92] hover:text-white">
                <Copy size={16} />
              </button>
            </div>,
          )}
          {detailItem(
            'Transaction ID',
            <p className="text-white text-sm truncate">
              {transaction.transactionId}
            </p>,
          )}
        </div>

        <div className="bg-[#1a1b1f] border border-[#2a2b31] p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src={transaction.account.avatar}
              alt={transaction.account.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="flex-1">
              <p className="text-white font-semibold text-base">
                {transaction.account.name}
              </p>
              <p className="text-[#8B8B92] text-sm">
                {transaction.account.address}
              </p>
            </div>
            <span className="bg-[#2a2b31] text-[#8B8B92] px-3 py-1.5 text-xs font-medium rounded-md">
              Team Account
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#272729] p-3 rounded-md text-center">
              <p className="text-[#8B8B92] text-sm mb-1">Threshold</p>
              <p className="text-white font-semibold text-lg">
                {transaction.threshold.required}/{transaction.approvals.length}
              </p>
            </div>
            <div className="bg-[#272729] p-3 rounded-md text-center">
              <p className="text-[#8B8B92] text-sm mb-1">Members</p>
              <p className="text-white font-semibold text-lg">
                {transaction.approvals.length}
              </p>
            </div>
          </div>
          {transaction.dateExecuted &&
            detailItem(
              'Last transaction',
              <p className="text-white text-sm">
                {transaction.dateExecuted.split(' ')[0]}
              </p>,
            )}
        </div>

        <div className="bg-[#1a1b1f] border border-[#2a2b31] p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src={transaction.to.avatar}
              alt={transaction.to.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="flex-1">
              <p className="text-white font-semibold text-base">
                {transaction.to.name}
              </p>
              <p className="text-[#8B8B92] text-sm">{transaction.to.address}</p>
            </div>
          </div>
          <div className="space-y-4">
            {transaction.dateExecuted &&
              detailItem(
                'Last transaction',
                <p className="text-white text-sm">
                  {transaction.dateExecuted.split(' ')[0]}
                </p>,
              )}
            {detailItem(
              'Member Number',
              <p className="text-white text-sm">2</p>,
            )}
            {detailItem(
              'Email Address',
              <p className="text-white text-sm">denzieesmith@gmail.com</p>,
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1a1b1f] border border-[#2a2b31] p-6 rounded-lg">
          <h3 className="text-white text-base font-medium mb-6">
            Updates/Transaction Progress
          </h3>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-[#272729] p-3 rounded-md text-center">
              <p className="text-[#8B8B92] text-sm mb-2">Threshold</p>
              <p className="text-white font-bold text-2xl">
                {transaction.threshold.required}/{transaction.approvals.length}
              </p>
            </div>
            <div className="bg-[#272729] p-3 rounded-md text-center">
              <p className="text-[#8B8B92] text-sm mb-2">Confirmed</p>
              <p className="text-white font-bold text-2xl">
                {transaction.approvals.length}
              </p>
            </div>
            <div className="bg-[#272729] p-3 rounded-md text-center">
              <p className="text-[#8B8B92] text-sm mb-2">Rejections</p>
              <p className="text-white font-bold text-2xl">
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
