import React from 'react'

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
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-[#232326] rounded-2xl shadow-lg p-8 w-full max-w-md mx-4 text-center flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#35353A] rounded-full p-2 hover:bg-[#444] focus:outline-none"
          aria-label="Close"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              stroke="#A1A1AA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 6L6 18M6 6l12 12"
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
            <circle cx="40" cy="40" r="40" fill="#2C2323" />
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
        <h2 className="text-2xl font-bold text-white mb-4 mt-2">{title}</h2>
        <p className="text-gray-400 mb-6">{errorText}</p>
        <button
          onClick={onClose}
          className="w-full bg-[#35353A] text-white py-3 rounded-lg hover:bg-[#444] transition-colors font-medium"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default ErrorModal
