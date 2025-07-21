'use client'
import React from 'react'
import Image from 'next/image'
import { useTheme } from '@/app/context/theme-context-provider'
import { type TransactionDisplayInfo } from '@/lib/contracts/types'
import { TransactionType } from '@/lib/contracts/types'
import withdrawIcon from '../../../../../public/Images/withdraw.png'
import swapIcon from '../../../../../public/Images/swap.png'
import limitIcon from '../../../../../public/Images/limit.png'
import strk from '../../../../../public/Images/strk.png'

export const TransactionSummary = ({
  transactionInfo,
}: {
  transactionInfo: TransactionDisplayInfo
}) => {
  useTheme()

  // Define type-specific elements
  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.TOKEN_SEND:
        return (
          <Image
            src={withdrawIcon}
            width={20}
            height={20}
            alt="withdraw icon"
          />
        )
      case TransactionType.NFT_SEND:
        return <Image src={swapIcon} width={20} height={20} alt="swap icon" />
      case TransactionType.MEMBER_ADD:
      case TransactionType.MEMBER_REMOVE:
      case TransactionType.MEMBER_PERMISSION_EDIT:
        return (
          <Image src={limitIcon} width={20} height={20} alt="member action" />
        )
      case TransactionType.THRESHOLD_CHANGE:
        return (
          <Image
            src={limitIcon}
            width={20}
            height={20}
            alt="threshold change"
          />
        )
      case TransactionType.SMART_TOKEN_LOCK:
        return <Image src={swapIcon} width={20} height={20} alt="smart lock" />
      default:
        return (
          <Image src={withdrawIcon} width={20} height={20} alt="transaction" />
        )
    }
  }

  return (
    <section className="mb-6">
      <h2 className="text-lg font-medium text-theme mb-4 transition-colors duration-300">
        Transaction Summary
      </h2>
      <div className="bg-theme-bg-secondary border border-theme-border p-6 rounded-lg transition-colors duration-300">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-theme-bg-tertiary rounded-full flex items-center justify-center mr-4 border border-theme-border">
            {getTypeIcon(transactionInfo.transaction.transactionType)}
          </div>
          <div className="flex-1">
            <h3 className="text-theme font-medium text-lg transition-colors duration-300">
              {transactionInfo.title}
            </h3>
            <p className="text-theme-secondary text-sm transition-colors duration-300">
              {transactionInfo.subtitle}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-1">
              {transactionInfo.amount && (
                <div className="flex items-center">
                  <Image
                    src={strk}
                    width={16}
                    height={16}
                    alt="token"
                    className="mr-1"
                  />
                  <span className="text-theme font-medium">
                    {transactionInfo.amount}
                  </span>
                </div>
              )}
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                transactionInfo.transaction.status === 'Pending'
                  ? 'text-yellow-400 bg-yellow-400/10'
                  : transactionInfo.transaction.status === 'Executed'
                    ? 'text-green-400 bg-green-400/10'
                    : 'text-red-500 bg-red-500/10'
              }`}
            >
              {transactionInfo.transaction.status}
            </span>
          </div>
        </div>

        {/* Additional details based on transaction type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {transactionInfo.recipient && (
            <div className="flex justify-between">
              <span className="text-theme-secondary">Recipient:</span>
              <span className="text-theme font-medium">
                {transactionInfo.recipient}
              </span>
            </div>
          )}

          {transactionInfo.token && (
            <div className="flex justify-between">
              <span className="text-theme-secondary">Token:</span>
              <span className="text-theme font-medium">
                {transactionInfo.token}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
