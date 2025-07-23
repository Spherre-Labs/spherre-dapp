'use client'
import React, { useEffect, useState } from 'react'
import { Calendar, ArrowDown, ArrowUp, ChevronDown } from 'lucide-react'
import dynamic from 'next/dynamic'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js'
import Image from 'next/image'

// Register Chart.js components with logging
try {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)
  console.log(
    'Chart.js scales registered:',
    ChartJS.registry.scales.get('category') ? 'Success' : 'Failed',
  )
} catch (error) {
  console.error('Error registering Chart.js components:', error)
}

// Dynamically import the Bar component with SSR disabled
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-700 rounded h-full flex items-center justify-center text-gray-400">
      Loading chart...
    </div>
  ),
})

interface TopToken {
  symbol: string
  name: string
  amount: string
  unit: string
  change: string
  logo: string
}

interface TreasuryPortfoliochatProps {
  data: import('chart.js').ChartData<'bar'>
  onPeriodChange: (date: string) => void
  topTokens: TopToken[]
}

const TreasuryPortfoliochat = ({
  data,
  onPeriodChange,
  topTokens,
}: TreasuryPortfoliochatProps) => {
  const [isClient, setIsClient] = useState(false)

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true)
    console.log('Client-side rendering enabled for TreasuryPortfoliochat')
  }, [])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        type: 'category' as const,
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        type: 'linear' as const,
        grid: {
          color: '#374151',
        },
        ticks: {
          color: '#6b7280',
        },
      },
    },
  }

  const isPositiveChange = (change: string) => {
    return (
      change.startsWith('+') ||
      (!change.startsWith('-') && parseFloat(change) > 0)
    )
  }

  const [selectedPeriod, setSelectedPeriod] = useState('1D')
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    onPeriodChange(period)
  }

  return (
    <div className="w-full mb-4 md:mb-6">
      {/* Mobile Layout: Stacked */}
      <div className="block lg:hidden space-y-4 md:space-y-6">
        {/* Chart Section - Mobile */}
        <div className="w-full bg-[#1C1D1F] rounded-lg p-3 sm:p-4 border-2 border-[#292929]">
          {/* Header Controls - Mobile Layout */}
          <div className="flex flex-col space-y-3 mb-4">
            {/* Legend */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#6F2FCE]"></div>
                <span className="text-xs sm:text-sm text-gray-400">Tokens</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#FF7BE9]"></div>
                <span className="text-xs sm:text-sm text-gray-400">NFTs</span>
              </div>
            </div>

            {/* Time Period Buttons */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-0.5 sm:gap-1 bg-[#2A2B2D] rounded-lg p-0.5 sm:p-1">
                {['1D', '7D', '1M', '3M', '1Y'].map((period) => (
                  <button
                    key={period}
                    onClick={() => handlePeriodChange(period)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                      selectedPeriod === period
                        ? 'bg-[#6F2FCE] text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-[#33343A]'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Dates - Hidden on mobile */}
            <div className="hidden sm:flex items-center justify-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <button className="flex items-center gap-2 bg-[#2A2B2D] rounded-md px-3 py-1.5 text-xs text-gray-300 hover:bg-[#33343A] transition-colors">
                <span>Select Dates</span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Chart Container - Mobile */}
          <div className="w-full h-64 sm:h-80">
            {isClient ? (
              <Bar data={data} options={chartOptions} />
            ) : (
              <div className="animate-pulse bg-gray-700 rounded h-full flex items-center justify-center text-gray-400">
                Loading chart...
              </div>
            )}
          </div>
        </div>

        {/* Top Tokens Section - Mobile */}
        <div className="w-full bg-[#1C1D1F] rounded-lg p-3 sm:p-4 border-2 border-[#292929]">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
            Top Tokens
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {topTokens.map((token, index) => {
              const isPositive = isPositiveChange(token.change)
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-[#242529] border border-[#333]"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <Image
                        src={token.logo}
                        width={20}
                        height={20}
                        alt={`${token.symbol} logo`}
                        className="sm:w-6 sm:h-6"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-white text-xs sm:text-sm truncate">
                        {token.symbol}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {token.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="font-medium text-white text-xs sm:text-sm">
                      {token.amount} {token.unit}
                    </div>
                    <div
                      className={`text-xs flex items-center gap-1 justify-end ${
                        isPositive ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      ) : (
                        <ArrowDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      )}
                      <span className="text-xs">
                        {token.change.replace(/^[+-]/, '')}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Desktop Layout: Side by Side (Original) */}
      <div className="hidden lg:grid lg:grid-cols-4 lg:h-[445px] gap-6">
        {/* Chart Section - Desktop */}
        <div className="lg:col-span-3 h-full bg-[#1C1D1F] rounded-lg p-4 border-4 border-[#292929]">
          <div className="flex items-center justify-between mb-4">
            {/* Left: Token/NFT Legend */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#6F2FCE]"></div>
                <span className="text-sm text-gray-400">Tokens</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF7BE9]"></div>
                <span className="text-sm text-gray-400">NFTs</span>
              </div>
            </div>

            {/* Center: Time Period Buttons */}
            <div className="flex items-center gap-1 bg-[#2A2B2D] rounded-lg p-1">
              {['1D', '7D', '1M', '3M', '1Y'].map((period) => (
                <button
                  key={period}
                  onClick={() => handlePeriodChange(period)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                    selectedPeriod === period
                      ? 'bg-[#6F2FCE] text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-[#33343A]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Right: Select Dates Dropdown */}
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <div className="relative">
                <button className="flex items-center gap-2 bg-[#2A2B2D] rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-[#33343A] transition-colors">
                  <span>Select Dates</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="h-96">
            {isClient ? (
              <Bar data={data} options={chartOptions} />
            ) : (
              <div className="animate-pulse bg-gray-700 rounded h-full flex items-center justify-center text-gray-400">
                Loading chart...
              </div>
            )}
          </div>
        </div>

        {/* Top Tokens Section - Desktop */}
        <div className="bg-[#1C1D1F] h-full rounded-lg p-4 border-4 border-[#292929]">
          <h3 className="text-lg font-semibold text-white mb-4">Top Tokens</h3>
          <div className="flex flex-col  h-[calc(100%-2rem)]">
            {topTokens.map((token, index) => {
              const isPositive = isPositiveChange(token.change)
              return (
                <div
                  key={index}
                  className="flex items-center justify-between mb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      <Image
                        src={token.logo}
                        width={24}
                        height={24}
                        alt={`${token.symbol} logo`}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">
                        {token.symbol}
                      </div>
                      <div className="text-xs text-gray-400">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white text-sm">
                      {token.amount} {token.unit}
                    </div>
                    <div
                      className={`text-xs flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {isPositive ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {token.change.replace(/^[+-]/, '')}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TreasuryPortfoliochat
