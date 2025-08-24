'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSpherreAccount } from '../context/account-context'
import { useTheme } from '@/app/context/theme-context-provider'
import { nfts } from '../account/[address]/Tabs'
import Image from 'next/image'
import { useProposeNFTTransaction } from '@/lib'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { RiVerifiedBadgeFill } from 'react-icons/ri'
import { ERC721Address, randomRecipient } from '@/lib/contracts/erc721'
import { cairo } from 'starknet'

// Add props for controlled modal
interface DepositModalProps {
  open: number | undefined
  onClose: (val: number | undefined) => void
  // nft: {
  //   id: number,
  //   image: string,
  // }
}

export default function NFTDetailsModal({ open, onClose }: DepositModalProps) {
  useTheme()
  const [portalElement, setPortalElement] = React.useState<HTMLElement | null>(
    null,
  )
  const [isSending, setIsSending] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const { accountAddress } = useSpherreAccount()

  const {
    writeAsync: proposeNFTTransaction,
    error: proposalError,
    isLoading: nftProposalIsLoading,
  } = useProposeNFTTransaction(accountAddress ?? ('' as `0x${string}`))

  const handleProposeNFTTransaction = async () => {
    setIsSending(true)

    try {
      await proposeNFTTransaction({
        nft_contract: ERC721Address as `0x${string}`,
        token_id: cairo.uint256('1'),
        // Mint some nfts to your spherre account before trying this. Mint the one with the token id 1
        recipient: randomRecipient as `0x${string}`,
      })
    } catch (err) {
      console.error((err as Error).message)
      if (proposalError) console.error(proposalError)
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    setPortalElement(document.getElementById('modal-root') || document.body)

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(undefined)
      }
    }
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose(undefined)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'auto'
    }
  }, [open, onClose])

  console.log(open)
  const currentNFT = nfts.find((nft) => {
    if (!open) return
    return nft.id === open
  })
  console.log(currentNFT)

  if (!open || !portalElement) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-theme-bg-secondary border-[4px] py-[28px] px-[15px] border-theme-border rounded-lg shadow-lg w-full max-w-[883px] mx-4 overflow-hidden text-center relative transition-colors duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-4">
          <h2
            id="modal-title"
            className="text-3xl font-bold mx-auto text-theme transition-colors duration-300"
          >
            NFT Details
          </h2>
          <button
            onClick={() => onClose(undefined)}
            className="text-theme-secondary hover:text-theme hover:bg-theme-bg-tertiary bg-theme-bg-tertiary rounded-full p-1 transition-colors absolute top-4 right-4"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="p-4 flex justify-between items-start">
          <Image
            alt="current nft"
            width={400}
            height={400}
            src={currentNFT?.image || ''}
          />

          <div className="w-full flex flex-col items-start gap-2 px-6">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 rounded-full">
                <AvatarImage src={'/nft-avatar.png'} />
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
              <p>Jacksonito</p>
              <RiVerifiedBadgeFill color="#8C62F2" />
            </div>

            <div className="">
              <p>yhahhiHIHI</p>
            </div>

            <div className="w-full flex flex-col gap-5 text-[14px] mt-2 mb-4">
              <p className="flex justify-between">
                <span className="text-[#8E9BAE]">TOKEN ID</span>
                <span className="text-[#8C62F2]">45634 &#8599;</span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#8E9BAE]">Token Standard</span>
                <span className="text-[#8E9BAE]">ERC345</span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#8E9BAE]">Collection Number</span>
                <span className="text-[#8E9BAE]"># 23</span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#8E9BAE]">Chain</span>
                <span className="text-[#8E9BAE]">Ethereum</span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#8E9BAE]">Mint Address</span>
                <span className="text-[#8E9BAE]">ahagagfugsaugdi &#8599;</span>
              </p>
            </div>

            <Button
              className="w-full bg-[#8C62F2] text-secondary"
              onClick={handleProposeNFTTransaction}
              disabled={isSending || nftProposalIsLoading}
            >
              Send
            </Button>

            <div className="w-full flex justify-between gap-6 mt-2">
              <Button className={`w-full bg-theme-bg-secondary`}>List</Button>
              <Button className="w-full bg-theme-bg-secondary">
                Place Bid
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    portalElement,
  )
}
