'use client'

import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { routes } from '../[address]/layout'
import { useSpherreAccount } from '../context/account-context'



// Add props for controlled modal
interface DepositModalProps {
  open: boolean
  onClose: () => void
}


export default function DepositModal({ open, onClose }: DepositModalProps) {
  const [portalElement, setPortalElement] = React.useState<HTMLElement | null>(
    null,
  )
  const modalRef = useRef<HTMLDivElement>(null)
  const { accountAddress } = useSpherreAccount()

  useEffect(() => {
    setPortalElement(document.getElementById('modal-root') || document.body)

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
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

  if (!open || !portalElement) return null


  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-[#1C1D1F] border-[4px] py-[28px] px-[15px] border-[#292929] rounded-lg shadow-lg w-full max-w-[583px] mx-4 overflow-hidden text-center relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-4">
          <h2
            id="modal-title"
            className="text-3xl font-bold mx-auto text-white"
          >
            Deposit
          </h2>
          <button
            onClick={onClose}
            className="text-[#8E9BAE] hover:text-white hover:bg-gray-800 bg-gray-800 rounded-full p-1 transition-colors absolute top-4 right-4"
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
        <div className="p-4">
          <p className=" text-[#8E9BAE] font-semibold text-base mb-4">
            Choose a preferred deposit process
          </p>
          <div className="space-y-3">
            <Link href={routes(accountAddress).depositViaAddress}>
              <button
                className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left border-[#292929] border-2"
                onClick={onClose}
              >
                <div className="p-1">{/* Icon can go here */}</div>
                <div>
                  <p className="font-medium text-white">Deposit Via Address</p>
                  <p className="text-sm text-[#8E9BAE]">
                    Deposits to Spherre&apos;s internal wallet address.
                  </p>
                </div>
              </button>
            </Link>
            <Link href={routes(accountAddress).depositViaWallet}>
              <button
                className="w-full my-3 flex items-center gap-3 p-3 rounded-lg  transition-colors text-left border-[#292929] border-2"
                onClick={onClose}
              >
                <div className="p-1">{/* Icon can go here */}</div>
                <div>
                  <p className="font-medium text-white">
                    Deposit Via Connected Wallet
                  </p>
                  <p className="text-sm text-[#8E9BAE]">
                    Deposit funds through a connected wallet.
                  </p>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>,
    portalElement,
  )
}
