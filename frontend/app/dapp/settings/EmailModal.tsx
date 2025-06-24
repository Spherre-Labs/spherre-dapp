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
  const [isValidEmail, setIsValidEmail] = useState(true)

  useEffect(() => {
    setEmail(initialEmail)
  }, [initialEmail, open])

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    setIsValidEmail(newEmail === '' || validateEmail(newEmail))
  }

  const handleSign = () => {
    if (email && validateEmail(email)) {
      onSign(email)
    } else {
      setIsValidEmail(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSign()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#232325] rounded-xl p-8 w-full max-w-md relative shadow-lg">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors"
          onClick={onClose}
          aria-label="Close modal"
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

        <div className="mb-6">
          <label className="block text-white mb-2">Email Address</label>
          <input
            type="email"
            className={`w-full px-4 py-3 rounded-lg bg-[#29292A] text-white border focus:outline-none focus:ring-2 focus:ring-[#6F2FCE] transition-colors ${
              isValidEmail ? 'border-gray-700' : 'border-red-500'
            }`}
            placeholder="johndoe@gmail.com"
            value={email}
            onChange={handleEmailChange}
            onKeyDown={handleKeyPress}
            autoFocus
          />
          {!isValidEmail && (
            <p className="text-red-500 text-sm mt-1">
              Please enter a valid email address.
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            className="flex-1 bg-[#272729] text-white rounded-[7px] px-6 py-3 font-semibold hover:bg-[#2f2f31] transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className={`flex-1 bg-[#6F2FCE] text-white rounded-[7px] px-6 py-3 font-semibold transition-colors ${
              email && isValidEmail
                ? 'hover:bg-[#7d5fff] cursor-pointer'
                : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={handleSign}
            disabled={!email || !isValidEmail}
          >
            Sign Message
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmailModal
