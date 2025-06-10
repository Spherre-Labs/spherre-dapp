import React, { useState, useEffect } from 'react'

interface EmailModalProps {
  open: boolean
  onClose: () => void
  onSign: (email: string) => void
  title?: string
  initialEmail?: string
}

const EmailModal: React.FC<EmailModalProps> = ({
  open,
  onClose,
  onSign,
  title = 'Add Email Address',
  initialEmail = '',
}) => {
  const [email, setEmail] = useState(initialEmail)

  useEffect(() => {
    setEmail(initialEmail)
  }, [initialEmail, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#232325] rounded-xl p-8 w-full max-w-md relative shadow-lg">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          {title}
        </h2>
        <p className="text-[#8E9BAE] text-center mb-6">
          Please provide your email address and sign the message to{' '}
          {title === 'Edit Email Address' ? 'update' : 'add'} it.
        </p>
        <label className="block text-white mb-2">Email Address</label>
        <input
          type="email"
          className="w-full mb-6 px-4 py-3 rounded-lg bg-[#29292A] text-white border-gray-700 focus:outline-none"
          placeholder="johndoe@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex gap-4">
          <button
            className="flex-1 bg-[#272729] text-white rounded-[7px] px-6 py-3 font-semibold transition"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="flex-1 bg-[#6F2FCE] hover:bg-[#7d5fff] text-white rounded-[7px] px-6 py-3 font-semibold transition"
            onClick={() => onSign(email)}
          >
            Sign Message
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmailModal
