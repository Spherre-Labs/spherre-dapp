'use client'

import type React from 'react'
import { useTheme } from '@/app/context/theme-context-provider'
import { useAccount } from '@starknet-react/core'

interface AddressInputProps {
  value: string
  onChange: (value: string) => void
  onValidityChange: (isValid: boolean) => void
  onBlur?: () => void
  showError?: boolean
}

export default function AddressInput({
  value,
  onChange,
  onValidityChange,
  onBlur,
  showError = false,
}: AddressInputProps) {
  useTheme()
  const { address } = useAccount()

  // Simple validation for Ethereum-like addresses
  // In a real app, you would use a more robust validation
  const validateAddress = (address: string): boolean => {
    // Basic validation: starts with 0x and is 42 chars long (for Ethereum)
    // Or other custom validation logic for your specific blockchain
    if (!address) return false

    // This is a simplified validation - in a real app you would use a more robust check
    // that's specific to the blockchain you're targeting
    // Check if it matches the StarkNet address format
    return /^0x[a-fA-F0-9]{64}$/.test(address)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    onValidityChange(validateAddress(newValue))
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      onChange(text)
      onValidityChange(validateAddress(text))
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err)
    }
  }

  const handleMySphereWallet = () => {
    // This would be implemented in a real app
    console.log('My Spherre Wallet button clicked')
    // For now, we'll just set a dummy valid address
    if (address) {
      onChange(address)
      onValidityChange(validateAddress(address))
    }
  }

  return (
    <div>
      <div
        className={`flex flex-col sm:flex-row items-stretch sm:items-center bg-theme-bg-secondary px-3 sm:px-4 rounded-[10px] transition-colors duration-300
         ${showError ? 'border border-red-500' : 'border border-theme-border'}`}
      >
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder="Write address, name of the recipient, strk, sol, glow..."
          className="flex-grow bg-transparent text-theme py-3 rounded-lg focus:outline-none placeholder:text-theme-muted text-sm sm:text-base transition-colors duration-300"
        />
        <div className="flex mb-3 sm:mb-0 space-x-2 sm:ml-2">
          <button
            onClick={handlePaste}
            className="bg-theme-bg-secondary text-theme hover:bg-theme-bg-tertiary px-3 sm:px-4 py-1 rounded-lg transition-colors duration-200 text-xs sm:text-sm"
          >
            Paste
          </button>
          <button
            onClick={handleMySphereWallet}
            className="bg-theme-bg-tertiary border border-theme-border text-theme px-3 sm:px-4 py-1 rounded-lg hover:bg-theme-bg-secondary transition-colors duration-200 text-xs sm:text-sm"
          >
            My Spherre Wallet
          </button>
        </div>
      </div>

      {showError && (
        <p className="text-red-500 text-xs sm:text-sm mt-1">
          Please enter a valid wallet address
        </p>
      )}
    </div>
  )
}
