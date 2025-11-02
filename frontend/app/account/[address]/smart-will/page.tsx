'use client'

import AddWillModal from '@/app/components/modals/AddWillModal'
import SmartWillModal from '@/app/components/modals/SmartWillModal'
import { Button } from '@/components/shared/Button'
import { copyToClipboard } from '@/lib/utils'
import { useAccount } from '@starknet-react/core'
import { Check, Copy, Info, Pencil, TimerReset } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const SmartWillPage = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [isWillModalOpen, setIsWillModalOpen] = useState(false)
  const [walletType, setWalletType] = useState('Primary')
  const [willAddress, setWillAddress] = useState('')
  const { address } = useAccount()
  const [isCopiedWill, setIsCopiedWill] = useState(false)
  const [isCopiedAddress, setIsCopiedAddress] = useState(false)
  const [timerValues, setTimerValues] = useState({
    days: '30',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const targetTimeRef = useRef<number>(0)

  // timer function
  const initializeTimer = () => {
    const startTime = new Date().getTime()
    targetTimeRef.current = startTime + 30 * 24 * 60 * 60 * 1000

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetTimeRef.current - now

      if (distance <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        setTimerValues({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
        })
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimerValues({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      })
    }, 1000)
  }

  useEffect(() => {
    const savedWillAddress = localStorage.getItem('willAddress')

    if (savedWillAddress) {
      setWillAddress(savedWillAddress)
    }
  }, [])

  // reset timer function
  const resetCountdown = () => {
    initializeTimer()
  }

  const handleCopy = async (text: string, type: 'primary' | 'will') => {
    if (!text) return

    const result = await copyToClipboard(text)

    if (result.success) {
      if (type === 'primary') {
        setIsCopiedAddress(true)
        setTimeout(() => setIsCopiedAddress(false), 2000)
      } else {
        setIsCopiedWill(true)
        setTimeout(() => setIsCopiedWill(false), 2000)
      }
    } else {
      console.log('Failed to copy')
    }
  }

  if (!mounted) return null

  return (
    <div className="p-4 font-['Nunito_Sans'] bg-theme min-h-screen transition-colors duration-300">
      <h1 className="text-2xl font-bold flex items-center gap-2.5 text-gray-900 dark:text-white transition-colors duration-300">
        Smart Will{' '}
        <Info size={20} className="text-gray-500 dark:text-[#8E9BAE]" />{' '}
      </h1>
      <p className="text-gray-500 dark:text-[#8E9BAE] text-sm font-normal mt-2 mb-8 transition-colors duration-300">
        Automatic backup wallet system.
      </p>
      <hr className="w-full border-[1px] border-gray-200 dark:border-[#292929] transition-colors duration-300" />

      <section className="w-full flex items-start flex-col md:flex-row justify-between gap-5 py-5">
        <div className="w-full max-w-[395px] flex flex-col items-start gap-1">
          <h2 className="text-gray-900 dark:text-[#FFFFFF] text-xl font-bold transition-colors duration-300">
            Wallets
          </h2>
          <p className="text-sm font-normal text-gray-500 dark:text-[#8E9BAE] transition-colors duration-300">
            Automatically transfer permissions from a primary wallet to a backup
            wallet in case of loss, compromise, or long inactivity.
          </p>
        </div>

        <div className="w-full flex-1 bg-gray-50 dark:bg-[#1D1E22] rounded-[10px] p-4 h-fit flex flex-col items-start gap-10 transition-colors duration-300">
          <h2 className="text-gray-900 dark:text-[#FFFFFF] text-xl font-bold transition-colors duration-300">
            All Wallets
          </h2>

          <div className="w-full flex items-center justify-between gap-5 flex-wrap">
            <div className="flex-1 flex flex-col items-start gap-2.5 justify-between">
              <h6 className="text-gray-500 dark:text-[#8E9BAE] font-normal text-sm transition-colors duration-300">
                Wallet 1
              </h6>
              <div className="bg-white dark:bg-[#101213] w-full flex items-center justify-between gap-2 py-2.5 px-4 rounded-[10px] border border-gray-200 dark:border-transparent transition-colors duration-300">
                <input
                  value={address ?? ''}
                  type="text"
                  id="address"
                  className="flex-1 text-gray-600 dark:text-[#8E9BAE] font-normal text-base bg-transparent outline-none border-none max-w-sm transition-colors duration-300"
                  readOnly
                />
                <button
                  onClick={() => handleCopy(address!, 'primary')}
                  className="bg-gray-200 dark:bg-[#29292A] p-1 rounded-[5px] text-gray-700 dark:text-white transition-colors duration-300"
                >
                  {isCopiedAddress ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2.5 justify-between w-full max-w-[158px]">
              <h6 className="text-gray-500 dark:text-[#8E9BAE] font-normal text-sm flex items-center gap-2.5 transition-colors duration-300">
                Main Wallet{' '}
                <Info size={20} className="text-gray-500 dark:text-[#8E9BAE]" />
              </h6>
              <div className="bg-white dark:bg-[#101213] py-2.5 px-4 rounded-[10px] w-full text-gray-600 dark:text-[#8E9BAE] font-normal text-base border border-gray-200 dark:border-transparent transition-colors duration-300">
                Primary
              </div>
            </div>
          </div>

          <div className="w-full flex items-center justify-between gap-5 flex-wrap">
            <div className="flex-1 flex flex-col items-start gap-2.5 justify-between">
              <h6 className="text-gray-500 dark:text-[#8E9BAE] font-normal text-sm transition-colors duration-300">
                Wallet 2
              </h6>
              <div className="bg-white dark:bg-[#101213] w-full flex items-center justify-between gap-2 py-2.5 px-4 rounded-[10px] border border-gray-200 dark:border-transparent transition-colors duration-300">
                <input
                  value={willAddress}
                  type="text"
                  id="address"
                  className="flex-1 text-gray-600 dark:text-[#8E9BAE] font-normal text-base bg-transparent outline-none border-none max-w-sm transition-colors duration-300"
                  readOnly
                />
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsWillModalOpen(true)}
                    className="p-1 rounded-[5px] text-gray-600 dark:text-white transition-colors duration-300"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleCopy(willAddress, 'will')}
                    className="bg-gray-200 dark:bg-[#29292A] p-1 rounded-[5px] text-gray-700 dark:text-white transition-colors duration-300"
                  >
                    {isCopiedWill ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2.5 justify-between w-full max-w-[158px]">
              <h6 className="text-gray-500 dark:text-[#8E9BAE] font-normal text-sm flex items-center gap-2.5 transition-colors duration-300">
                Will Wallet{' '}
                <Info size={20} className="text-gray-500 dark:text-[#8E9BAE]" />
              </h6>
              <div className="bg-white dark:bg-[#101213] py-2.5 px-4 rounded-[10px] w-full text-gray-600 dark:text-[#8E9BAE] font-normal text-base border border-gray-200 dark:border-transparent transition-colors duration-300">
                <select
                  value={walletType}
                  onChange={(e) => setWalletType(e.target.value)}
                  className="bg-transparent !p-0 text-gray-600 dark:text-[#8E9BAE] !font-normal !text-base !w-full outline-0 border-0 cursor-pointer transition-colors duration-300"
                >
                  <option
                    value="Primary"
                    className="bg-white dark:bg-[#101213] text-gray-900 dark:text-white"
                  >
                    Primary
                  </option>
                  <option
                    value="Backup"
                    className="bg-white dark:bg-[#101213] text-gray-900 dark:text-white"
                  >
                    Backup
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-4">
            <h3 className="text-gray-500 dark:text-[#8E9BAE] text-sm font-normal transition-colors duration-300">
              Countdown To Will Transfer
            </h3>
            <div className="w-fit flex flex-wrap items-center gap-10">
              <div className="w-full flex-1 flex items-center gap-1.5 md:gap-2.5">
                {['days', 'hours', 'minutes', 'seconds'].map((unit, i) => (
                  <div
                    key={i}
                    className="w-fit flex flex-col gap-[7px] justify-between items-center h-fit"
                  >
                    <span className="font-bold text-lg md:text-2xl text-gray-900 dark:text-[#FFFFFF] transition-colors duration-300">
                      {timerValues[unit as keyof typeof timerValues]}
                    </span>
                    <span className="text-xs md:text-sm font-normal text-gray-500 dark:text-[#8E9BAE] transition-colors duration-300">
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </span>
                  </div>
                ))}

                <hr className="w-[30px] border-dashed border-[1.5px] border-gray-300 dark:border-[#292929] rotate-[-90deg] transition-colors duration-300" />
              </div>

              <Button
                onClick={resetCountdown}
                variant="secondary"
                className="bg-gray-200 dark:bg-[#24252A] !p-2.5 rounded-[10px] text-gray-700 dark:text-white transition-colors duration-300"
              >
                <TimerReset />
                Reset Countdown
              </Button>
            </div>
          </div>

          <div className="w-full flex items-start gap-2.5">
            <Info
              size={20}
              className="text-gray-500 dark:text-[#8E9BAE] flex-shrink-0 mt-0.5"
            />
            <p className="text-sm font-normal text-gray-500 dark:text-[#8E9BAE] transition-colors duration-300">
              Once the backup wallet is added, a 30-day countdown starts. You
              will receive reminders starting 5 days before the countdown ends
              to reset the timer if they are still active.
            </p>
          </div>
        </div>
      </section>

      {isModalOpen && <SmartWillModal setIsModalOpen={setIsModalOpen} />}

      {isWillModalOpen && (
        <AddWillModal
          setIsWillModalOpen={setIsWillModalOpen}
          willAddress={willAddress}
          setWillAddress={setWillAddress}
          initializeTimer={initializeTimer}
        />
      )}
    </div>
  )
}

export default SmartWillPage
