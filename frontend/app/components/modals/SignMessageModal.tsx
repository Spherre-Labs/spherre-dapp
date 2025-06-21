import React, { useState } from 'react'

interface SignMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onSign: (email: string) => void
  title: string
  description: string
}

const SignMessageModal: React.FC<SignMessageModalProps> = ({
  isOpen,
  onClose,
  onSign,
  title,
  description,
}) => {
  const [email, setEmail] = useState('')

  if (!isOpen) return null

  const handleSign = () => {
    onSign(email)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-[#1E1E1E] rounded-2xl shadow-lg p-8 w-full max-w-md mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
          <p className="text-gray-400 mb-6">{description}</p>
        </div>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-white text-sm font-medium mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="johndoe@gmail.com"
            className="w-full bg-[#2E2E2E] border border-[#3E3E3E] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#a259ff]"
          />
        </div>
        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="w-full bg-[#2E2E2E] text-white py-3 rounded-lg hover:bg-[#3E3E3E] transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSign}
            className="w-full bg-[#a259ff] text-white py-3 rounded-lg hover:bg-[#934de6] transition-colors"
          >
            Sign Message
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignMessageModal
