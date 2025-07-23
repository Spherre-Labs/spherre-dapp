'use client'
import { useState } from 'react'
import Image from 'next/image'
import Usdt from '@/public/Images/usdt.png'
import Backstage from '@/public/Images/backstageboys.png'
import Arrow from '@/public/Images/Arrow.png'
import { SPHERRE_ACCOUNT_ABI, useScaffoldReadContract } from '@/lib'

interface WithdrawalReviewPageProps {
  recipientAddress: string
  amount: string
  selectedToken: string
  availableTokens: Array<{
    symbol: string
    balance: number
    icon?: string
    usdValue?: number
    address?: string
    decimal?: number
  }>
  spherreAccountAddress: `0x${string}` | null
}

export default function WithdrawalReviewPage({
  recipientAddress,
  amount,
  selectedToken,
  availableTokens,
  spherreAccountAddress,
}: WithdrawalReviewPageProps) {
  const [note, setNote] = useState<string>('')

  // Get selected token data
  const selectedTokenData = availableTokens.find(
    (t) => t.symbol === selectedToken,
  )

  // Calculate USD value
  const usdValue = selectedTokenData?.usdValue || 0
  const amountInUSD = parseFloat(amount) * usdValue

  // Format recipient address for display
  const formatAddress = (address: string) => {
    if (!address || address.length <= 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const { data } = useScaffoldReadContract({
    contractConfig: {
      address: spherreAccountAddress || '',
      abi: SPHERRE_ACCOUNT_ABI,
    },
    functionName: 'get_name',
    args: {},
    watch: true,
    enabled: !!spherreAccountAddress,
  })

  console.log(data)

  // Transaction data using real values
  const transactionData = {
    amount: amount || '0',
    tokenSymbol: selectedToken,
    recipientAddress: formatAddress(recipientAddress),
    recipientFullAddress: recipientAddress,
    fromAccount: {
      name: data || 'Spherre Account', // Use actual account name from contract
      address: spherreAccountAddress || '',
      avatar: Backstage,
    },
    toAccount: {
      name: `${selectedToken} Chain`,
      avatar: selectedTokenData?.icon || Usdt,
    },
    fee: '$0.0',
    total: `$${amountInUSD.toFixed(2)}`,
    usdAmount: amountInUSD,
  }

  return (
    <>
      <div className=" text-center">
        <div className="flex items-center justify-center gap-1 mb-6">
          <span className="text-gray-400 text-lg font-bold">Send</span>
          <span className="text-xl font-bold">{transactionData.amount}</span>
          <span className="text-xl font-bold text-gray-400">
            {transactionData.tokenSymbol}
          </span>
          <span className="text-gray-400 text-lg font-bold">to</span>
          <span className="text-xl font-bold">
            {transactionData.recipientAddress}
          </span>
        </div>

        <div className="flex items-center justify-center mb-10">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2">
              <Image
                src={transactionData.fromAccount.avatar}
                alt={transactionData.fromAccount.name}
                width={80}
                height={80}
              />
            </div>
            <p className="text-sm text-gray-400 mt-3">From</p>
            <p className="font-semibold">{transactionData.fromAccount.name}</p>
            <p className="text-sm text-gray-500 bg-gray-100 bg-opacity-15 p-2 rounded-md mt-3 ">
              {formatAddress(transactionData.fromAccount.address)}
            </p>
          </div>

          <div className="mx-6 sm:mx-10 mb-[4em]">
            <Image
              src={Arrow}
              alt="Arrow"
              width={200}
              height={24}
              className=" "
            />
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2">
              <Image
                src={transactionData.toAccount.avatar}
                alt={transactionData.toAccount.name}
                width={80}
                height={80}
              />
            </div>
            <p className="text-sm text-gray-400 mt-3">To</p>
            <p className="font-semibold">{transactionData.toAccount.name}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 bg-opacity-15 p-2 rounded-md mt-3">
              <span className="text-white text-sm">
                {transactionData.recipientAddress}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17M13 3H21V11M11 13L20.2929 3.70711"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className=" rounded-lg p-5 mb-6">
          <h3 className="font-semibold text-lg text-left mb-4">
            Order Summary
          </h3>

          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Amount</span>
            <span>
              {transactionData.amount} {transactionData.tokenSymbol}
            </span>
          </div>

          <div className="flex justify-between items-center mb-2 ">
            <span className="text-gray-400">USD Value</span>
            <span className="text-lg font-bold">
              ${transactionData.usdAmount.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Transaction Fee</span>
            <span className="text-lg font-bold">{transactionData.fee}</span>
          </div>

          <div className="flex justify-between items-center border-t border-gray-700 pt-2">
            <span className="text-white font-semibold">Total</span>
            <span className="text-lg font-bold">{transactionData.total}</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-left text-gray-400 mb-2">Note</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a note here..."
            className="w-full p-4 bg-transparent border border-gray-700 rounded-lg text-white resize-none focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            rows={3}
          />
        </div>
      </div>
    </>
  )
}
