import React, { useState } from 'react'
import AddEmailModal from './AddEmailModal'
import Image from 'next/image'

interface ProfileOverviewProps {
  onEditProfile: () => void
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ onEditProfile }) => {
  const [showModal, setShowModal] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const handleEmailSign = (email: string) => {
    // Handle the signed email
    setUserEmail(email)
    setShowModal(false)
    // You can add additional logic here like API calls
    console.log('Email signed:', email)
  }

  return (
    <div className="w-full flex flex-col items-center bg-[#181A20] min-h-screen px-4 py-8">
      {/* Banner Add Email Address */}
      <div className="w-full max-w-5xl rounded-[10px] p-4 flex items-center justify-between mb-8 gap-4 bg-[#232325]">
        {/* Icon */}
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-[#A3ADC2]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="12" fill="currentColor" />
            <text
              x="12"
              y="17"
              textAnchor="middle"
              fontSize="18"
              fill="#181A20"
              fontWeight="bold"
            >
              !
            </text>
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-white">
            Add Email Address
          </h3>
          <p className="text-[#8E9BAE] text-sm mt-1">
            This email will be used to notify you on the account multisig
            transactions{' '}
            <a href="#" className="text-[#6F2FCE] hover:underline">
              Learn More
            </a>
          </p>
        </div>

        {/* Button */}
        <button
          className="bg-[#464655] hover:bg-[#525268] text-white rounded-[7px] px-6 py-2 font-medium transition-colors flex-shrink-0"
          onClick={() => setShowModal(true)}
        >
          Add Email Address
        </button>
      </div>

      {/* Profile Card */}
      <div className="flex flex-col items-center w-full mb-8">
        <div className="relative w-32 h-32 mb-4">
          <Image
            src="/Images/profile2.png"
            alt="Profile Avatar"
            width={128}
            height={128}
            className="w-32 h-32 rounded-full object-cover border-4 border-[#181A20]"
            onError={(e) => {
              // Fallback for missing image
              const target = e.target as HTMLImageElement
              target.src = '/placeholder-profile.jpg'
            }}
          />
          <div className="absolute bottom-2 right-2 bg-[#6C47FF] p-2 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-white mb-2">Han Solo</h2>

        <div className="bg-[#23242B] text-[#8E9BAE] px-4 py-2 rounded-lg text-sm mb-4 font-mono">
          G2520xec7Spherre520bb71f30523bcce4c10ad62teyw
        </div>

        <button
          className="bg-[#6F2FCE] hover:bg-[#7d5fff] text-white rounded-[7px] px-6 py-2 font-semibold transition-colors"
          onClick={onEditProfile}
        >
          Edit Profile
        </button>
      </div>

      {/* Profile Information Table */}
      <div className="w-full max-w-5xl bg-[#232325] rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#8E9BAE] text-base border-b border-[#2a2b32]">
                <th className="pb-3 font-medium">Email Address</th>
                <th className="pb-3 font-medium">Wallet Assigned Name</th>
                <th className="pb-3 font-medium">Wallet ID</th>
                <th className="pb-3 font-medium">Date Joined</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-white text-lg">
                <td className="py-4">
                  {userEmail || (
                    <span className="text-[#8E9BAE]">-------------</span>
                  )}
                </td>
                <td className="py-4">Han Solo</td>
                <td className="py-4 font-mono text-[#8E9BAE]">352By...wtuya</td>
                <td className="py-4">May 2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Modal */}
      <AddEmailModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSign={handleEmailSign}
      />
    </div>
  )
}

export default ProfileOverview
