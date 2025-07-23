import React from 'react'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'

type TreasuryHeaderProps = {
  balance: number | string
  isBalanceVisible: boolean
  toggleBalance: () => void
}

const TreasuryHeader = ({
  balance,
  isBalanceVisible,
  toggleBalance,
}: TreasuryHeaderProps) => {
  return (
    <div className="bg-[#6F2FCE] h-44 flex  justify-between rounded-lg  text-white relative overflow-hidden">
      {/* wallet balance */}
      <div className="mb-4 flex flex-col  p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-white opacity-80">Wallet Balance</span>
          <button
            onClick={toggleBalance}
            className="text-white/60 hover:text-white"
          >
            {isBalanceVisible ? (
              <Eye size={30} />
            ) : (
              <EyeOff color="white" size={30} className="text-white" />
            )}
          </button>
        </div>
        <div className="text-4xl font-bold mt-5">
          {isBalanceVisible ? `$${balance}` : '•••••'}
        </div>
      </div>

      <div className="flex flex-col p-6 justify-between items-end">
        <div className=" flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-2">
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-sm font-bold text-white">
              B
            </div>
          </div>
          <div className="text-left">
            <div className="text-xs opacity-80 font-bold">Backstage Boys</div>
            <div className="text-xs opacity-60 mt-2">0257...62tgw</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black/40 transition-colors">
            <Image
              width={50}
              height={50}
              src="/walletIcon.png"
              alt="Coinbase"
              className="w-6 h-6 mr-1"
            />
            Withdraw
          </button>
          <button className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/30 transition-colors">
            <Image
              width={50}
              height={50}
              src="/walletIcon.png"
              alt="Coinbase"
              className="w-6 h-6 mr-1"
            />
            Deposit
          </button>
          <button className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/30 transition-colors">
            <Image
              width={50}
              height={50}
              src="/tradeIcon.png"
              alt="Coinbase"
              className="w-6 h-6 mr-1"
            />
            Trade
          </button>
        </div>
      </div>

      <Image
        src="/Vector.png"
        alt="Treasury Background"
        width={500}
        height={500}
        className="absolute object-contain right-0  w-[20%] h-full  opacity-50 pointer-events-none rounded-lg"
      />
    </div>
  )
}

export default TreasuryHeader
