'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import profile_image from '@/public/Images/profile2.png'
import argent_wallet from '@/public/Images/argent_logo.png'
import { useRouter } from 'next/navigation'
import AddEmailModal from '../AddEmailModal'
import { Info } from 'lucide-react'
import { useTheme } from '@/app/context/theme-context-provider'

/**
 * Renders the user's profile information.
 * It fetches data from sessionStorage and provides options to edit the profile
 * and add an email if one isn't already present.
 */
const ProfileContent = () => {
  const router = useRouter()
  useTheme()

  // State management for profile data and UI controls.
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [walletId] = useState('352By...wtuya') // Hardcoded wallet ID for display.

  // On component mount, fetch profile data from sessionStorage.
  useEffect(() => {
    const fetchProfile = () => {
      const savedData = sessionStorage.getItem('profileData')
      if (savedData) {
        const profileData = JSON.parse(savedData)
        if (profileData.displayName) setDisplayName(profileData.displayName)
        if (profileData.email) setEmail(profileData.email)
      }
    }

    fetchProfile()

    // Listen for storage events to sync profile data across tabs.
    window.addEventListener('storage', fetchProfile)

    // Cleanup the event listener on component unmount.
    return () => {
      window.removeEventListener('storage', fetchProfile)
    }
  }, [])

  /**
   * Saves the new email to both the component state and sessionStorage,
   * then closes the email modal.
   * @param newEmail - The new email address to save.
   */
  const handleSaveEmail = (newEmail: string) => {
    setEmail(newEmail)
    sessionStorage.setItem(
      'profileData',
      JSON.stringify({ displayName, email: newEmail }),
    )
    setIsModalOpen(false)
  }

  return (
    <div className="w-full px-0 overflow-x-hidden bg-theme transition-colors duration-300">
      {/* Notification to add an email if it's missing. */}
      {!email && (
        <div className="bg-theme-bg-secondary border border-theme-border p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3 transition-colors duration-300">
          <div className="flex items-start sm:items-center">
            <Info
              size={20}
              className="text-theme-muted mr-3 sm:mr-4 flex-shrink-0 mt-0.5 sm:mt-0"
            />
            <div>
              <h3 className="text-theme font-semibold text-sm sm:text-base">
                Add Email Address
              </h3>
              <p className="text-theme-secondary text-xs sm:text-sm mt-1">
                This email will be used to notify you on the account multisig
                transactions.{' '}
                <a
                  href="#"
                  className="text-primary hover:underline transition-colors duration-200"
                >
                  Learn More
                </a>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-theme-bg-tertiary text-theme px-3 sm:px-4 py-2 rounded-lg hover:opacity-80 transition-all duration-200 text-sm sm:text-base whitespace-nowrap border border-theme-border"
          >
            Add Email Address
          </button>
        </div>
      )}

      {/* Profile Avatar */}
      <div className="flex items-center mb-6 sm:mb-8">
        <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]">
          <Image
            src={profile_image}
            alt="Profile"
            className="w-full h-full rounded-full object-cover bg-theme-bg-secondary"
          />
        </div>
      </div>

      {/* Display Name */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-theme mb-2 text-sm sm:text-base">
          Display Name
        </label>
        <div className="w-full bg-theme-bg-secondary text-theme-secondary rounded-lg px-3 sm:px-4 py-4 sm:py-6 text-sm sm:text-base border border-theme-border transition-colors duration-300">
          {displayName || 'No display name set'}
        </div>
      </div>

      {/* Wallet Information */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="flex-1">
          <label className="block text-theme mb-2 text-sm sm:text-base">
            Linked Wallet
          </label>
          <div className="flex items-center bg-theme-bg-secondary rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-theme-border transition-colors duration-300">
            <Image
              src={argent_wallet}
              alt="Argent Wallet"
              className="w-5 h-5 sm:w-6 sm:h-6 mr-3"
            />
            <span className="text-theme-secondary text-sm sm:text-base">
              Argent Wallet
            </span>
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-theme mb-2 text-sm sm:text-base">
            Wallet ID
          </label>
          <div className="w-full bg-theme-bg-secondary text-theme-secondary rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-theme-border transition-colors duration-300">
            {walletId}
          </div>
        </div>
      </div>

      {/* Email Address Display */}
      <div className="mb-2">
        <label className="block text-theme mb-2 text-sm sm:text-base">
          Email Address
        </label>
        <div className="flex items-center bg-theme-bg-secondary rounded-lg px-3 sm:px-4 py-4 sm:py-6 border border-theme-border transition-colors duration-300">
          <span className="flex-1 text-theme text-sm sm:text-base">
            {email || 'No email address added'}
          </span>
        </div>
      </div>
      <p className="text-theme-secondary text-xs sm:text-sm mt-3 sm:mt-4">
        This email will be used to notify you on the account multisig
        transactions{' '}
        <a
          href="#"
          className="text-primary hover:underline transition-colors duration-200"
        >
          <em>Learn More</em>
        </a>
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
        <button
          className="bg-primary text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-base sm:text-lg hover:opacity-90 transition-all duration-200"
          onClick={() => router.push('/dapp/settings/edit-profile')}
        >
          Edit Profile
        </button>
      </div>

      {/* Email Modal */}
      <AddEmailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmail}
      />
    </div>
  )
}

/**
 * The main page component that renders the ProfileContent.
 */
export default function Page() {
  return <ProfileContent />
}
