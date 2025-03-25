'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {Button} from "@/components/shared/Button";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState('Tokens')
  return (
    <>
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
          NFT Values
          {activeTab === 'NFT' && (
            <div className="absolute bottom-0 left-0 right-0 h-[.5px] bg-white"></div>
          )}
        </button>
      </div>

      {activeTab === 'Tokens' && (
        <div className="p-[20px] relative flex justify-center items-center">
          <div className="flex text-center flex-col gap-y-5 max-w-[500px]  items-center justify-center">
            <Image
              className="pt-1"
              height={225}
              width={287}
              src="empty_nft.svg"
              alt="Eye Icon"
            />
            <h3 className="text-[#FFFFFF] font-bold text-[30px]">
              There are no NFTs available
            </h3>
            <p className="text-[#8E9BAE]">
              First make a trade or transaction to view, buy and sell NFTs. Just make a transaction by clicking the button.</p>

            <Button
                variant="primary"
                icon="/arrows-exchange.svg"
            >
              Trade
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'NFT' && (
          <div className="p-[20px] relative flex justify-center items-center">
            <div className="flex text-center flex-col gap-y-5 max-w-[500px]  items-center justify-center">
              <Image
                  className="pt-1"
                  height={225}
                  width={287}
                  src="empty_nft.svg"
                  alt="Eye Icon"
              />
              <h3 className="text-[#FFFFFF] font-bold text-[30px]">
                There are no NFTs available
              </h3>
              <p className="text-[#8E9BAE]">
                First make a trade or transaction to view, buy and sell NFTs. Just make a transaction by clicking the button.</p>

              <Button
                  variant="primary"
                  icon="/arrows-exchange.svg"
              >
                Trade
              </Button>
            </div>
          </div>
      )}
    </>
  )
}
