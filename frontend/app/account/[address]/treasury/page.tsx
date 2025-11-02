'use client'
import React, { useState } from 'react'
import TreasuryHeader from './components/treasury-header'
import TreasuryStatscard from './components/treasury-statscard'
import TreasuryPortfoliochat from './components/treasury-portfoliochat'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import Tabs from '../Tabs'
import WithdrawalModal from '@/app/components/modal'
import DepositModal from '@/app/components/deposit-modal'
import { useTokenBalances } from '@/hooks/useTokenBalances'
import { useNftTransactionList } from '@/hooks/useSpherreHooks'
import { useSpherreAccount } from '@/app/context/account-context'
import NFTDetailsModal from '@/app/components/NFTDetailsModal'

const chartDataByPeriod = {
  '1D': {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [
      {
        label: 'Tokens',
        data: [2, 3, 4, 3, 5, 4, 6],
        backgroundColor: '#8b5cf6',
        borderRadius: 4,
        barThickness: 16,
      },
      {
        label: 'NFTs',
        data: [1, 2, 2, 3, 2, 2, 3],
        backgroundColor: '#ec4899',
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  },
  '7D': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tokens',
        data: [5, 6, 7, 6, 8, 7, 9],
        backgroundColor: '#8b5cf6',
        borderRadius: 4,
        barThickness: 16,
      },
      {
        label: 'NFTs',
        data: [2, 3, 3, 4, 3, 3, 4],
        backgroundColor: '#ec4899',
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  },
  '1M': {
    labels: ['W1', 'W2', 'W3', 'W4'],
    datasets: [
      {
        label: 'Tokens',
        data: [10, 12, 11, 13],
        backgroundColor: '#8b5cf6',
        borderRadius: 4,
        barThickness: 16,
      },
      {
        label: 'NFTs',
        data: [4, 5, 4, 6],
        backgroundColor: '#ec4899',
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  },
  '3M': {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Tokens',
        data: [20, 18, 22],
        backgroundColor: '#8b5cf6',
        borderRadius: 4,
        barThickness: 16,
      },
      {
        label: 'NFTs',
        data: [8, 9, 10],
        backgroundColor: '#ec4899',
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  },
  '1Y': {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        label: 'Tokens',
        data: [8, 7, 6, 10, 5, 4, 4, 3, 3, 4, 4, 3],
        backgroundColor: '#8b5cf6',
        borderRadius: 4,
        barThickness: 16,
      },
      {
        label: 'NFTs',
        data: [4, 5, 3, 6, 5, 4, 3, 3, 3, 4, 5, 2],
        backgroundColor: '#ec4899',
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  },
}

const TreasuryPage = () => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<
    '1D' | '7D' | '1M' | '3M' | '1Y'
  >('1Y')
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [depositOpen, setDepositOpen] = useState(false)
  const [nftModalOpen, setNFTModalOpen] = useState<number | undefined>()

  // Token data
  const { tokensDisplay, loadingTokenData } = useTokenBalances()
  // Calculate total balance in dollars
  const totalBalance = tokensDisplay.reduce((acc, token) => {
    const numericValue = parseFloat(token.value.replace('$', '')) || 0
    return acc + numericValue
  }, 0)
  // Account address for NFT hook
  const { accountAddress } = useSpherreAccount()
  // NFT data
  const { data: nftList } = useNftTransactionList(accountAddress || '0x0')

  const handleTrade = () => {
    alert('Trade clicked!')
  }

  const handleWithdraw = () => setWithdrawOpen(true)
  const handleDeposit = () => setDepositOpen(true)
  const handleWithdrawClose = () => setWithdrawOpen(false)
  const handleDepositClose = () => setDepositOpen(false)
  const handleWithdrawSelect = () => {
    setWithdrawOpen(false)
  }

  const toggleBalance = () => setIsBalanceVisible(!isBalanceVisible)

  const topTokens = tokensDisplay
    .slice()
    .sort((a, b) => {
      const aValue = parseFloat((a.value || '0').replace('$', ''))
      const bValue = parseFloat((b.value || '0').replace('$', ''))
      return bValue - aValue
    })
    .slice(0, 5)
    .map((t) => ({
      symbol: t.coin,
      name: t.coin,
      amount: t.balance,
      unit: t.coin,
      change: '+0.00%',
      logo:
        t.coin === 'STRK'
          ? '/starknet.png'
          : t.coin === 'ETH'
            ? '/Eth.png'
            : '/Eth.png',
    }))

  // Chart data for the selected period
  const chartData = chartDataByPeriod[selectedPeriod]

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period as '1D' | '7D' | '1M' | '3M' | '1Y')
  }

  return (
    <div className=" sm:py-6 lg:py-8 p-2 sm:px-4 lg:px-6 rounded-[10px] flex flex-col gap-y-4 sm:gap-y-6 lg:gap-y-8  mx-1 sm:mx-4 overflow-x-hidden w-full min-h-[90vh] bg-theme-bg-secondary transition-colors duration-300">
      <ErrorBoundary
        errorComponent={({ error }) => (
          <div className="text-red-500 py-4 sm:py-6 lg:py-8 px-3 sm:px-6 lg:px-[28px]">
            <h2 className="text-sm sm:text-base lg:text-lg font-semibold">
              Something went wrong.
            </h2>
            <pre className="text-xs sm:text-sm lg:text-base overflow-auto mt-2">
              {error?.message}
            </pre>
          </div>
        )}
      >
        <div className=" lg:space-y-8 w-full">
          <TreasuryHeader
            balance={totalBalance.toFixed(2)}
            isBalanceVisible={isBalanceVisible}
            toggleBalance={toggleBalance}
            onWithdraw={handleWithdraw}
            onDeposit={handleDeposit}
            onTrade={handleTrade}
          />

          <TreasuryStatscard
            totalTokens={
              tokensDisplay.filter((t) => parseFloat(t.balance) > 0).length
            }
            totalStakes={0}
            totalNFTs={nftList?.length ?? 0}
          />

          <TreasuryPortfoliochat
            data={chartData}
            onPeriodChange={handlePeriodChange}
            topTokens={topTokens}
          />

          <div
            className="w-full flex min-w-0"
            style={{
              maxWidth: '100vw',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              paddingBottom: '1rem',
            }}
          >
            <div className="min-w-0  mt-6 flex-1">
              <Tabs
                loadingTokenData={loadingTokenData}
                tokens={tokensDisplay}
                setNFTModalOpen={setNFTModalOpen}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <WithdrawalModal
          open={withdrawOpen}
          handleClose={handleWithdrawClose}
          onSelectOption={handleWithdrawSelect}
        />
        <DepositModal open={depositOpen} onClose={handleDepositClose} />
        <NFTDetailsModal open={nftModalOpen} onClose={setNFTModalOpen} />
      </ErrorBoundary>
    </div>
  )
}

export default TreasuryPage
