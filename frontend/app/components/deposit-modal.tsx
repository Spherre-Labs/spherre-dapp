'use client'

import { Button } from '@/components/shared/Button'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function DepositModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create portal element for the modal
    setPortalElement(document.getElementById('modal-root') || document.body)

    // Add event listener to handle clicking outside the modal
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    // Add event listener to handle ESC key
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscKey)
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <div className="space-y-4">
      <div onClick={openModal}>
        <Button variant="primary" icon="/card-recive-linear.svg">
          Deposit
        </Button>
      </div>
      {isOpen &&
        portalElement &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
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
                  onClick={closeModal}
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
                  Choose a preferred withdrawal process
                </p>

                <div className="space-y-3">
                  <button
                    className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left border-[#292929] border-2"
                    onClick={() => {
                      console.log('Deposit via address selected')
                      closeModal()
                    }}
                  >
                    <div className="p-1">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 10H10"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M20.833 11H18.231C16.446 11 15 12.343 15 14C15 15.657 16.447 17 18.23 17H20.833C20.917 17 20.958 17 20.993 16.998C21.533 16.965 21.963 16.566 21.998 16.065C22 16.033 22 15.994 22 15.917V12.083C22 12.006 22 11.967 21.998 11.935C21.962 11.434 21.533 11.035 20.993 11.002C20.958 11 20.917 11 20.833 11Z"
                          stroke="white"
                          stroke-width="1.5"
                        />
                        <path
                          d="M20.965 11C20.887 9.128 20.637 7.98 19.828 7.172C18.657 6 16.771 6 13 6H10C6.229 6 4.343 6 3.172 7.172C2.001 8.344 2 10.229 2 14C2 17.771 2 19.657 3.172 20.828C4.344 21.999 6.229 22 10 22H13C16.771 22 18.657 22 19.828 20.828C20.637 20.02 20.888 18.872 20.965 17"
                          stroke="white"
                          stroke-width="1.5"
                        />
                        <path
                          d="M6 5.99995L9.735 3.52295C10.2604 3.18165 10.8735 3 11.5 3C12.1265 3 12.7396 3.18165 13.265 3.52295L17 5.99995"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                        <path
                          d="M17.9922 14H18.003"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        Deposit Via Address
                      </p>
                      <p className="text-sm text-[#8E9BAE]">
                        Deposits to Spherre &#39;s internal wallet address.
                      </p>
                    </div>
                  </button>

                  <button
                    className="w-full flex items-center gap-3 p-3 rounded-lg  transition-colors text-left border-[#292929] border-2"
                    onClick={() => {
                      console.log('Deposit via connected wallet selected')
                      closeModal()
                    }}
                  >
                    <div className="p-1">
                      <svg
                        width="22"
                        height="21"
                        viewBox="0 0 22 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 8H9"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M19.833 9H17.231C15.446 9 14 10.343 14 12C14 13.657 15.447 15 17.23 15H19.833C19.917 15 19.958 15 19.993 14.998C20.533 14.965 20.963 14.566 20.998 14.065C21 14.033 21 13.994 21 13.917V10.083C21 10.006 21 9.967 20.998 9.935C20.962 9.434 20.533 9.035 19.993 9.002C19.958 9 19.917 9 19.833 9Z"
                          stroke="white"
                          stroke-width="1.5"
                        />
                        <path
                          d="M19.965 9C19.887 7.128 19.637 5.98 18.828 5.172C17.657 4 15.771 4 12 4H9C5.229 4 3.343 4 2.172 5.172C1.001 6.344 1 8.229 1 12C1 15.771 1 17.657 2.172 18.828C3.344 19.999 5.229 20 9 20H12C15.771 20 17.657 20 18.828 18.828C19.637 18.02 19.888 16.872 19.965 15"
                          stroke="white"
                          stroke-width="1.5"
                        />
                        <path
                          d="M5 3.99995L8.735 1.52295C9.2604 1.18165 9.87348 1 10.5 1C11.1265 1 11.7396 1.18165 12.265 1.52295L16 3.99995"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                        <path
                          d="M16.9922 12H17.003"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        Deposit Via Connected Wallet
                      </p>
                      <p className="text-sm text-[#8E9BAE]">
                        Deposit funds through a connected wallet.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          portalElement,
        )}
    </div>
  )
}
