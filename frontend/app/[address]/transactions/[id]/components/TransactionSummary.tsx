'use client'
import React, { ReactNode } from 'react'
import { useTheme } from '@/app/context/theme-context-provider'
import { TransactionType, type TransactionDisplayInfo } from '@/lib/contracts/types'
import withdraw from '../../../../../public/Images/withdraw-1.png'
import swap from '../../../../../public/Images/swap.png'
import members from '../../../../../public/Images/Members.png'
import limit from '../../../../../public/Images/limit.png'
import Image from 'next/image'

export const TransactionSummary = ({
  transactionInfo,
}: {
  transactionInfo: TransactionDisplayInfo
}) => {
  useTheme()

  const getTypeIcon = (title: string, type: TransactionType): ReactNode => {
    if (title.startsWith('withdraw')) {
      return <Image src={withdraw} width={20} height={20} alt="withdraw" />
    } else if (title.startsWith('limitswap')) {
      return <Image src={limit} width={20} height={20} alt="limit swap" />
    } else if (title.startsWith('swap')) {
      return <Image src={swap} width={20} height={20} alt="swap" />
    }

    switch (type) {
      case TransactionType.TOKEN_SEND:
        return (
          <Image src={withdraw} width={30} height={30} alt="token transfer" />
        )
      case TransactionType.NFT_SEND:
        return <Image src={swap} width={30} height={30} alt="nft transfer" />
      case TransactionType.MEMBER_ADD:
      case TransactionType.MEMBER_REMOVE:
      case TransactionType.MEMBER_PERMISSION_EDIT:
        return <Image src={members} width={30} height={30} alt="member action" />
      case TransactionType.THRESHOLD_CHANGE:
        return (
          <Image src={limit} width={30} height={30} alt="threshold change" />
        )
      case TransactionType.SMART_TOKEN_LOCK:
        return <Image src={swap} width={30} height={30} alt="smart lock" />
      default:
        return <Image src={withdraw} width={30} height={30} alt="transaction" />
    }
  }

  const getTransactionStatus = (status: string): ReactNode => {
    switch (status) {
      case 'Pending':
        return <p className='text-light-yellow bg-[#FFD7001F] font-medium text-sm w-fit px-2 py-0.5 rounded-full'>
          {`${status}`}
        </p>
      case 'Executed':
        return <p className='text-green bg-[#19B3601F] font-medium text-sm w-fit px-2 py-0.5 rounded-full'>
          {`${status}`}
        </p>
      case 'Rejected':
        return <p className='text-red-500 bg-[#FF00001F] font-medium text-sm w-fit px-2 py-0.5 rounded-full'>
          {`${status}`}
        </p>
      default:
        return <p className='text-gray bg-[#8080801F] font-medium text-sm w-fit px-2 py-0.5 rounded-full'>
          {`${status}`}
        </p>
    }
  }

  return (
    <section className="mb-6 px-[18px] flex justify-between items-center py-6 border-dashed border border-theme-border">
      <div className="flex items-center gap-3">
        <div className='w-12 h-12 rounded-full p-2.5 bg-theme-bg-secondary flex items-center justify-center'>
          {getTypeIcon(transactionInfo.title, transactionInfo.transaction.transactionType)}
        </div>
        <div className='flex flex-col gap-1 font-sans'>
          <p className='text-theme-secondary font-medium'>
            {transactionInfo.title} {` `}
            <span className='text-theme font-bold'>{`${transactionInfo.amount} ${transactionInfo.token}`}</span>
            {` `}
            {`to`} {` `}
            <span className='text-theme font-bold'>{`${transactionInfo.recipient}`}</span>
          </p>
          {getTransactionStatus(transactionInfo.transaction.status)}
        </div>

      </div>

      <div className="">
        {transactionInfo.amount && (
          <div className='flex flex-col font-sans'>
            <div className='text-theme-secondary items-center flex gap-3 font-medium'>
              <p className='text-theme-secondary font-medium'>{`You send`} {` `}</p>
              <p><span className='text-theme font-bold text-2xl'>{`${transactionInfo.amount}`}</span>
                <span className='text-2xl'>{` ${transactionInfo.token}`}</span></p>
            </div>
            <span className=" font-semibold text-xl text-theme-secondary text-right">
              130 USD
            </span>
          </div>
        )}
      </div>
    </section>
  )

}
