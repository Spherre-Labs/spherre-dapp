'use client'
import React, { useState, useEffect, useContext } from 'react'
import Image from 'next/image'
import { Button } from '@/components/shared/Button'
import Tabs from './Tabs'
import AmountChart from './AmountChart'
import WithdrawalModal from '@/app/components/modal'
import DepositModal from '../../components/deposit-modal'
import { useTheme } from '@/app/context/theme-context-provider'
import { useTokenBalances } from '@/hooks/useTokenBalances'
import { useAccountInfo } from '@/hooks/useSpherreHooks'
import { SpherreAccountContext } from '@/app/context/account-context'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/utils/routes'
import NFTDetailsModal from '../../components/NFTDetailsModal'
import { Eye, EyeOff } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  useTheme()
  const [open, setOpen] = useState(false)
  const [depositOpen, setDepositOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [minSkeletonElapsed, setMinSkeletonElapsed] = useState(false)
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const { accountAddress } = useContext(SpherreAccountContext)
  const { tokensDisplay, loadingTokenData } = useTokenBalances()
  const [nftModalOpen, setNFTModalOpen] = useState<number | undefined>()
  const info = useAccountInfo(accountAddress || '0x0')

  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Ensure loaders are visible for at least 5 seconds to communicate background work
  useEffect(() => {
    try {
      const done = sessionStorage.getItem('dashboardSkeletonShown') === 'true'
      if (done) {
        setMinSkeletonElapsed(true)
        return
      }
    } catch {}

    const id = setTimeout(() => {
      setMinSkeletonElapsed(true)
      try {
        sessionStorage.setItem('dashboardSkeletonShown', 'true')
      } catch {}
    }, 5000)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    console.log(tokensDisplay)
  }, [tokensDisplay])

  const totalValue = tokensDisplay.reduce((acc, token) => {
    const numericValue = parseFloat(token.value.replace('$', '')) || 0
    return acc + numericValue
  }, 0)

  // Only show skeletons while fetching; zero balances should still show real UI
  const isTokenDataPending = loadingTokenData || !minSkeletonElapsed

  const isMembersPending = info?.isLoading || !minSkeletonElapsed
  const isThresholdPending = info?.isLoading || !minSkeletonElapsed

  useEffect(() => {
    console.log('Modal state:', open)
  }, [open])

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDepositOpen = () => {
    setDepositOpen(true)
  }

  const handleDepositClose = () => {
    setDepositOpen(false)
  }

  const handleNFTDetailsClick = (val: number | undefined) => {
    setNFTModalOpen(val)
  }

  const toggleBalance = () => {
    setIsBalanceVisible(!isBalanceVisible)
  }

  const handleSelectOption = () => {
    router.push(routes(accountAddress).withdraw)
    // Handle the selected option
  }

  if (!mounted) return null

  return (
    <div className="rounded-[10px] flex flex-col gap-y-4 sm:gap-y-6 lg:gap-y-8 overflow-x-hidden w-full min-h-[90vh] bg-theme-bg-secondary transition-colors duration-300 p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-[15px] w-full">
        <div className="bg-theme-bg-tertiary border border-theme-border rounded-[10px] py-4 sm:py-6 lg:py-[25px] px-3 sm:px-6 lg:px-[28px] w-full transition-colors duration-300">
          <div className="grid gap-y-4 sm:gap-y-6 lg:gap-y-[26px] mb-6 sm:mb-8 lg:mb-[55px]">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-x-2">
                <h3 className="text-theme-secondary font-semibold text-sm sm:text-base lg:text-[16px] transition-colors duration-300">
                  Wallet Balance
                </h3>
                <button
                  onClick={toggleBalance}
                  className="focus:outline-none hover:opacity-70 transition-opacity duration-200"
                  aria-label={
                    isBalanceVisible ? 'Hide balance' : 'Show balance'
                  }
                >
                  {isBalanceVisible ? (
                    <Eye size={20} className="text-theme-secondary" />
                  ) : (
                    <EyeOff size={20} className="text-theme-secondary" />
                  )}
                </button>
              </div>
              <Image
                className="pt-1"
                height={20}
                width={20}
                src="/wallet-money-linear.svg"
                alt="Wallet Icon"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[45px] text-theme font-semibold transition-colors duration-300">
              {isTokenDataPending ? (
                <div className="w-40 sm:w-48 lg:w-56">
                  <Skeleton className="h-8 sm:h-9 lg:h-10 w-full bg-theme-bg-secondary" />
                </div>
              ) : isBalanceVisible ? (
                `$${totalValue.toFixed(2)}`
              ) : (
                '•••••'
              )}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-x-3">
            <Button
              variant="primary"
              icon="/card-send-linear.svg"
              onClick={handleOpen}
            >
              Withdraw
            </Button>
            <Button
              variant="primary"
              icon="/card-recive-linear.svg"
              onClick={handleDepositOpen}
            >
              Deposit
            </Button>
            <Button variant="secondary" icon="/arrows-exchange.svg">
              Trade
            </Button>
          </div>
        </div>
        <div className="grid grid-rows-2 gap-y-3 sm:gap-y-4 lg:gap-y-[15px] w-full">
          <div className="bg-theme-bg-tertiary border border-theme-border rounded-[10px] py-4 sm:py-6 lg:py-[25px] px-3 sm:px-6 lg:px-[28px] flex items-center justify-between w-full transition-colors duration-300">
            <div className="flex flex-col justify-between h-full gap-y-2">
              <Image
                height={20}
                width={20}
                src="/users-group-two-rounded-linear.svg"
                alt="Users Group Icon"
              />
              <p className="text-theme-secondary text-sm sm:text-base transition-colors duration-300">
                Members
              </p>
            </div>
            {isMembersPending ? (
              <div className="w-16 sm:w-20 lg:w-24">
                <Skeleton className="h-7 w-full bg-theme-bg-secondary" />
              </div>
            ) : info?.error && !info.members ? (
              <span className="text-theme-secondary text-lg">—</span>
            ) : (
              <h3 className="text-2xl sm:text-3xl lg:text-[45px] text-theme font-semibold transition-colors duration-300">
                {info?.members?.length}
              </h3>
            )}
          </div>
          <div className="bg-theme-bg-tertiary border border-theme-border rounded-[10px] py-4 sm:py-6 lg:py-[25px] px-3 sm:px-6 lg:px-[28px] flex items-center justify-between w-full transition-colors duration-300">
            <div className="flex flex-col justify-between h-full gap-y-2">
              <Image
                height={20}
                width={20}
                src="/book-number-16-regular.svg"
                alt="Book number Icon"
              />
              <div className="flex items-center gap-x-2">
                <p className="text-theme-secondary text-sm sm:text-base transition-colors duration-300">
                  Threshold
                </p>
                <Image
                  height={20}
                  width={20}
                  src="/proicons_info.svg"
                  alt="Info Icon"
                />
              </div>
            </div>
            {isThresholdPending ? (
              <div className="w-16 sm:w-20 lg:w-24">
                <Skeleton className="h-7 w-full bg-theme-bg-secondary" />
              </div>
            ) : info?.error && !info.threshold ? (
              <span className="text-theme-secondary text-lg">-</span>
            ) : (
              <h3 className="text-2xl sm:text-3xl lg:text-[45px] text-theme font-semibold transition-colors duration-300">
                {info?.threshold?.[0]?.toString?.() ?? '-'}
              </h3>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-3 sm:gap-4 lg:gap-[15px] w-full">
        <div className="rounded-[10px] overflow-hidden w-full">
          {isTokenDataPending ? (
            <div className="bg-theme-bg-tertiary border border-theme-border rounded-lg p-4 sm:p-6 w-full transition-colors duration-300">
              <div className="space-y-4">
                {/* Header skeletons */}
                <div className="flex items-center justify-between">
                  <div className="w-32 sm:w-40">
                    <div className="h-5 w-full rounded bg-theme-bg-secondary animate-pulse" />
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="h-6 w-8 rounded bg-theme-bg-secondary animate-pulse" />
                    <div className="h-6 w-8 rounded bg-theme-bg-secondary animate-pulse" />
                    <div className="h-6 w-8 rounded bg-theme-bg-secondary animate-pulse" />
                    <div className="h-6 w-8 rounded bg-theme-bg-secondary animate-pulse" />
                    <div className="h-6 w-8 rounded bg-theme-bg-secondary animate-pulse" />
                    <div className="h-6 w-14 rounded bg-theme-bg-secondary animate-pulse" />
                  </div>
                </div>

                {/* Chart area skeleton: darker grid bars */}
                <div className="relative h-[260px] w-full rounded bg-theme-bg-tertiary border border-theme-border overflow-hidden">
                  <div className="absolute inset-0 p-3 grid grid-rows-5 gap-3">
                    <div className="h-8 w-full rounded bg-theme-bg-secondary animate-pulse" />
                    <div className="h-8 w-full rounded bg-theme-bg-secondary animate-pulse" />
                    <div className="h-8 w-full rounded bg-theme-bg-secondary animate-pulse" />
                    <div className="h-8 w-full rounded bg-theme-bg-secondary animate-pulse" />
                    <div className="h-8 w-full rounded bg-theme-bg-secondary animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <AmountChart />
          )}
        </div>
        <div className="bg-theme-bg-tertiary border border-theme-border flex flex-col gap-y-4 sm:gap-y-6 lg:gap-y-[23px] items-center justify-between rounded-[10px] py-4 sm:py-6 lg:py-[25px] px-3 sm:px-6 lg:px-[28px] w-full transition-colors duration-300">
          {isTokenDataPending ? (
            <div className="w-full">
              <div className="h-5 w-40 bg-theme-bg-secondary rounded animate-pulse mb-5 mx-1" />
              <div className="h-[120px] rounded bg-theme-bg-secondary animate-pulse mx-1 mb-4" />
              <div className="h-4 w-3/4 bg-theme-bg-secondary rounded animate-pulse mx-1 mb-2" />
              <div className="h-4 w-2/3 bg-theme-bg-secondary rounded animate-pulse mx-1" />
            </div>
          ) : (
            <>
              <h3 className="self-start mb-3 sm:mb-4 lg:mb-5 text-theme-secondary text-sm sm:text-base lg:text-[16px] font-bold transition-colors duration-300">
                Request Status
              </h3>
              <Image
                height={80}
                width={80}
                className="sm:h-[100px] sm:w-[100px]"
                src="/request_placeholder.svg"
                alt="Request Placeholder Icon"
              />
              <p className="text-theme-secondary text-center text-sm sm:text-base transition-colors duration-300">
                You currently haven`t sent for any fund confirmation approval.
              </p>
            </>
          )}
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <Tabs
          loadingTokenData={loadingTokenData}
          tokens={tokensDisplay}
          setNFTModalOpen={setNFTModalOpen}
        />
      </div>

      {/* Add the WithdrawalModal component */}
      <WithdrawalModal
        open={open}
        handleClose={handleClose}
        onSelectOption={handleSelectOption}
      />
      <DepositModal open={depositOpen} onClose={handleDepositClose} />

      <NFTDetailsModal open={nftModalOpen} onClose={handleNFTDetailsClick} />
    </div>
  )
}
