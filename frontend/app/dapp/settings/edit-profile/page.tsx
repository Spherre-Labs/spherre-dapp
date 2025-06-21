'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import profile_image from '@/public/Images/profile2.png'
import capture_icon from '@/public/Images/capture.png'
import argent_wallet from '@/public/Images/argent_logo.png'
import { useRouter } from 'next/navigation'

// Validation utility for display name (must be at least 3 characters).
const validateDisplayName = (name: string) => name.trim().length >= 3

// Basic email validation to check for '@' and '.' characters.
const validateEmail = (email: string) =>
  email.includes('@') && email.includes('.')

/**
 * A form component for editing user profile information, including display name and email.
 * It handles form validation, saving data to sessionStorage, and providing user feedback.
 */
const EditProfileContent = () => {
  const router = useRouter()

  // State management for form inputs and UI feedback.
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [editingEmail, setEditingEmail] = useState(false)
  const [walletId] = useState('352By...wtuya') // Hardcoded wallet ID.
  const [showSuccess, setShowSuccess] = useState(false)

  // On mount, load existing profile data from sessionStorage to pre-fill the form.
  useEffect(() => {
    const savedData = sessionStorage.getItem('profileData')
    if (savedData) {
      const profileData = JSON.parse(savedData)
      if (profileData.displayName) setDisplayName(profileData.displayName)
      if (profileData.email) setEmail(profileData.email)
    }
  }, [])

  // Memoized validation checks to avoid re-computation on every render.
  const isDisplayNameValid = validateDisplayName(displayName)
  const isEmailValid = validateEmail(email)
  const isFormValid = isDisplayNameValid && isEmailValid

  /**
   * Handles the form submission, saves the updated profile data,
   * shows a success message, and then redirects back to the profile page.
   * @param e - The form event.
   */
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    // Save updated profile data to sessionStorage.
    sessionStorage.setItem(
      'profileData',
      JSON.stringify({ displayName, email }),
    )

    // Show a temporary success message before redirecting.
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      router.push('/dapp/settings/profile')
    }, 1200)
  }

  // Toggles the editing state for the email input field.
  const handleEmailEdit = () => {
    setEditingEmail((prev) => !prev)
  }

  return (
    <form className="w-full px-0" onSubmit={handleSave} autoComplete="off">
      {/* Profile Avatar with Edit Button */}
      <div className="flex items-center mb-8">
        <div className="relative w-[100px] h-[100px] group">
          <Image
            src={profile_image}
            alt="Profile"
            className="w-full h-full rounded-full object-cover bg-[#23242a] transition-opacity duration-200 group-hover:opacity-60"
          />
          <button
            className="absolute bottom-6 right-7 border-2 border-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            tabIndex={-1} // Not focusable
            type="button"
          >
            <Image src={capture_icon} alt="Edit" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Display Name Input */}
      <div className="mb-6">
        <label className="block text-white mb-2">Display Name</label>
        <input
          type="text"
          className={`w-full bg-[#23242a] text-[#8E9BAE] rounded-lg px-4 py-3 outline-none border ${
            isDisplayNameValid ? 'border-transparent' : 'border-red-500'
          }`}
          placeholder="Enter your display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        {!isDisplayNameValid && (
          <span className="text-red-500 text-sm mt-1">
            Display name must be at least 3 characters.
          </span>
        )}
      </div>

      {/* Wallet Information */}
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

      {/* Email Address Input */}
      <div className="mb-2">
        <label className="block text-white mb-2">Email Address</label>
        <div
          className={`flex items-center bg-[#23242a] rounded-lg px-4 py-3 border ${
            isEmailValid ? 'border-transparent' : 'border-red-500'
          }`}
        >
          <input
            type="email"
            className="flex-1 bg-transparent text-white outline-none"
            value={email}
            disabled={!editingEmail}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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
          <span className="text-red-500 text-sm mt-1">
            Enter a valid email address.
          </span>
        )}
      </div>
      <p className="text-[#8E9BAE] text-sm mt-4">
        This email will be used to notify you on the account multisig
        transactions{' '}
        <a href="#" className="text-[#a259ff] hover:underline">
          <em>Learn More</em>
        </a>
      </p>

      {/* Form Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          className="bg-[#a259ff] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#7c3aed] transition-colors disabled:opacity-50"
          type="submit"
          disabled={!isFormValid}
        >
          Save Changes
        </button>
        <button
          className="bg-[#23242a] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#3a3b40] transition-colors"
          type="button"
          onClick={() => router.push('/dapp/settings/profile')}
        >
          Cancel
        </button>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 border border-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold z-50">
          Profile updated successfully!
        </div>
      )}
    </form>
  )
}

/**
 * The main page component that renders the EditProfileContent form.
 */
export default function Page() {
  return <EditProfileContent />
}
