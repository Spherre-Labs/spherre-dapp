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
import Loader from '../components/modals/Loader'
import { getTokenImage } from '@/lib/utils/token_image'
import { useAccountInfo } from '../../hooks/useSpherreHooks'
import { useContext } from 'react'
import { SpherreAccountContext } from '../context/account-context'

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

  const { accountAddress } = useContext(SpherreAccountContext)

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
    <div className="bg-theme-bg-secondary border border-theme-border rounded-lg transition-colors duration-300">
      <div className="flex border-b border-theme-border">
        {['Tokens', 'NFT'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium text-sm transition-all duration-300 ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary bg-theme-bg-tertiary'
                : 'text-theme-secondary hover:text-theme hover:bg-theme-bg-tertiary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Tokens' &&
        (loadingTokenData ? (
          <div className="p-4 flex justify-center">
            <Loader />
          </div>
        ) : (
          <div className="p-4">
            <div className="space-y-4">
              {tokens.map((token, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-theme-bg-tertiary transition-colors duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                      {tokenImages[token.coin] ? (
                        <Image
                          src={tokenImages[token.coin]}
                          alt={token.coin}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={strk}
                          alt={token.coin}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-theme transition-colors duration-300">
                        {token.coin}
                      </p>
                      <p className="text-sm text-theme-secondary transition-colors duration-300">
                        ${token.price}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-theme transition-colors duration-300">
                      {token.balance}
                    </p>
                    <p className="text-sm text-theme-secondary transition-colors duration-300">
                      {token.value}
                    </p>
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
        ))}

      {activeTab === 'NFT' && (
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
