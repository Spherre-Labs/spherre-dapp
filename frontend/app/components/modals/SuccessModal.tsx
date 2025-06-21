import React from 'react'
import Image from 'next/image'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  message,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-[#1E1E1E] rounded-2xl shadow-lg p-8 w-full max-w-md mx-4 text-center">
        <div className="flex justify-center mb-4">
          <Image
            src="/Images/sphere-fill.png"
            alt="Success"
            width={80}
            height={80}
          />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Success!</h2>
        <p className="text-gray-400 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-[#a259ff] text-white py-3 rounded-lg hover:bg-[#934de6] transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}

export default SuccessModal
