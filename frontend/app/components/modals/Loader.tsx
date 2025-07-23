import React from 'react'
import { useTheme } from '@/app/context/theme-context-provider'

interface ProcessingModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
}

const ProcessingModal: React.FC<ProcessingModalProps> = ({
  isOpen,
  onClose,
  title = 'Processing Transaction!',
  subtitle = 'Please exercise a little patience as we process your details',
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
        <h2 className="text-3xl font-bold text-theme mb-2 mt-2 transition-colors duration-300">
          {title}
        </h2>
        <p className="text-theme-secondary text-lg mb-8 transition-colors duration-300">
          {subtitle}
        </p>
        {/* Spinner */}
        <div className="flex justify-center items-center mt-2">
          <div className="animate-spin rounded-full h-20 w-20 border-8 border-t-primary border-b-theme-bg-secondary border-l-theme-bg-secondary border-r-theme-bg-secondary mx-auto transition-colors duration-300" />
        </div>
      </div>
    </div>
  )
}

export default ProcessingModal
