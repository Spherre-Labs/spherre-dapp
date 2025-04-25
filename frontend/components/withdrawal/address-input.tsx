'use client'

import type React from 'react'

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
  // Simple validation for Ethereum-like addresses
  // In a real app, you would use a more robust validation
  const validateAddress = (address: string): boolean => {
    // Basic validation: starts with 0x and is 42 chars long (for Ethereum)
    // Or other custom validation logic for your specific blockchain
    if (!address) return false

    return (
      /^(0x)?[0-9a-fA-F]{40}$/.test(address) ||
      /^[A-Za-z0-9]{30,50}$/.test(address)
    ) // Generic fallback for other chains
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
    const dummyAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
    onChange(dummyAddress)
    onValidityChange(true)
  }

  return (
    <div>
      <div
        className={`flex items-center bg-[#1C1D1F] px-4 rounded-[10px]  
            ${showError ? 'border border-red-500' : 'border border-transparent'}`}
      >
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder="Write address, name of the recipient, strk, sol, glow..."
          className={`
            flex-grow  bg-transparent text-white  py-3 rounded-lg
            focus:outline-none 
          `}
        />
        <button
          onClick={handlePaste}
          className="ml-2 bg-white text-black px-4 py-1 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Paste
        </button>
        <button
          onClick={handleMySphereWallet}
          className="ml-2 bg-[#29292A] text-white px-4 py-1 rounded-lg hover:bg-gray-800 transition-colors"
        >
          My Spherre Wallet
        </button>
      </div>

      {showError && (
        <p className="text-red-500 text-sm mt-1">
          Please enter a valid wallet address
        </p>
      )}
    </div>
  )
}
