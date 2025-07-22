'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSpherreAccount } from '@/app/context/account-context'

interface EditProfileProps {
  onCancel?: () => void
}

export default function EditProfile({ onCancel }: EditProfileProps) {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('jacklovermacazie@gmail.com')
  const [editingEmail, setEditingEmail] = useState(false)

  const router = useRouter()
  const {accountAddress} = useSpherreAccount()

  // Image sources - make sure these paths exist in your public folder
  const profile_image = '/images/placeholder-profile.jpg'
  // const capture_icon = '/icons/camera-icon.svg'
  // const argent_wallet = '/icons/argent-wallet-icon.svg'

  const walletName = 'Argent Wallet'
  const walletId = '352By...wtuya'

  // Validation logic
  const isDisplayNameValid = displayName.length >= 3 || displayName.length === 0
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isFormValid = displayName.length >= 3 && isEmailValid

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      // Handle save logic here
      console.log('Saving profile...', { displayName, email })

      // Show success message or handle response
      alert('Profile saved successfully!')

      if (onCancel) {
        onCancel()
      }
    }
  }

  const handleEmailEdit = () => {
    if (editingEmail) {
      // Save email logic
      if (isEmailValid) {
        setEditingEmail(false)
        console.log('Email saved:', email)
      } else {
        alert('Please enter a valid email address')
      }
    } else {
      setEditingEmail(true)
    }
  }

  const handleCancel = () => {
    // Reset form to original state
    setDisplayName('')
    setEmail('jacklovermacazie@gmail.com')
    setEditingEmail(false)

    if (onCancel) {
      onCancel()
    } else {
      router.push(`/${accountAddress}/settings/profile`)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#1a1b23] min-h-screen p-6">
      <form className="w-full" onSubmit={handleSave} autoComplete="off">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Edit Profile</h1>
          <p className="text-[#8E9BAE]">Update your profile information</p>
        </div>

        {/* Avatar and camera icon */}
        <div className="flex items-center mb-8">
          <div className="relative w-[100px] h-[100px] group">
            <div className="w-full h-full rounded-full bg-[#23242a] overflow-hidden">
              <Image
                src={profile_image}
                alt="Profile"
                width={100}
                height={100}
                className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-60"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
            <button
              className="absolute bottom-2 right-2 bg-[#a259ff] border-2 border-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#7c3aed]"
              tabIndex={-1}
              type="button"
              onClick={() => console.log('Open image picker')}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Display Name */}
        <div className="mb-6">
          <label className="block text-white mb-2 font-medium">
            Display Name
          </label>
          <input
            type="text"
            className={`w-full bg-[#23242a] text-white placeholder-[#8E9BAE] rounded-lg px-4 py-3 outline-none transition-colors focus:ring-2 focus:ring-[#a259ff] ${
              !isDisplayNameValid && displayName.length > 0
                ? 'border border-red-500'
                : 'border border-transparent'
            }`}
            placeholder="Enter your display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          {!isDisplayNameValid && displayName.length > 0 && (
            <span className="text-red-500 text-sm mt-1 block">
              Display name must be at least 3 characters.
            </span>
          )}
        </div>

        {/* Linked Wallet and Wallet ID */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-white mb-2 font-medium">
              Linked Wallet
            </label>
            <div className="flex items-center bg-[#23242a] rounded-lg px-4 py-3 border border-transparent">
              <div className="w-6 h-6 bg-orange-500 rounded-full mr-3 flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-[#8E9BAE]">{walletName}</span>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-white mb-2 font-medium">
              Wallet ID
            </label>
            <input
              type="text"
              className="w-full bg-[#23242a] text-[#8E9BAE] rounded-lg px-4 py-3 outline-none border border-transparent cursor-not-allowed"
              value={walletId}
              disabled
              readOnly
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="mb-8">
          <label className="block text-white mb-2 font-medium">
            Email Address
          </label>
          <div
            className={`flex items-center bg-[#23242a] rounded-lg px-4 py-3 transition-colors ${
              editingEmail ? 'ring-2 ring-[#a259ff]' : ''
            } ${!isEmailValid && editingEmail ? 'border border-red-500' : 'border border-transparent'}`}
          >
            <input
              type="email"
              className="flex-1 bg-transparent text-white outline-none placeholder-[#8E9BAE]"
              value={email}
              disabled={!editingEmail}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
            <button
              className="bg-white text-black rounded-lg px-4 py-2 font-medium ml-4 hover:bg-gray-100 transition-colors text-sm"
              type="button"
              onClick={handleEmailEdit}
            >
              {editingEmail ? 'Save' : 'Edit'}
            </button>
          </div>
          {!isEmailValid && editingEmail && (
            <span className="text-red-500 text-sm mt-1 block">
              Please enter a valid email address.
            </span>
          )}
          <p className="text-[#8E9BAE] text-sm mt-2">
            This email will be used to notify you about multisig transactions.{' '}
            <a href="#" className="text-[#a259ff] hover:underline">
              Learn More
            </a>
          </p>
        </div>

        {/* Save/Cancel Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            className="bg-[#a259ff] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#7c3aed] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-initial"
            type="submit"
            disabled={!isFormValid}
          >
            Save Changes
          </button>
          <button
            className="bg-[#23242a] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2a2b32] transition-colors flex-1 sm:flex-initial"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
