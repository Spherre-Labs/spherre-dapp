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
import { useTheme } from '@/app/context/theme-context-provider'

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
  useTheme()
  const [isClient, setIsClient] = useState(false)

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true)
    console.log('Client-side rendering enabled for TreasuryPortfoliochat')
  }, [])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
    },
    animation: false as const,
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
          maxTicksLimit: 10,
        },
      },
      y: {
        type: 'linear' as const,
        grid: {
          color: '#374151',
        },
        ticks: {
          color: '#6b7280',
          maxTicksLimit: 8,
        },
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
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
    <div className="w-full max-w-full mb-4 md:mb-7">
      {/* Mobile Layout: Stacked */}
      <div className="block lg:hidden w-full space-y-4">
        <div className="w-full flex flex-col items-center justify-center py-4">
          <h2 className="text-lg font-bold text-theme mb-2">
            Portfolio Overview
          </h2>
        </div>

        {/* Chart Section - Mobile */}
        <div
          className="w-full bg-theme-bg-secondary rounded-[10px] p-3 sm:p-4 border-2 border-theme-border transition-colors duration-300"
          style={{ maxWidth: '100vw', boxSizing: 'border-box' }}
        >
          {/* Header Controls - Mobile Layout */}
          <div className="flex flex-col space-y-3 mb-4 w-full">
            {/* Legend */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary flex-shrink-0"></div>
                <span className="text-xs sm:text-sm text-theme-secondary whitespace-nowrap">
                  Tokens
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-pink-300 dark:bg-[#FF7BE9] flex-shrink-0"></div>
                <span className="text-xs sm:text-sm text-theme-secondary whitespace-nowrap">
                  NFTs
                </span>
              </div>
            </div>

            {/* Time Period Buttons */}
            <div className="flex items-center justify-center w-full">
              <div className="flex items-center gap-0.5 sm:gap-1 bg-theme-bg-tertiary rounded-lg p-0.5 sm:p-1 transition-colors duration-300 max-w-full overflow-x-auto">
                <div className="flex gap-0.5 sm:gap-1 min-w-max">
                  {['1D', '7D', '1M', '3M', '1Y'].map((period) => (
                    <button
                      key={period}
                      onClick={() => handlePeriodChange(period)}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex-shrink-0 whitespace-nowrap ${
                        selectedPeriod === period
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-theme-secondary hover:text-theme hover:bg-theme-bg-secondary'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Select Dates - Hidden on mobile */}
            <div className="hidden sm:flex items-center justify-center gap-2">
              <Calendar
                size={14}
                className="text-theme-secondary flex-shrink-0"
              />
              <button className="flex items-center gap-2 bg-theme-bg-tertiary rounded-md px-3 py-1.5 text-xs text-theme-secondary hover:bg-theme-bg-secondary transition-colors whitespace-nowrap">
                <span>Select Dates</span>
                <ChevronDown
                  size={12}
                  className="text-theme-secondary flex-shrink-0"
                />
              </button>
            </div>
          </div>

          {/* Chart Container - Mobile */}
          <div className="w-full h-64 sm:h-80 relative">
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {isClient ? (
                <div
                  style={{ width: '100%', height: '100%', maxWidth: '100%' }}
                >
                  <Bar data={data} options={chartOptions} />
                </div>
              ) : (
                <div className="animate-pulse bg-theme-bg-tertiary rounded h-full flex items-center justify-center text-theme-secondary">
                  Loading chart...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Tokens Section - Mobile */}
        <div className="w-full max-w-full bg-theme-bg-secondary rounded-[10px] p-3 sm:p-4 border-2 border-theme-border transition-colors duration-300">
          <h3 className="text-base sm:text-lg font-semibold text-theme mb-3 sm:mb-4">
            Top Tokens
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            {topTokens.map((token, index) => {
              const isPositive = isPositiveChange(token.change)
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-theme-bg-tertiary border border-theme-border transition-colors duration-300 min-w-0 w-full"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <Image
                        src={token.logo}
                        width={20}
                        height={20}
                        alt={`${token.symbol} logo`}
                        className="sm:w-6 sm:h-6"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-theme text-xs sm:text-sm truncate">
                        {token.symbol}
                      </div>
                      <div className="text-xs text-theme-secondary truncate">
                        {token.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="font-medium text-theme text-xs sm:text-sm whitespace-nowrap">
                      {token.amount} {token.unit}
                    </div>
                    <div
                      className={`text-xs flex items-center gap-1 justify-end whitespace-nowrap ${
                        isPositive ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                      ) : (
                        <ArrowDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
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
        <div className="lg:col-span-3 h-full bg-theme-bg-secondary rounded-[10px] p-4 border-4 border-theme-border transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            {/* Left: Token/NFT Legend */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm text-theme-secondary">Tokens</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-300 dark:bg-[#FF7BE9]"></div>
                <span className="text-sm text-theme-secondary">NFTs</span>
              </div>
            </div>
            {/* Center: Time Period Buttons */}
            <div className="flex items-center gap-1 bg-theme-bg-tertiary rounded-lg p-1 transition-colors duration-300">
              {['1D', '7D', '1M', '3M', '1Y'].map((period) => (
                <button
                  key={period}
                  onClick={() => handlePeriodChange(period)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                    selectedPeriod === period
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-theme-secondary hover:text-theme hover:bg-theme-bg-secondary'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
            {/* Right: Select Dates Dropdown */}
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-theme-secondary" />
              <div className="relative">
                <button className="flex items-center gap-2 bg-theme-bg-tertiary rounded-md px-3 py-2 text-sm text-theme-secondary hover:bg-theme-bg-secondary transition-colors">
                  <span>Select Dates</span>
                  <ChevronDown size={14} className="text-theme-secondary" />
                </button>
              </div>
            </div>
          </div>
          <div className="h-96">
            {isClient ? (
              <Bar data={data} options={chartOptions} />
            ) : (
              <div className="animate-pulse bg-theme-bg-tertiary rounded h-full flex items-center justify-center text-theme-secondary">
                Loading chart...
              </div>
            )}
          </div>
        </div>
        {/* Top Tokens Section - Desktop */}
        <div className="bg-theme-bg-secondary h-full rounded-[10px] p-4 border-4 border-theme-border transition-colors duration-300">
          <h3 className="text-lg font-semibold text-theme mb-4">Top Tokens</h3>
          <div className="flex flex-col h-[calc(100%-2rem)]">
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
                      <div className="font-medium text-theme text-sm">
                        {token.symbol}
                      </div>
                      <div className="text-xs text-theme-secondary">
                        {token.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-theme text-sm">
                      {token.amount} {token.unit}
                    </div>
                    <div
                      className={`text-xs flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}
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
