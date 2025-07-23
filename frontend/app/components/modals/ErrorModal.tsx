import React from 'react'
import { useTheme } from '@/app/context/theme-context-provider'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  errorText?: string
  title?: string
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  errorText = 'An unexpected error occurred.',
  title = 'Error Occurred!',
}) => {
  useTheme() // Initialize theme context
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-theme-bg-secondary rounded-2xl shadow-lg p-8 w-full max-w-md mx-4 text-center flex flex-col items-center transition-colors duration-300">
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
        {/* Big Red X Icon */}
        <div className="flex justify-center mb-4 mt-2">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="40" cy="40" r="40" fill="currentColor" className="text-red-900/20" />
            <path
              d="M28 28L52 52"
              stroke="#FF4D4F"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M52 28L28 52"
              stroke="#FF4D4F"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-theme mb-4 mt-2 transition-colors duration-300">{title}</h2>
        <p className="text-theme-secondary mb-6 transition-colors duration-300">{errorText}</p>
        <button
          onClick={onClose}
          className="w-full bg-theme-bg-tertiary text-theme py-3 rounded-lg hover:bg-theme-bg-secondary transition-colors font-medium"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default ErrorModal
