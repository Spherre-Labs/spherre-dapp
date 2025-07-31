'use client'

import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { routes } from '@/lib/utils/routes'
import { useSpherreAccount } from '../context/account-context'
import { useTheme } from '@/app/context/theme-context-provider'

// Add props for controlled modal
interface DepositModalProps {
  open: boolean
  onClose: () => void
}

export default function DepositModal({ open, onClose }: DepositModalProps) {
  useTheme()
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
        className="bg-theme-bg-secondary border-[4px] py-[28px] px-[15px] border-theme-border rounded-lg shadow-lg w-full max-w-[583px] mx-4 overflow-hidden text-center relative transition-colors duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-4">
          <h2
            id="modal-title"
            className="text-3xl font-bold mx-auto text-theme transition-colors duration-300"
          >
            Deposit
          </h2>
          <button
            onClick={onClose}
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
        <div className="p-4">
          <p className="text-theme-secondary font-semibold text-base mb-4 transition-colors duration-300">
            Choose a preferred deposit process
          </p>
          <div className="space-y-3">
            <Link href={routes(accountAddress).depositViaAddress}>
              <button
                className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left border-theme-border border-2 bg-theme-bg-tertiary hover:bg-theme-bg-secondary"
                onClick={onClose}
              >
                <div className="p-1">{/* Icon can go here */}</div>
                <div>
                  <p className="font-medium text-theme transition-colors duration-300">
                    Deposit Via Address
                  </p>
                  <p className="text-sm text-theme-secondary transition-colors duration-300">
                    Deposits to Spherre&apos;s internal wallet address.
                  </p>
                </div>
              </button>
            </Link>
            <Link href={routes(accountAddress).depositViaWallet}>
              <button
                className="w-full my-3 flex items-center gap-3 p-3 rounded-lg  transition-colors text-left border-theme-border border-2 bg-theme-bg-tertiary hover:bg-theme-bg-secondary"
                onClick={onClose}
              >
                <div className="p-1">{/* Icon can go here */}</div>
                <div>
                  <p className="font-medium text-theme transition-colors duration-300">
                    Deposit Via Connected Wallet
                  </p>
                  <p className="text-sm text-theme-secondary transition-colors duration-300">
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
