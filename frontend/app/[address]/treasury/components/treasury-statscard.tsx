import React from 'react'
import Image from 'next/image'

type TreasuryStatscardProps = {
  totalTokens: number | string;
  totalStakes: number | string;
  totalNFTs: number | string;
};

const TreasuryStatscard: React.FC<TreasuryStatscardProps> = ({ totalTokens, totalStakes, totalNFTs }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6 w-[70%] mt-4">
       <div className="bg-[#1C1D1F] flex items-center rounded-lg p-4 border-4 border-theme-border">
        <div className="flex items-center justify-center rounded-xl  w-12 h-12  bg-[#29292A]">
          <Image
            src={'/totaltokenIcon.png'}
            width={500}
            height={500}
            alt="icon"
            className="text-gray-400 w-6 h-6"
          />
        </div>
        <div className='ml-4'>
          <div className="text-gray-400 text-sm">Total Tokens</div>
          <div className="text-2xl font-bold text-white">{totalTokens}</div>
        </div>
      </div>
      <div className="bg-[#1C1D1F] flex items-center rounded-lg p-4 border-4 border-theme-border">
        <div className="flex items-center justify-center rounded-xl  w-12 h-12  bg-[#29292A]">
          <Image
            src={'/totalStakeIcon.png'}
            width={500}
            height={500}
            alt="icon"
            className="text-gray-400 w-6 h-6"
          />
        </div>
        <div className='ml-4'>
          <div className="text-gray-400 text-sm">Total Stakes</div>
          <div className="text-2xl font-bold text-white">{totalStakes}</div>
        </div>
      </div>
      <div className="bg-[#1C1D1F] flex items-center rounded-lg p-4 border-4 border-theme-border">
        <div className="flex items-center justify-center rounded-xl  w-12 h-12  bg-[#29292A]">
          <Image
            src={'/totalNftIcon.png'}
            width={500}
            height={500}
            alt="icon"
            className="text-gray-400 w-6 h-6"
          />
        </div>
        <div className='ml-4'>
          <div className="text-gray-400 text-sm">Total NFTs</div>
          <div className="text-2xl font-bold text-white">{totalNFTs}</div>
        </div>
      </div>
    </div>
  )
}

export default TreasuryStatscard
