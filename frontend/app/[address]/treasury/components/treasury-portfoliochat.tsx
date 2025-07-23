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
  loading: () => <div>Loading chart...</div>,
})

interface TreasuryPortfoliochatProps {
  data: import('chart.js').ChartData<'bar'>
  onPeriodChange: (date: string) => void
}

const TreasuryPortfoliochat = ({
  data,
  onPeriodChange,
}: TreasuryPortfoliochatProps) => {
  const [isClient, setIsClient] = useState(false)

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true)
    console.log('Client-side rendering enabled for TreasuryPortfoliochat')
  }, [])

  const topTokens = [
    {
      symbol: 'STRK',
      name: 'Starknet',
      amount: '0.23',
      unit: 'STRK',
      change: '+ 0.75%',
      logo: '/starknet.png',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: '0.23',
      unit: 'ETH',
      change: '- 0.25%',
      logo: '/Eth.png',
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      amount: '0.23',
      unit: 'USDT',
      change: '+0.54%',
      logo: '/Eth.png',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: '0.23',
      unit: 'ETH',
      change: '+0.75%',
      logo: '/Eth.png',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: '0.23',
      unit: 'ETH',
      change: '-1.23%',
      logo: '/Eth.png',
    },
  ]

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
        type: 'category' as const, // Use string literal type
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        },
      },
      y: {
        type: 'linear' as const, // Use string literal type
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
    onPeriodChange(period) // This will pass '1D', '7D', '1M', etc. to parent
  }



  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 lg:h-[445px] gap-6 mb-6">
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
              {/* Add dropdown menu here when implementing */}
            </div>
          </div>
        </div>
        <div className="h-96">
          {isClient ? (
            <Bar data={data} options={chartOptions} />
          ) : (
            <div>Loading chart...</div>
          )}
        </div>
      </div>

      <div className="bg-[#1C1D1F] h-full rounded-lg p-4 border-4 border-[#292929]">
        <h3 className="text-lg font-semibold text-white mb-4">Top Tokens</h3>
        <div className="flex flex-col justify-between h-[calc(100%-2rem)]">
          {topTokens.map((token, index) => {
            const isPositive = isPositiveChange(token.change)
            return (
              <div key={index} className="flex items-center justify-between">
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
                    {token.change.replace(/^[+-]/, '')}{' '}
                    {/* Remove the + or - sign since arrow shows direction */}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TreasuryPortfoliochat
