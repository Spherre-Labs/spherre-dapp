import React from 'react'
import Image from 'next/image'
import { useTheme } from '@/app/context/theme-context-provider'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  onViewTransaction?: () => void
  title?: string
  message?: string
  closeLabel?: string
  viewLabel?: string
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  onViewTransaction,
  title = 'Successful Transaction!',
  message = 'Congratulations! your transaction has been successfully confirmed and been sent to other members of the team for approval',
  closeLabel = 'Close',
  viewLabel = 'View Transaction',
}) => {
  useTheme() // Initialize theme context

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-theme-bg-secondary rounded-2xl shadow-lg p-8 w-full max-w-xl mx-4 text-center flex flex-col items-center transition-colors duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-theme-bg-tertiary rounded-full p-2 hover:bg-theme-bg-secondary focus:outline-none transition-colors duration-300"
          aria-label="Close"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 6L6 18M6 6l12 12"
              className="text-theme-secondary"
            />
          </svg>
        </button>
        <div className="flex justify-center mb-4 mt-2">
          <Image
            src="/Images/confetti.png"
            alt="Success"
            width={80}
            height={80}
          />
        </div>
        <h2 className="text-3xl font-bold text-theme mb-2 transition-colors duration-300">
          {title}
        </h2>
        <p className="text-theme-secondary text-lg mb-8 transition-colors duration-300">
          {message}
        </p>
        <div className="flex w-full gap-4 mt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-theme-bg-tertiary text-theme py-3 rounded-lg hover:bg-theme-bg-secondary transition-colors font-medium"
          >
            {closeLabel}
          </button>
          <button
            onClick={onViewTransaction}
            className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            {viewLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessModal
