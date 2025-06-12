'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import profile_image from '@/public/Images/profile2.png'
import argent_wallet from '@/public/Images/argent_logo.png'
import { useRouter } from 'next/navigation'

const ProfileContent = () => {
  const router = useRouter()

  // State for profile data
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const walletId = '352By...wtuya'

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

    // Listen to storage event for cross-tab sync (optional)
    window.addEventListener('storage', fetchProfile)

    return () => {
      window.removeEventListener('storage', fetchProfile)
    }
  }, [])

  return (
    <div className="w-full px-0">
      {/* Avatar */}
      <div className="flex items-center mb-8">
        <div className="relative w-[100px] h-[100px]">
          <Image
            src={profile_image}
            alt="Profile"
            className="w-full h-full rounded-full object-cover bg-[#23242a]"
          />
        </div>
      </div>

      {/* Display Name */}
      <div className="mb-6">
        <label className="block text-white mb-2">Display Name</label>
        <div className="w-full bg-[#23242a] text-[#8E9BAE] rounded-lg px-4 py-6">
          {displayName}
        </div>
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
          <div className="w-full bg-[#23242a] text-[#8E9BAE] rounded-lg px-4 py-3">
            {walletId}
          </div>
        </div>
      </div>

      {/* Email Address */}
      <div className="mb-2">
        <label className="block text-white mb-2">Email Address</label>
        <div className="flex items-center bg-[#23242a] rounded-lg px-4 py-6">
          <span className="flex-1 text-white">{email}</span>
        </div>
      </div>
      <p className="text-[#8E9BAE] text-sm mt-4">
        This email will be used to notify you on the account multisig
        transactions{' '}
        <a href="#" className="text-[#a259ff]">
          <em>Learn More</em>
        </a>
      </p>

      {/* Edit Profile Button */}
      <div className="flex gap-4 mt-8">
        <button
          className="bg-[#a259ff] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#7c3aed] transition"
          onClick={() => router.push('/dapp/settings/edit-profile')}
        >
          Edit Profile
        </button>
      </div>
    </div>
  )
}

export default function Page() {
  return <ProfileContent />
}
