'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import profile_image from '@/public/Images/profile2.png'
import capture_icon from '@/public/Images/capture.png'
import argent_wallet from '@/public/Images/argent_logo.png'
import { useRouter } from 'next/navigation'

const validateDisplayName = (name: string) => name.trim().length >= 3
const validateEmail = (email: string) =>
  email.includes('@') && email.includes('.')

const EditProfileContent = () => {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [editingEmail, setEditingEmail] = useState(false)
  const [walletId] = useState('352By...wtuya')
  const [showSuccess, setShowSuccess] = useState(false)

  // Load existing profile data from sessionStorage on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('profileData')
    if (savedData) {
      const profileData = JSON.parse(savedData)
      if (profileData.displayName) setDisplayName(profileData.displayName)
      if (profileData.email) setEmail(profileData.email)
    }
  }, [])

  const isDisplayNameValid = validateDisplayName(displayName)
  const isEmailValid = validateEmail(email)
  const isFormValid = isDisplayNameValid && isEmailValid

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    // Save updated profile to sessionStorage
    sessionStorage.setItem(
      'profileData',
      JSON.stringify({ displayName, email }),
    )

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      // Redirect to profile page after showing success
      router.push('/dapp/settings/profile')
    }, 1200)
  }

  const handleEmailEdit = () => {
    setEditingEmail((e) => !e)
  }

  return (
    <form className="w-full px-0" onSubmit={handleSave} autoComplete="off">
      {/* Avatar and camera icon */}
      <div className="flex items-center mb-8">
        <div className="relative w-[100px] h-[100px] group">
          <Image
            src={profile_image}
            alt="Profile"
            className="w-full h-full rounded-full object-cover bg-[#23242a] transition-opacity duration-200 group-hover:opacity-60"
          />
          <button
            className="absolute bottom-6 right-7 border-2 border-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            tabIndex={-1}
            type="button"
          >
            <Image src={capture_icon} alt="Edit" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Display Name */}
      <div className="mb-6">
        <label className="block text-white mb-2">Display Name</label>
        <input
          type="text"
          className={`w-full bg-[#23242a] text-[#8E9BAE] rounded-lg px-4 py-3 outline-none border ${
            isDisplayNameValid ? 'border-none' : 'border-red-500'
          }`}
          placeholder="Enter your display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        {!isDisplayNameValid && (
          <span className="text-red-500 text-sm">
            Display name must be at least 3 characters.
          </span>
        )}
      </div>

      {/* Linked Wallet and Wallet ID */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label className="block text-white mb-2">Linked Wallet</label>
          <div className="flex items-center bg-[#23242a] rounded-lg px-4 py-3">
            <Image
              src={argent_wallet}
              alt="Argent Wallet"
              className="w-6 h-6 mr-3"
            />
            <span className="text-[#8E9BAE]">Argent Wallet</span>
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-white mb-2">Wallet ID</label>
          <input
            type="text"
            className="w-full bg-[#23242a] text-[#8E9BAE] rounded-lg px-4 py-3 outline-none border-none"
            value={walletId}
            disabled
          />
        </div>
      </div>

      {/* Email Address */}
      <div className="mb-2">
        <label className="block text-white mb-2">Email Address</label>
        <div
          className={`flex items-center bg-[#23242a] rounded-lg px-4 py-3 ${
            isEmailValid ? '' : 'border border-red-500'
          }`}
        >
          <input
            type="email"
            className="flex-1 bg-transparent text-white outline-none border-none"
            value={email}
            disabled={!editingEmail}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="ml-4 bg-white text-black px-4 py-2 rounded"
            type="button"
            onClick={handleEmailEdit}
          >
            {editingEmail ? 'Save Email' : 'Edit Email Address'}
          </button>
        </div>
        {!isEmailValid && (
          <span className="text-red-500 text-sm">
            Enter a valid email address.
          </span>
        )}
      </div>
      <p className="text-[#8E9BAE] text-sm mt-4">
        This email will be used to notify you on the account multisig
        transactions{' '}
        <a href="#" className="text-[#a259ff]">
          <em>Learn More</em>
        </a>
      </p>

      {/* Save/Cancel Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          className="bg-[#a259ff] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#7c3aed] transition disabled:opacity-50"
          type="submit"
          disabled={!isFormValid}
        >
          Save Changes
        </button>
        <button
          className="bg-[#23242a] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#23242a]/80 transition"
          type="button"
          onClick={() => router.push('/dapp/settings/profile')}
        >
          Cancel
        </button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#f3e8ff] border border-[#6F2FCE] text-white px-6 py-3 rounded-lg shadow-lg font-semibold z-50">
          Profile updated successfully!
        </div>
      )}
    </form>
  )
}

export default function Page() {
  return <EditProfileContent />
}