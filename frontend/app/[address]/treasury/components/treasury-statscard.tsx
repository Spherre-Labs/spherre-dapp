import React from 'react'
import Image from 'next/image'

type TreasuryStatscardProps = {
  totalTokens: number | string
  totalStakes: number | string
  totalNFTs: number | string
}

const TreasuryStatscard: React.FC<TreasuryStatscardProps> = ({
  totalTokens,
  totalStakes,
  totalNFTs,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-[15px] md:w-full mt-4 mx-1">
      <div className="bg-theme-bg-tertiary border border-theme-border flex items-center rounded-[10px] py-4 sm:py-6 lg:py-[25px] px-3 sm:px-6 lg:px-[28px] transition-colors duration-300">
        <div className="flex items-center justify-center rounded-xl w-10 h-10 sm:w-12 sm:h-12 bg-[#29292A] flex-shrink-0">
          <Image
            src={'/totaltokenIcon.png'}
            width={24}
            height={24}
            alt="Total Tokens Icon"
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
        </div>
        <div className="ml-3 sm:ml-4 min-w-0 flex-1">
          <div className="text-theme-secondary text-xs sm:text-sm lg:text-sm transition-colors duration-300">
            Total Tokens
          </div>
          <div className="text-xl sm:text-2xl lg:text-[45px] mt-2 font-semibold text-theme transition-colors duration-300">
            {totalTokens}
          </div>
        </div>
      </div>

      <div className="bg-theme-bg-tertiary border border-theme-border flex items-center rounded-[10px] py-4 sm:py-6 lg:py-[25px] px-3 sm:px-6 lg:px-[28px] transition-colors duration-300">
        <div className="flex items-center justify-center rounded-xl w-10 h-10 sm:w-12 sm:h-12 bg-[#29292A] flex-shrink-0">
          <Image
            src={'/totalStakeIcon.png'}
            width={24}
            height={24}
            alt="Total Stakes Icon"
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
        </div>
        <div className="ml-3 sm:ml-4 min-w-0 flex-1">
          <div className="text-theme-secondary text-xs sm:text-sm lg:text-sm transition-colors duration-300">
            Total Stakes
          </div>
          <div className="text-xl sm:text-2xl mt-2 lg:text-[45px] font-semibold text-theme transition-colors duration-300">
            {totalStakes}
          </div>
        </div>
      </div>

      <div className="bg-theme-bg-tertiary border border-theme-border flex items-center rounded-[10px] py-4 sm:py-6 lg:py-[25px] px-3 sm:px-6 lg:px-[28px] transition-colors duration-300 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-center rounded-xl w-10 h-10 sm:w-12 sm:h-12 bg-[#29292A] flex-shrink-0">
          <Image
            src={'/totalNftIcon.png'}
            width={24}
            height={24}
            alt="Total NFTs Icon"
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
        </div>
        <div className="ml-3 sm:ml-4 min-w-0 flex-1">
          <div className="text-theme-secondary text-xs sm:text-sm lg:text-sm transition-colors duration-300">
            Total NFTs
          </div>
          <div className="text-xl sm:text-2xl mt-2 lg:text-[45px] font-semibold text-theme transition-colors duration-300">
            {totalNFTs}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TreasuryStatscard
