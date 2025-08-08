'use client'
import React, { Suspense } from 'react'
import { Nunito_Sans } from 'next/font/google'
import ManualDeposit from './components/ManualDeposit'

const nunito = Nunito_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
})

const DepositViaAddressContent = () => {
  return (
    <div
      className={`${nunito.className} p-10 flex items-center flex-col justify-center h-full transition-colors duration-300`}
    >
      <div className="flex-col items-center flex justify-center mb-8">
        <p className="font-bold text-[30px] text-gray-900 dark:text-white transition-colors duration-300">
          Deposit to Spherre Wallet
        </p>
        <p className="text-[16px] font-normal text-[#8E9BAE] max-w-[379px] pt-2 text-center">
          Send funds to your Spherre wallet address
        </p>
      </div>

      {/* Manual Deposit Content */}
      <div className="w-[621px]">
        <ManualDeposit />
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
      <DepositViaAddressContent />
    </Suspense>
  )
}

export default Page
