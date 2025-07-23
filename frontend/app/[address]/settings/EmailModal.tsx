import React, { useState, useEffect } from 'react'
import { useTheme } from '@/app/context/theme-context-provider'

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
  useTheme() // Initialize theme context
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
      <div className="bg-theme-bg-secondary rounded-xl p-8 w-full max-w-md relative shadow-lg transition-colors duration-300">
        <button
          className="absolute top-4 right-4 text-theme-secondary hover:text-theme text-2xl transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-theme mb-2 text-center transition-colors duration-300">
          {title}
        </h2>

        <p className="text-theme-secondary text-center mb-6 transition-colors duration-300">
          Please provide your email address and sign the message to{' '}
          {title === 'Edit Email Address' ? 'update' : 'add'} it.
        </p>

        <div className="mb-6">
          <label className="block text-theme mb-2 transition-colors duration-300">Email Address</label>
          <input
            type="email"
            className={`w-full px-4 py-3 rounded-lg bg-theme-bg-tertiary text-theme border focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300 ${
              isValidEmail ? 'border-theme-border' : 'border-red-500'
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
            className="flex-1 bg-theme-bg-tertiary text-theme rounded-[7px] px-6 py-3 font-semibold hover:bg-theme-bg-secondary transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className={`flex-1 bg-primary text-white rounded-[7px] px-6 py-3 font-semibold transition-colors ${
              email && isValidEmail
                ? 'hover:bg-primary/90 cursor-pointer'
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
