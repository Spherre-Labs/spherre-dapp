'use client'

import { useState } from 'react'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'


interface Token {
  symbol: string
  balance: number
  icon?: string
  usdValue?: number
}

interface WithdrawAmountProps {
  onNext: () => void
  onCancel: () => void
  currentStep?: number
  onPrev?: () => void
}

export function WithdrawAmount({
  onNext,
  onCancel,
}: WithdrawAmountProps) {
  const [amount, setAmount] = useState<string>('')
  const [selectedToken, setSelectedToken] = useState<string>('STRK')
  const [availableTokens,] = useState<Token[]>([
    {
      symbol: 'STRK',
      balance: 10.0,
      icon: '/Images/starknet.svg',
      usdValue: 0.15,
    },
    {
      symbol: 'ETH',
      balance: 0.0,
      usdValue: 0,
    },
  ])

  // Validation
  const isValidAmount = () => {
    const numAmount = parseFloat(amount)
    const selectedTokenData = availableTokens.find(
      (t) => t.symbol === selectedToken,
    )
    return (
      !isNaN(numAmount) &&
      numAmount > 0 &&
      selectedTokenData &&
      numAmount <= selectedTokenData.balance
    )
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const handleNext = () => {
    if (isValidAmount()) {
      onNext()
    }
  }

  const selectedTokenData = availableTokens.find(
    (t) => t.symbol === selectedToken,
  )

  return (
    <div className="max-w-2xl mx-auto pr-6 md:p-6 space-y-6 flex flex-col  md:items-center w-full">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-4">
          Withdraw to Another Wallet
        </h1>
        <p className="text-gray-400">
          Please select the token and amount you wish to send
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className=" flex flex-col gap-5 md:p-6">
          <label className="block text-sm text-gray-400">Enter Amount</label>
          <div className="flex border border-[#272729] rounded-lg p-4 text-white">
            <div className="flex-1 flex flex-col gap-2">
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="text-[20px] md:text-[40px] leading-[48px] font-semibold h-[64px] bg-transparent border-none focus:ring-0 focus:border-transparent placeholder:text-white "
              />
              <div className=" text-sm text-gray-400">
                Balance: {selectedTokenData?.balance || 0} {selectedToken}
              </div>
            </div>
            <Select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="min-w-[130px] pl-10 pr-10 pt-4 pb-4"
              tokenIcon={selectedTokenData?.icon}
            >
              {availableTokens.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </Select>
          </div>

          <div className="mt-1 text-xs text-gray-500">
            USD Balance: $
            {(
              (selectedTokenData?.usdValue ?? 0) *
              (selectedTokenData?.balance ?? 0)
            ).toFixed(2)}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="flex-1 bg-[#272729] text-white hover:bg-[#323234] px-6 py-3 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!isValidAmount()}
            className="flex-1 bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
