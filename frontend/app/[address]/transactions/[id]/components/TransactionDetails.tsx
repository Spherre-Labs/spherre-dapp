'use client'
import React from 'react'
import { useTheme } from '@/app/context/theme-context-provider'
import { type TransactionDisplayInfo } from '@/lib/contracts/types'
import { formatTimestamp, formatTime } from '@/lib/utils/transaction-utils'
import member2 from '../../../../../public/member2.svg'
import member1 from '../../../../../public/member1.svg'
import member3 from '../../../../../public/member3.svg'
import member4 from '../../../../../public/member4.svg'
import member5 from '../../../../../public/member5.svg'
import Image from 'next/image'
import backstageboys from '../../../../../public/Images/backstageboys.png'
import { Button } from '@/components/ui/button'
import { BadgeCheck, CircleX, CircleArrowRight, Copy } from 'lucide-react'
import Link from 'next/link'

const members = [member1, member2, member3, member4, member5]


export const TransactionDetails = ({
  transactionInfo,
}: {
  transactionInfo: TransactionDisplayInfo
}) => {
  useTheme()
  const { transaction } = transactionInfo

  // Placeholder data where fields might not exist
  const dateInitiated = formatTimestamp(transaction.dateCreated)
  const dateExecuted = transaction.status === 'Executed' && transaction.dateExecuted
    ? formatTimestamp(transaction.dateExecuted) + ', ' + formatTime(transaction.dateExecuted) : "___"
  const account = 'Backstage Boys'
  const transactionLink = transaction.status !== 'Pending' && transaction.transaction_id ? `https://etherscan.io/tx/${transaction.transaction_id}` : undefined
  const transactionId = transaction.id.toString().slice(0, 12)

  const detailItem = (label: string, value: React.ReactNode) => (
    <div className="flex justify-between items-center py-2">
      <p className="text-theme-text-secondary font-semibold text-sm">
        {label}
      </p>
      <div className="text-theme text-sm font-medium">
        {value}
      </div>
    </div>
  )

  return (
    <div className="space-y-6 font-sans">
      <div className="grid grid-cols-1 items-stretch lg:grid-cols-3 gap-7">
        {/* Transaction Details */}
        <section className="flex-1 flex flex-col">
          <h3 className="text-theme font-medium mb-4 text-lg">
            Transaction Details
          </h3>
          <div className="space-y-1 border border-theme-border px-3 py-4 rounded-lg flex-1">
            {detailItem('Initiator',
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  <Image src={member2} alt="avatar" width={21} height={21} />
                </div>
                <span className="text-theme flex items-center gap-2 truncate transition-colors duration-300">
                  <span className="text-sm">{transaction.proposer.slice(0, 8)}...{transaction.proposer.slice(-4)}</span>
                </span>
              </div>
            )}
            {detailItem('Date initiated', dateInitiated)}
            {detailItem('Date Executed', dateExecuted)}
            {detailItem('Account',
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  <Image src={backstageboys} alt="backstageboys" width={21} height={21} />
                </div>
                <span className='font-semibold'>{account}</span>
              </div>
            )}
            {transaction.status !== 'Pending' && transaction.transaction_id ?
              detailItem('Transaction Link',
                <div className="flex items-center gap-0">
                  <span className="font-mono">{transactionLink}</span>
                  <Button variant="ghost" size="icon" className="p-0" onClick={() => navigator.clipboard.writeText(transaction.transaction_id ?? "")}>
                    <Copy className="w-4 h-4 text-theme-secondary" />
                  </Button>
                  <Link href={`https://etherscan.io/tx/${transaction.transaction_id}`} target="_blank" className="text-sm">
                    <CircleArrowRight className="w-4 h-4 text-theme-secondary -rotate-45" />
                  </Link>
                </div>
              ) : detailItem('Transaction Link', <span className="font-mono">____</span>)}
            {transaction.status !== 'Pending' && transaction.transaction_id ?
              detailItem('Transaction ID', <span className="font-mono">{transactionId}</span>) :
              detailItem('Transaction ID', <span className="font-mono">____</span>)}
          </div>
        </section>

        {/* From Section */}
        <section className="flex-1 flex flex-col">
          <h3 className="text-theme font-medium mb-4 text-lg">
            From
          </h3>
          <div className="flex flex-col gap-4 border border-theme-border px-3 py-4 rounded-lg flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className='flex gap-2 items-center'>
                <div className="w-14 h-14 rounded-full flex items-center justify-center">
                  <Image src={backstageboys} alt="backstageboys" />
                </div>
                <div>
                  <h4 className="text-theme text-lg font-medium">Backstage Boys</h4>
                  <p className="text-theme-text-secondary text-sm font-semibold">0x233r...6574</p>
                </div>
              </div>
              <div className='bg-theme-bg-secondary rounded-xl p-2.5 text-theme text-sm font-medium'>
                Team Account
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-theme-bg-secondary p-3 space-y-2 rounded-lg text-center">
                <p className="text-theme-text-secondary text-sm">Threshold</p>
                <p className="text-theme text-xl font-bold">3/5</p>
              </div>
              <div className="bg-theme-bg-secondary p-3 space-y-2 rounded-lg text-center">
                <p className="text-theme-text-secondary text-sm">Members</p>
                <p className="text-theme text-xl font-bold">5</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-end">
              <p className="text-theme-text-secondary text-sm">Last transaction</p>
              <p className="text-theme text-sm">Wed 27 Feb, 2025</p>
            </div>
          </div>
        </section>

        {/* To Section */}
        <section className="flex-1 flex flex-col">
          <h3 className="text-theme font-medium mb-4 text-lg">
            To
          </h3>
          <div className="flex flex-col gap-4 border border-theme-border px-3 py-4 rounded-lg flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className='flex gap-2 items-center'>
                <div className="w-14 h-14 rounded-full flex items-center justify-center">
                  <Image src={member2} alt="member2" />
                </div>
                <div>
                  <h4 className="text-theme text-lg font-medium">Denzel Smith</h4>
                  <p className="text-theme-text-secondary text-sm font-semibold">0x233r...6574</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between">
                <p className="text-theme-text-secondary text-sm">Last transaction</p>
                <p className="text-theme text-sm">Wed 27 Feb, 2025</p>
              </div>
              <div className="flex justify-between">
                <p className="text-theme-text-secondary text-sm">Member Number</p>
                <p className="text-theme text-sm font-bold">2</p>
              </div>
              <div className="flex justify-between">
                <p className="text-theme-text-secondary text-sm">Email Address</p>
                <p className="text-theme text-sm">denziesmith@gmail.com</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Updates/Transaction Progress */}
      <section className="flex flex-col max-w-[50%]">
        <h3 className="text-theme font-medium mb-4 text-lg">
          Updates/Transaction Progress
        </h3>
        <div className="border border-theme-border px-3 py-4 rounded-lg flex flex-col gap-8">
          {/* Progress Stats */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-theme-bg-secondary p-4 rounded-lg">
                <p className="text-theme-text-secondary text-sm mb-2">Threshold</p>
                <p className="text-theme text-3xl font-bold">3/5</p>
              </div>
              <div className="bg-theme-bg-secondary p-4 rounded-lg">
                <p className="text-theme-text-secondary text-sm mb-2">Confirmed</p>
                <p className="text-theme text-3xl font-bold">5</p>
              </div>
              <div className="bg-theme-bg-secondary p-4 rounded-lg">
                <p className="text-theme-text-secondary text-sm mb-2">Rejections</p>
                <p className="text-theme text-3xl font-bold">0</p>
              </div>
            </div>

            <div className='grid grid-cols-3 gap-4'>

              {/* Timeline */}
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
                      {formatTimestamp(transaction.dateCreated)}{' '}
                      {formatTime(transaction.dateCreated)}
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
                      <h3 className="text-theme font-semibold -mt-1.5">Execution</h3>
                      <p className="text-theme-secondary font-semibold text-xs transition-colors duration-300">
                        ---------------------
                      </p>
                    </div>
                  )}
                  {transaction.status === 'Executed' && transaction.dateExecuted && (
                    <div className="flex-1 pt-0">
                      <h3 className="text-theme font-semibold -mt-1.5">Executed</h3>
                      <p className="text-theme-secondary font-semibold text-xs transition-colors duration-300">
                        {formatTimestamp(transaction.dateExecuted)}{' '}
                        {formatTime(transaction.dateExecuted)}
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

              {/* Approvals */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-theme-text-secondary text-sm font-medium mb-3">Confirmed Approvals</h4>
                  <div className="space-y-2.5">
                    {['Denzel Smith', 'Hichens', 'Jives', 'Kerkeze', 'Haley'].map((name, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center">
                          <Image src={members[index]} alt="member1" width={20} height={20} />
                        </div>
                        <span className="text-theme text-sm">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rejections */}
              <div>
                <h4 className="text-theme-text-secondary text-sm font-medium mb-3">Rejections</h4>
                <p className="text-theme-text-secondary text-sm">----------</p>
              </div>
            </div>
          </div>
        </div>
      </section >
    </div >
  )
}