'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import nft1 from '../../public/Images/nft1.png'
import nft2 from '../../public/Images/nft2.png'
import nft3 from '../../public/Images/nft3.png'
import nft4 from '../../public/Images/nft4.png'
import nft5 from '../../public/Images/nft5.png'
import nft6 from '../../public/Images/nft6.png'
import nft7 from '../../public/Images/nft7.png'
import nft8 from '../../public/Images/nft8.png'
import strk from '../../public/Images/strk.png'

export default function Tabs() {
  const [activeTab, setActiveTab] = useState('Tokens')

  // Token data matching the first image
  const tokens = [
    {
      coin: 'STRK',
      price: '$0.46',
      balance: '5',
      value: '$460.43',
      size: '25%',
    },
    {
      coin: 'STRK',
      price: '$0.46',
      balance: '2',
      value: '$700.20',
      size: '25%',
    },
    {
      coin: 'STRK',
      price: '$0.46',
      balance: '3',
      value: '$527.00',
      size: '50%',
    },
  ]

  // NFT data with correctly imported image objects
  const nfts = [
    {
      id: 1,
      image: nft1,
    },
    {
      id: 2,
      image: nft2,
    },
    {
      id: 3,
      image: nft3,
    },
    {
      id: 4,
      image: nft4,
    },
    {
      id: 5,
      image: nft5,
    },
    {
      id: 6,
      image: nft6,
    },
    {
      id: 7,
      image: nft7,
    },
    {
      id: 8,
      image: nft8,
    },
  ]

  return (
    <div className=" text-white">
      <div className="flex border-b border-[#292929]">
        <button
          onClick={() => setActiveTab('Tokens')}
          className={`px-4 py-2 relative ${
            activeTab === 'Tokens' ? 'font-bold text-white' : 'text-[#8E9BAE]'
          }`}
        >
          Tokens
          {activeTab === 'Tokens' && (
            <div className="absolute bottom-0 left-0 right-0 h-[.5px] bg-white"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('NFT')}
          className={`px-4 py-2 relative ${
            activeTab === 'NFT' ? 'font-bold text-white' : 'text-[#8E9BAE]'
          }`}
        >
          NFT Token Vaults
          {activeTab === 'NFT' && (
            <div className="absolute bottom-0 left-0 right-0 h-[.5px] bg-white"></div>
          )}
        </button>
      </div>

      {activeTab === 'Tokens' && (
        <div className="my-2 px-2 sm:px-4 md:px-8 py-2 sm:py-4 rounded-lg overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="flex text-xs sm:text-sm text-[#8E9BAE] font-semibold mb-1 gap-6">
              <div className="w-1/5">Coin</div>
              <div className="w-1/5">Price</div>
              <div className="w-1/5">Balance</div>
              <div className="w-1/5">Value</div>
              <div className="w-1/5">Size</div>
            </div>
            {tokens.map((token, index) => (
              <div
                key={index}
                className="flex items-center gap-6 rounded-lg px-3 py-3"
              >
                <div className="flex items-center gap-1 w-1/5">
                  <Image
                    src={strk}
                    width={18}
                    height={18}
                    alt="starknet token icon"
                  />
                  <span>{token.coin}</span>
                </div>
                <div className="w-1/5">{token.price}</div>
                <div className="w-1/5">{token.balance}</div>
                <div className="w-1/5">{token.value}</div>
                <div className="w-1/5 flex flex-col items-end">
                  <div className="relative w-full h-1 bg-[#292929] rounded-full">
                    <div
                      className="absolute top-0 left-0 h-1 bg-white rounded-full"
                      style={{ width: token.size }}
                    ></div>
                  </div>
                  <div className="text-[10px] sm:text-xs mt-1 text-right">
                    {token.size}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'NFT' && (
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {nfts.map((nft) => (
              <div
                key={nft.id}
                className="rounded-lg overflow-hidden bg-gray-800 border-2"
              >
                <div className="aspect-square relative">
                  <Image
                    src={nft.image}
                    alt={`NFT ${nft.id}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
