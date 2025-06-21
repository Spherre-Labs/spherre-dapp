import React, { useState } from 'react'
import { X } from 'lucide-react'

interface AddEmailModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (email: string) => void
}

const AddEmailModal: React.FC<AddEmailModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [email, setEmail] = useState('')

  if (!isOpen) return null

  const handleSave = () => {
    onSave(email)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur">
      <div className="bg-[#1C1D1F] p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-white mb-2">
          Edit Email Address
        </h2>
        <p className="text-gray-400 mb-6">
          Please provide your email address and sign the message to add it.
        </p>
        <div className="mb-6">
          <label className="block text-white mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#23242a] text-white rounded-lg px-4 py-3"
            placeholder="johndoe@gmail.com"
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[#6F2FCE] text-white px-6 py-3 rounded-lg"
          >
            Sign Message
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEmailModal
