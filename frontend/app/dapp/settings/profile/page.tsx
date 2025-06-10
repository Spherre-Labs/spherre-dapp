'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import profile_image from '@/public/Images/profile2.png'
import capture_icon from '@/public/Images/capture.png'
import argent_wallet from '@/public/Images/argent_logo.png'

const ProfileContent = () => {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('jacklovermacazie@gmail.com')
  const [editingEmail, setEditingEmail] = useState(false)
  const [walletId] = useState('352By...wtuya')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleEmailEdit = () => {
    if (editingEmail) {
      // Save email
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    }
    setEditingEmail((e) => !e)
  }

  return (
    <div className="w-full px-0">
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
          className="w-full bg-[#23242a] text-[#8E9BAE] rounded-lg px-4 py-3 outline-none border-none"
          placeholder="Enter your display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
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

      {/* Save/Cancel Buttons */}
      <div className="flex gap-4 mb-8">
        <button className="bg-[#a259ff] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#7c3aed] transition">
          Save Changes
        </button>
        <button className="bg-[#23242a] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#23242a]/80 transition">
          Cancel
        </button>
      </div>

      {/* Email Address */}
      <div className="mb-2">
        <label className="block text-white mb-2">Email Address</label>
        <div className="flex items-center bg-[#23242a] rounded-lg px-4 py-3">
          <input
            type="email"
            className="flex-1 bg-transparent text-white outline-none border-none"
            value={email}
            disabled={!editingEmail}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="ml-4 bg-white text-black px-4 py-2 rounded"
            onClick={handleEmailEdit}
          >
            {editingEmail ? 'Save Email' : 'Edit Email Address'}
          </button>
        </div>
      </div>
      <p className="text-[#8E9BAE] text-sm mt-4">
        This email will be used to notify you on the account multisig
        transactions{' '}
        <a href="#" className="text-[#a259ff]">
          <em>Learn More</em>
        </a>
      </p>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#f3e8ff] border border-[#6F2FCE] text-white px-6 py-3 rounded-lg shadow-lg font-semibold z-50">
          Email updated successfully!
        </div>
      )}
    </div>
  )
}

export default ProfileContent
