'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/shared/Button'
import Tabs from './Tabs'
import AmountChart from '@/app/dapp/AmountChart'
import WithdrawalModal from '@/app/components/modal'
import DepositModal from '../components/deposit-modal'

export default function DashboardPage() {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSelectOption = (option: string) => {
    console.log('Selected option:', option)
    // Handle the selected option
  }

  useEffect(() => {
    console.log('Modal state:', open)
  }, [open])

  return (
    <div className="py-4 sm:py-6 lg:py-8 px-1 sm:px-4 lg:px-6 rounded-[10px] flex flex-col gap-y-4 sm:gap-y-6 lg:gap-y-8 border-[#292929] border-2 mx-1 sm:mx-4 overflow-x-hidden w-full min-h-[90vh]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-[15px] w-full">
        <div className="bg-[#272729] rounded-[10px] py-4 sm:py-6 lg:py-[25px] px-3 sm:px-6 lg:px-[28px] w-full">
          <div className="grid gap-y-4 sm:gap-y-6 lg:gap-y-[26px] mb-6 sm:mb-8 lg:mb-[55px]">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-x-2">
                <h3 className="text-[#8E9BAE] font-semibold text-sm sm:text-base lg:text-[16px]">
                  Wallet Balance
                </h3>
                <Image
                  className="pt-1"
                  height={20}
                  width={20}
                  src="/eye.svg"
                  alt="Eye Icon"
                />
              </div>
              <Image
                className="pt-1"
                height={20}
                width={20}
                src="/wallet-money-linear.svg"
                alt="Wallet Icon"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[45px] text-white font-semibold">$250.35</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-x-3">
            <Button
              variant="primary"
              icon="/card-send-linear.svg"
              onClick={handleOpen}
            >
              Withdraw
            </Button>

            <DepositModal />

            <Button variant="secondary" icon="/arrows-exchange.svg">
              Trade
            </Button>
          </div>
        </div>
        <div className="grid grid-rows-2 gap-y-3 sm:gap-y-4 lg:gap-y-[15px] w-full">
          <div className="bg-[#272729] rounded-[10px] py-4 sm:py-6 lg:py-[25px] px-3 sm:px-6 lg:px-[28px] flex items-center justify-between w-full">
            <div className="flex flex-col justify-between h-full gap-y-2">
              <Image
                height={20}
                width={20}
                src="/users-group-two-rounded-linear.svg"
                alt="Users Group Icon"
              />
              <p className="text-[#8E9BAE] text-sm sm:text-base">Members</p>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-[45px] text-white font-semibold">5</h3>
          </div>
          <div className="bg-[#272729] rounded-[10px] py-4 sm:py-6 lg:py-[25px] px-3 sm:px-6 lg:px-[28px] flex items-center justify-between w-full">
            <div className="flex flex-col justify-between h-full gap-y-2">
              <Image
                height={20}
                width={20}
                src="/book-number-16-regular.svg"
                alt="Boo number Icon"
              />
              <div className="flex items-center gap-x-2">
                <p className="text-[#8E9BAE] text-sm sm:text-base">Threshold</p>
                <Image
                  height={20}
                  width={20}
                  src="/proicons_info.svg"
                  alt="Info Icon"
                />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-[45px] text-white font-semibold">3/5</h3>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-3 sm:gap-4 lg:gap-[15px] w-full">
        <div className="rounded-[10px] overflow-hidden w-full">
          <AmountChart />
        </div>
        <div className="bg-[#272729] flex flex-col gap-y-4 sm:gap-y-6 lg:gap-y-[23px] items-center justify-between rounded-[10px] py-4 sm:py-6 lg:py-[25px] px-3 sm:px-6 lg:px-[28px] w-full">
          <h3 className="self-start mb-3 sm:mb-4 lg:mb-5 text-[#8E9BAE] text-sm sm:text-base lg:text-[16px] font-bold">
            Request Status
          </h3>
          <Image
            height={80}
            width={80}
            className="sm:h-[100px] sm:w-[100px]"
            src="/request_placeholder.svg"
            alt="Request Placeholder Icon"
          />
          <p className="text-[#8E9BAE] text-center text-sm sm:text-base">
            You currently havent sent for any fund conformation approval.
          </p>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <Tabs />
      </div>

      {/* Add the WithdrawalModal component */}
      <WithdrawalModal
        open={open}
        handleClose={handleClose}
        onSelectOption={handleSelectOption}
      />
    </div>
  )
}
