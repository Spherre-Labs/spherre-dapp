'use client'
import React, { useEffect, useState, Suspense } from 'react'
import { Nunito_Sans } from 'next/font/google'
import { useSearchParams, useRouter } from 'next/navigation'
import ManualDeposit from './components/ManualDeposit'
import DappDeposit from './components/DappDeposit'

const nunito = Nunito_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
})

const DepositContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'manual' | 'dapp'>('dapp')

  // Handle URL search params for tabs
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'manual') {
      setActiveTab('manual')
    } else {
      setActiveTab('dapp')
    }
  }, [searchParams])

  const handleTabChange = (tab: 'manual' | 'dapp') => {
    setActiveTab(tab)
    const params = new URLSearchParams(searchParams.toString())
    if (tab === 'manual') {
      params.set('tab', 'manual')
    } else {
      params.delete('tab')
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div
      className={`${nunito.className} p-10 flex items-center flex-col justify-center h-full transition-colors duration-300`}
    >
      <div className="flex-col items-center flex justify-center mb-8">
        <p className="font-bold text-[30px] text-gray-900 dark:text-white transition-colors duration-300">
          Deposit to Spherre Wallet
        </p>
        <p className="text-[16px] font-normal text-[#8E9BAE] max-w-[379px] pt-2 text-center">
          Choose your preferred deposit method
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex w-[621px] mb-8">
        <button
          onClick={() => handleTabChange('dapp')}
          className={`flex-1 py-3 px-6 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
            activeTab === 'dapp'
              ? 'bg-[#6F2FCE] text-white'
              : 'bg-[#1C1D1F] text-[#8E9BAE] hover:text-white'
          }`}
        >
          Dapp Deposit
        </button>
        <button
          onClick={() => handleTabChange('manual')}
          className={`flex-1 py-3 px-6 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
            activeTab === 'manual'
              ? 'bg-[#6F2FCE] text-white'
              : 'bg-[#1C1D1F] text-[#8E9BAE] hover:text-white'
          }`}
        >
          Manual Deposit
        </button>
      </div>

      {/* Tab Content */}
      <div className="w-[621px]">
        {activeTab === 'manual' ? <ManualDeposit /> : <DappDeposit />}
      </div>
    </div>
  )
}

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <DepositContent />
    </Suspense>
  )
}

export default Page
