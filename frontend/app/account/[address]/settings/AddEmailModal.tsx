import React, { useState } from 'react'
import { useTheme } from '@/app/context/theme-context-provider'

interface AddEmailModalProps {
  open: boolean
  onClose: () => void
  onSave: (email: string) => void
}

const AddEmailModal: React.FC<AddEmailModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  useTheme() // Initialize theme context
  const [email, setEmail] = useState('')

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-theme-bg-secondary rounded-xl p-8 w-full max-w-md relative shadow-lg transition-colors duration-300">
        <button
          className="absolute top-4 right-4 text-theme-secondary hover:text-theme text-2xl transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-theme mb-2 text-center transition-colors duration-300">
          Add Email Address
        </h2>
        <p className="text-theme-secondary text-center mb-6 transition-colors duration-300">
          Please provide your email address and sign the message to add it.
        </p>
        <label className="block text-theme mb-2 transition-colors duration-300">
          Email Address
        </label>
        <input
          type="email"
          className="w-full mb-6 px-4 py-3 rounded-lg bg-theme-bg-tertiary text-theme border-theme-border focus:outline-none transition-colors duration-300"
          placeholder="johndoe@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex gap-4">
          <button
            className="flex-1 bg-theme-bg-tertiary text-theme rounded-[7px] px-6 py-3 font-semibold hover:bg-theme-bg-secondary transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-[7px] px-6 py-3 font-semibold transition-colors"
            onClick={() => onSave(email)}
          >
            Sign Message
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEmailModal
