import React, { useContext, useState } from 'react'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import { SpherreAccountContext } from '@/app/context/account-context'
import { useAccountInfo } from '@/hooks/useSpherreHooks'
import { sliceWalletAddress } from '@/components/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

type TreasuryHeaderProps = {
  balance: number | string
  isBalanceVisible: boolean
  toggleBalance: () => void
  onWithdraw: () => void
  onDeposit: () => void
  onTrade: () => void
}

const TreasuryHeader = ({
  balance,
  isBalanceVisible,
  toggleBalance,
  onWithdraw,
  onDeposit,
  onTrade,
}: TreasuryHeaderProps) => {
  const { accountAddress } = useContext(SpherreAccountContext)
  const info = useAccountInfo(accountAddress || '0x0')
  const name = info.details?.name || 'Unnamed Account'
  const displayAddress = sliceWalletAddress(accountAddress)

  const avatarSrc = '/Images/avatar.png'

  // Track which action button is active
  const [activeAction, setActiveAction] = useState<string | null>(null)

  // Responsive + active/click effect logic
  const handleAction = (action: string, callback: () => void) => {
    setActiveAction(action)
    callback()
    // Optionally, reset active after a delay (for click effect only)
    setTimeout(() => setActiveAction(null), 300)
  }

  return (
    <div className="bg-[#6F2FCE] flex flex-col sm:flex-row justify-between rounded-lg text-white relative overflow-hidden p-4 sm:p-6 w-full">
      {/* wallet balance */}
      <div className="flex flex-col w-full sm:flex-1 sm:min-w-0 mb-4 sm:mb-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-white opacity-80">Wallet Balance</span>
          <button
            onClick={toggleBalance}
            className="text-white/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded"
            aria-label={isBalanceVisible ? 'Hide balance' : 'Show balance'}
          >
            {isBalanceVisible ? (
              <Eye size={24} className="sm:w-[30px] sm:h-[30px]" />
            ) : (
              <EyeOff
                color="white"
                size={24}
                className="text-white sm:w-[30px] sm:h-[30px]"
              />
            )}
          </button>
        </div>
        <div className="text-3xl sm:text-4xl font-bold mt-2 sm:mt-5 break-words">
          {isBalanceVisible ? `$${balance}` : '•••••'}
        </div>
      </div>

      {/* Account info and actions */}
      <div className="flex flex-col w-full sm:flex-1 sm:min-w-0 sm:justify-between sm:items-end gap-4">
        <div className="flex items-center gap-3 w-full sm:justify-end">
          <Avatar className="flex-shrink-0">
            <AvatarImage src={avatarSrc} alt={name} />
            <AvatarFallback>{name?.[0] || '?'}</AvatarFallback>
          </Avatar>
          <div className="text-left flex-1 sm:flex-initial sm:min-w-0">
            <div className="text-xs opacity-80 font-bold truncate sm:max-w-[120px]">
              {name}
            </div>
            <div className="text-xs opacity-60 mt-1 sm:mt-2 truncate">
              {displayAddress}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors justify-center focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base
              ${activeAction === 'withdraw' ? 'bg-black/80' : 'bg-black/60 hover:bg-black/80'}
            `}
            onClick={() => handleAction('withdraw', onWithdraw)}
            aria-pressed={activeAction === 'withdraw'}
            tabIndex={0}
          >
            <Image
              width={20}
              height={20}
              src="/walletIcon.png"
              alt="Withdraw"
              className="w-5 h-5 sm:w-6 sm:h-6 mr-1 flex-shrink-0"
            />
            <span className="whitespace-nowrap">Withdraw</span>
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors justify-center focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base
              ${activeAction === 'deposit' ? 'bg-black/80' : 'bg-white/20 hover:bg-white/30'}
            `}
            onClick={() => handleAction('deposit', onDeposit)}
            aria-pressed={activeAction === 'deposit'}
            tabIndex={0}
          >
            <Image
              width={20}
              height={20}
              src="/walletIcon.png"
              alt="Deposit"
              className="w-5 h-5 sm:w-6 sm:h-6 mr-1 flex-shrink-0"
            />
            <span className="whitespace-nowrap">Deposit</span>
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors justify-center focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base
              ${activeAction === 'trade' ? 'bg-black/80' : 'bg-white/20 hover:bg-white/30'}
            `}
            onClick={() => handleAction('trade', onTrade)}
            aria-pressed={activeAction === 'trade'}
            tabIndex={0}
          >
            <Image
              width={20}
              height={20}
              src="/tradeIcon.png"
              alt="Trade"
              className="w-5 h-5 sm:w-6 sm:h-6 mr-1 flex-shrink-0"
            />
            <span className="whitespace-nowrap">Trade</span>
          </button>
        </div>
      </div>

      <Image
        src="/Vector.png"
        alt="Treasury Background"
        width={500}
        height={500}
        className="absolute object-contain right-0 w-[20%] h-full opacity-50 pointer-events-none rounded-lg hidden sm:block"
      />
    </div>
  )
}

export default TreasuryHeader
