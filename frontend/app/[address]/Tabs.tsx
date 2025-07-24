'use client'

import React, { useEffect, useState } from 'react'
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
import { useTheme } from '@/app/context/theme-context-provider'
import { getTokenImage } from '@/lib/utils/token_image'

export default function Tabs({
  loadingTokenData,
  tokens,
}: {
  loadingTokenData: boolean
  tokens: {
    coin: string
    price: string
    balance: string
    value: string
    size: string
    contract_address: `0x${string}`
    id: string
  }[]
}) {
  const [mounted, setMounted] = useState(false)
  useTheme()
  const [activeTab, setActiveTab] = useState('Tokens')
  const [tokenImages, setTokenImages] = useState<Record<string, string>>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchImages = async () => {
      const images: Record<string, string> = {}

      try {
        for (const token of tokens) {
          const imageUrl = await getTokenImage(token.id)
          if (imageUrl) images[token.coin] = imageUrl
        }
        setTokenImages(images)
      } catch (error) {
        console.error('Error fetching token images:', error)
      }
    }

    fetchImages()
  }, [tokens, mounted])

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

  if (!mounted) {
    return (
      <div className="bg-theme-bg-secondary border border-theme-border rounded-lg transition-colors duration-300">
        <div className="animate-pulse p-4">
          <div className="h-8 bg-theme-bg-tertiary rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-theme-bg-tertiary rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="text-theme transition-colors duration-300">
      <div className="flex border-b border-theme-border">
        <button
          onClick={() => setActiveTab('Tokens')}
          className={`px-3 sm:px-4 py-2 relative transition-colors duration-200 text-sm sm:text-base ${
            activeTab === 'Tokens'
              ? 'font-bold text-theme'
              : 'text-theme-secondary hover:text-theme'
          }`}
        >
          Tokens
          {activeTab === 'Tokens' && (
            <div className="absolute bottom-0 left-0 right-0 h-[.5px] bg-black dark:bg-white transition-colors duration-300"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('NFT')}
          className={`px-3 sm:px-4 py-2 relative transition-colors duration-200 text-sm sm:text-base ${
            activeTab === 'NFT'
              ? 'font-bold text-theme'
              : 'text-theme-secondary hover:text-theme'
          }`}
        >
          <span className="hidden sm:inline">NFT Token Vaults</span>
          <span className="sm:hidden">NFTs</span>
          {activeTab === 'NFT' && (
            <div className="absolute bottom-0 left-0 right-0 h-[0.5px] bg-black dark:bg-white transition-colors duration-300"></div>
          )}
        </button>
      </div>

      {activeTab === 'Tokens' &&
        (loadingTokenData ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-theme-border border-t-theme transition-colors duration-300"></div>
          </div>
        ) : (
          <div className="my-2 px-2 py-2 rounded-lg">
            {/* Mobile View - Card Layout */}
            <div className="block sm:hidden">
              {tokens.map((token) => (
                <div
                  key={token.coin}
                  className="mb-3 p-3 rounded-lg bg-theme-bg-secondary border border-theme-border hover:bg-theme-bg-tertiary transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Image
                        src={tokenImages[token.coin] || strk}
                        width={20}
                        height={20}
                        alt="token icon"
                      />
                      <span className="text-theme font-medium transition-colors duration-300">
                        {token.coin}
                      </span>
                    </div>
                    <div className="text-theme font-semibold transition-colors duration-300">
                      {token.price}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-theme-secondary">Balance: </span>
                      <span className="text-theme transition-colors duration-300">
                        {token.balance}
                      </span>
                    </div>
                    <div>
                      <span className="text-theme-secondary">Value: </span>
                      <span className="text-theme transition-colors duration-300">
                        {token.value}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-theme-secondary text-xs">Size</span>
                      <span className="text-theme-secondary text-xs">
                        {token.size}
                      </span>
                    </div>
                    <div className="relative w-full h-1 bg-theme-bg-tertiary rounded-full">
                      <div
                        className="absolute top-0 left-0 h-1 bg-gray-900 dark:bg-white rounded-full transition-colors duration-300"
                        style={{ width: token.size }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop/Tablet View - Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="flex text-xs sm:text-sm text-theme-secondary font-semibold mb-1 gap-6 transition-colors duration-300">
                  <div className="w-1/5">Coin</div>
                  <div className="w-1/5">Price</div>
                  <div className="w-1/5">Balance</div>
                  <div className="w-1/5">Value</div>
                  <div className="w-1/5">Size</div>
                </div>
                {tokens.map((token) => (
                  <div
                    key={token.coin}
                    className="flex items-center gap-6 rounded-lg px-3 py-3 hover:bg-theme-bg-tertiary transition-colors duration-200"
                  >
                    <div className="flex items-center gap-1 w-1/5">
                      <Image
                        src={tokenImages[token.coin] || strk}
                        width={18}
                        height={18}
                        alt="starknet token icon"
                      />
                      <span className="text-theme transition-colors duration-300">
                        {token.coin}
                      </span>
                    </div>
                    <div className="w-1/5 text-theme transition-colors duration-300">
                      {token.price}
                    </div>
                    <div className="w-1/5 text-theme transition-colors duration-300">
                      {token.balance}
                    </div>
                    <div className="w-1/5 text-theme transition-colors duration-300">
                      {token.value}
                    </div>
                    <div className="w-1/5 flex flex-col items-start gap-[3px]">
                      <div className="text-[10px] sm:text-sm mt-1 text-left text-theme-secondary transition-colors duration-300">
                        {token.size}
                      </div>
                      <div className="relative w-full h-1 rounded-full">
                        <div
                          className="absolute top-0 left-0 h-1 bg-gray-900 dark:bg-white rounded-full transition-colors duration-300"
                          style={{ width: token.size }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

      {activeTab === 'NFT' && (
        <div className="p-2 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {nfts.map((nft) => (
              <div
                key={nft.id}
                className="rounded-lg overflow-hidden bg-theme-bg-secondary border-2 border-theme-border hover:border-theme-border/80 transition-all duration-200"
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
