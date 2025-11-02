'use client'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { TokenInfo } from '@/lib'

interface WithdrawAmountProps {
  amount: string
  onChangeAmount: (e: React.ChangeEvent<HTMLInputElement>) => void
  selectedToken: string
  onChangeSelectedToken: (e: React.ChangeEvent<HTMLSelectElement>) => void
  availableTokens: (TokenInfo & { balance: number; usdValue?: number })[]
}

export default function WithdrawStepTwo({
  amount,
  onChangeAmount,
  onChangeSelectedToken,
  selectedToken,
  availableTokens,
}: WithdrawAmountProps) {
  const selectedTokenData = availableTokens.find(
    (t) => t.symbol === selectedToken,
  )

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className=" flex flex-col gap-5 md:p-6">
          <label className="block text-xl text-gray-500">Enter Amount</label>
          <div className="flex border border-[#24252A] rounded-lg p-4 text-white">
            <div className="flex-1 flex flex-col gap-2">
              <Input
                type="text"
                value={amount}
                onChange={(e) => onChangeAmount(e)}
                placeholder="0.00"
                className="text-[20px] md:text-[40px] leading-[48px] font-semibold h-[64px] bg-transparent border-none focus:ring-0 focus:border-transparent placeholder:text-white "
              />
              <div className=" text-sm text-gray-500">
                Balance: {selectedTokenData?.balance || 0} {selectedToken}
              </div>
            </div>
            <Select
              value={selectedToken}
              onChange={(e) => onChangeSelectedToken(e)}
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
      </div>
    </>
  )
}
