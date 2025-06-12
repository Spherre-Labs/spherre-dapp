'use client'
import React, { useState, useEffect } from 'react'
import EmailModal from './EmailModal'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface EditProfileProps {
  onCancel?: () => void
}

export default function EditProfile({ onCancel }: EditProfileProps) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [showEditEmailModal, setShowEditEmailModal] = useState(false)
  const [email, setEmail] = useState('johndoe@gmail.com')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const walletName = 'Argent Wallet'

  // Handle redirect after success message
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        router.push('/dapp/settings/profile')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessMessage, router])

  const handleSaveChanges = async () => {
    setIsLoading(true)

    try {
      // Simulate API call - replace with your actual save logic
      await new Promise(resolve => setTimeout(resolve, 1000))

      const profileData = {
        displayName: displayName || 'Jack Lovermacazie',
        email: email,
        lastUpdated: new Date().toISOString()
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('profileData', JSON.stringify(profileData))
      }

      setShowSuccessMessage(true)
      // ✅ Let useEffect handle the redirect


    } catch (error) {
      console.error('Error saving profile:', error)
      // You could show an error toast here
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="bg-[#181A20] min-h-screen px-4 pt-4 pb-8 text-white">
      {/* Success Message Overlay */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#23242B] rounded-lg p-6 text-center max-w-sm mx-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Success!</h3>
            <p className="text-[#8E9BAE]">Profile updated successfully</p>
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-[#6F2FCE] h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
              <p className="text-xs text-[#8E9BAE] mt-2">Redirecting to profile...</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full rounded-xl p-8 shadow-lg">
        <div className="flex flex-col items-start mb-8">
          <div className="relative w-24 h-24 mb-2">
            <Image
              src="/Images/profile2.png"
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#181A20]"
              width={96}
              height={96}
            />
            <label className="absolute bottom-0 right-0 bg-[#6C47FF] p-2 rounded-full cursor-pointer border-2 border-[#23242B]">
              <input type="file" className="hidden" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-white"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="8.5" cy="10.5" r="1.5" fill="currentColor" />
                <path
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 19l-5.5-7-4.5 6-3-4-4 5"
                />
              </svg>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Display Name</label>
          <input
            type="text"
            placeholder="Enter your display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full h-[60px] rounded-[10px] px-[24px] py-[17px] bg-[#1C1D1F] text-white border-gray-700 focus:outline-none focus:border-[#6C47FF]"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 mb-8">
          <div className="flex-1 mb-4 md:mb-0">
            <label className="block text-gray-300 mb-2">Linked Wallet</label>
            <div className="flex items-center bg-[#1C1D1F] w-full h-[60px] rounded-[10px] px-[24px] py-[17px] gap-[10px] border-gray-700">
              <span>
                <Image
                  src="/Images/argent.png"
                  alt="Argent Wallet"
                  className="w-6 h-6 object-contain rounded-full"
                  width={24}
                  height={24}
                />
              </span>
              <span className="text-[#8E9BAE]">{walletName}</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex-1 flex-col gap-[10px]">
              <label className="block text-gray-300 mb-2">Wallet ID</label>
              <div className="flex items-center bg-[#1C1D1F] w-full h-[60px] rounded-[10px] px-[24px] py-[17px] gap-[10px] border-gray-700">
                <input
                  type="text"
                  placeholder="352By...wtuya"
                  className="text-[#8E9BAE] bg-transparent border-none focus:outline-none w-full"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 justify-start">
          <button
            className="min-w-[156.8px] h-[50px] rounded-[7px] px-[19.4px] py-[12.93px] flex items-center justify-center gap-[6.47px] bg-[#6F2FCE] hover:bg-[#7d5fff] text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSaveChanges}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
          <button
            className="w-[154px] h-[50px] rounded-[7px] px-[19.4px] py-[12.93px] flex items-center justify-center gap-[6.47px] bg-[#272729] hover:bg-[#353537] text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>

        <div className="mb-6 mt-10">
          <label className="block text-gray-300 mb-2">Email Address</label>
          <div className="flex items-center bg-[#232325] w-full rounded-[14px] px-6 py-4 mb-2">
            <span className="flex-1 text-white text-lg">{email}</span>
            <button
              className="bg-white text-black rounded-[7px] px-4 py-2 font-medium ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setShowEditEmailModal(true)}
              disabled={isLoading}
            >
              Edit Email Address
            </button>
          </div>
          <p className="text-[#8E9BAE] italic text-base">
            This email will be used to notify you on the account multisig
            transactions
            <a href="#" className="text-[#6F2FCE] ml-1 hover:underline">
              Learn More
            </a>
          </p>
        </div>

        <EmailModal
          open={showEditEmailModal}
          onClose={() => setShowEditEmailModal(false)}
          onSign={(newEmail) => {
            setEmail(newEmail)
            setShowEditEmailModal(false)
          }}
          title="Edit Email Address"
          initialEmail={email}
        />
      </div>
    </div>
  )
}