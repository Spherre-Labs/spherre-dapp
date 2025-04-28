'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/shared/Button'
import Tabs from './Tabs'
import AmountChart from '@/app/dapp/AmountChart'
import { useState } from 'react'

export default function DashboardPage() {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)

  React.useEffect(() => {
    console.log("Modal state:", open);
  }, [open]);
 
  return (
    <div className="py-[33px] px-[26px] rounded-[10px] grid gap-y-[36px] border-[#292929] border-2 mx-4 my-4">
      <div className="grid lg:grid-cols-2 gap-[15px]">
        <div className="bg-[#272729] rounded-[10px] py-[25px] px-[28px]">
          <div className="grid gap-y-[26px] mb-[55px]">
            <div className="flex justify-between">
              <div className="flex items-center gap-x-2">
                <h3 className="text-[#8E9BAE] font-semibold text-[16px]">
                  Wallet Balance
                </h3>
                <Image
                  className="pt-1"
                  height={25}
                  width={25}
                  src="/eye.svg"
                  alt="Eye Icon"
                />
              </div>
              <Image
                className="pt-1"
                height={25}
                width={25}
                src="/wallet-money-linear.svg"
                alt="Wallet Icon"
              />
            </div>
            <h2 className="text-[45px] text-white font-semibold">$250.35</h2>
          </div>
          <div className="grid grid-cols-3 gap-x-3">
            <Button
              variant="primary"
              icon="/card-send-linear.svg"
              onClick={handleOpen}
            >
              Withdraw
            </Button>
            
            <Button variant="primary" icon="/card-recive-linear.svg">
              Deposit
            </Button>
          
            <Button variant="secondary" icon="/arrows-exchange.svg">
              Trade
            </Button>
          </div>
        </div>
        <div className="grid grid-rows-2 gap-y-[15px]">
          <div className="bg-[#272729] rounded-[10px] py-[25px] px-[28px] flex items-center justify-between">
            <div className="flex flex-col justify-between h-full  gap-y-2">
              <Image
                height={25}
                width={25}
                src="/users-group-two-rounded-linear.svg"
                alt="Users Group Icon"
              />
              <p className="text-[#8E9BAE]">Members</p>
            </div>
            <h3 className="text-[45px] text-white font-semibold">5</h3>
          </div>
          <div className="bg-[#272729] rounded-[10px] py-[25px] px-[28px] flex items-center justify-between">
            <div className="flex flex-col justify-between h-full  gap-y-2">
              <Image
                height={25}
                width={25}
                src="/book-number-16-regular.svg"
                alt="Boo number Icon"
              />
              <div className="flex items-center gap-x-2">
                <p className="text-[#8E9BAE]">Threshold</p>
                <Image
                  height={25}
                  width={25}
                  src="/proicons_info.svg"
                  alt="Info Icon"
                />
              </div>
            </div>
            <h3 className="text-[45px] text-white font-semibold">3/5</h3>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-[2.5fr_1fr] gap-[15px]">
        <div className=" rounded-[10px]">
          <AmountChart />
        </div>
        <div className="bg-[#272729] flex flex-col gap-y-[23px] items-center justify-between rounded-[10px] py-[25px] px-[28px]">
          <h3 className="self-start mb-5 text-[#8E9BAE] text-[16px] font-bold">
            Request Status
          </h3>
          <Image
            height={100}
            width={100}
            src="/request_placeholder.svg"
            alt="Request Placeholder Icon"
          />
          <p className="text-[#8E9BAE] text-center">
            You currently haven’t sent for any fund conformation approval.
          </p>
        </div>
      </div>
      <Tabs />
    </div>
  )
}
