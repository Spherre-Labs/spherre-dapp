import React from 'react'

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
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-[#232326] rounded-2xl shadow-lg p-8 w-full max-w-xl mx-4 text-center flex flex-col items-center">
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
        <h2 className="text-3xl font-bold text-white mb-2 mt-2">{title}</h2>
        <p className="text-[#8E9BAE] text-lg mb-8">{subtitle}</p>
        {/* Spinner */}
        <div className="flex justify-center items-center mt-2">
          <div className="animate-spin rounded-full h-20 w-20 border-8 border-t-[#A259FF] border-b-[#232326] border-l-[#232326] border-r-[#232326] mx-auto" />
        </div>
      </div>
    </div>
  )
}

export default ProcessingModal
