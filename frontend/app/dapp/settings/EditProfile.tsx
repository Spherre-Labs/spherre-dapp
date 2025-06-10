'use client'

import React, { useState } from 'react'
import EmailModal from './EmailModal'
import Image from 'next/image'

interface EditProfileProps {
  onCancel?: () => void
}

export default function EditProfile({ onCancel }: EditProfileProps) {
  const [displayName, setDisplayName] = useState('')
  const [showEditEmailModal, setShowEditEmailModal] = useState(false)
  const [email, setEmail] = useState('johndoe@gmail.com') // example email

  const walletName = 'Argent Wallet'
  const walletId = '352By...wtuya'

  return (
    <div className="bg-[#181A20] min-h-screen px-4 pt-4 pb-8 text-white">
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
                  strokeWidth={1.5}
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
            className="w-full h-[60px] rounded-[10px] px-[24px] py-[17px] bg-[#1C1D1F] text-[#8E9BAE] border-gray-700 focus:outline-none focus:border-[#6C47FF]"
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
                  placeholder={walletId}
                  className="text-[#8E9BAE] bg-transparent border-none focus:outline-none w-full"
                  value={walletId}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 justify-start">
          <button className="min-w-[156.8px] h-[50px] rounded-[7px] px-[19.4px] py-[12.93px] flex items-center gap-[6.47px] bg-[#6F2FCE] hover:bg-[#7d5fff] text-white font-semibold transition">
            Save Changes
          </button>
          <button
            className="w-[154px] h-[50px] rounded-[7px] px-[19.4px] py-[12.93px] flex items-center justify-center gap-[6.47px] bg-[#272729] hover:bg-[#353537] text-white font-semibold transition"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>

        <div className="mb-6 mt-10">
          <label className="block text-gray-300 mb-2">Email Address</label>
          <div className="flex items-center bg-[#232325] w-full rounded-[14px] px-6 py-4 mb-2">
            <span className="flex-1 text-white text-lg">{email}</span>
            <button
              className="bg-white text-black rounded-[7px] px-4 py-2 font-medium ml-4"
              onClick={() => setShowEditEmailModal(true)}
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
          onSign={(newEmail: string) => {
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