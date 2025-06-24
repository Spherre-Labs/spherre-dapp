'use client'

import React from 'react'
import { useState } from 'react'
import { Edit3, HelpCircle, X } from 'lucide-react'
import Image from 'next/image'
import profile from '../../../../public/member2.svg'
import edit from '../../../../public/Images/edit.png'
import threshold_img from '../../../../public/Images/threshold.png'
import group from '../../../../public/Images/group-profile.png'
import starkneticon from '../../../../public/Images/starknet-icon.png'
import { useRouter } from 'next/navigation'

export default function MultisigWalletUI() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [threshold, setThreshold] = useState(1)
  const totalMembers = 3
  const router = useRouter()

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleThresholdChange = (value: number) => {
    setThreshold(value)
  }

  return (
    <div className="text-white p-2 sm:p-6">
      <div className="mx-auto">
        {/* Header */}
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-300 mb-4 sm:mb-8">
          All Multisig Wallets
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Main Wallet Card */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl px-3 sm:px-6 py-6 sm:py-14 relative overflow-hidden bg-wallet">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-8 relative z-10 gap-3 sm:gap-0">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <Image
                      src={profile}
                      width={50}
                      height={50}
                      alt="profile"
                      className="border-2 rounded-full sm:w-[70px] sm:h-[70px]"
                    />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-xl font-semibold text-white">
                      Backstage Boys
                    </h2>
                    <p className="text-emerald-100 text-xs sm:text-sm">G252...62Ievw</p>
                  </div>
                </div>

                <div className="flex items-center bg-white rounded-lg px-2 sm:px-3 py-1 sm:py-2 cursor-pointer mt-2 sm:mt-0">
                  <Image
                    src={starkneticon}
                    width={20}
                    height={20}
                    alt="profile"
                  />
                  <span className="text-black text-xs sm:text-sm font-medium">STRK</span>
                  <svg
                    className="w-4 h-4 ml-1 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Date and Balance */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between relative z-10 gap-3 sm:gap-0">
                <div>
                  <p className="text-emerald-100 text-xs sm:text-sm mb-1 sm:mb-2">
                    Date created:{' '}
                    <span className="text-white font-semibold">
                      March 12, 2025, 10:20 AM
                    </span>
                  </p>
                  <button className="bg-white backdrop-blur-sm text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-100 transition-all text-xs sm:text-base">
                    <Image src={edit} width={16} height={16} alt="edit" />
                    <span className="text-black font-semibold">
                      Manage Account
                    </span>
                  </button>
                </div>

                <div className="text-right mt-2 sm:mt-0">
                  <p className="text-emerald-100 text-xs sm:text-sm mb-1">
                    Available Balance
                  </p>
                  <p className="text-white text-3xl sm:text-5xl font-bold">$250.00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Create Multisig Card */}
          <div className="bg-[#1C1D1F] rounded-2xl p-3 sm:p-6 relative overflow-hidden mt-4 sm:mt-0">
            <div className="relative z-10">
              <h3 className="text-base sm:text-xl font-semibold text-white mb-2 sm:mb-4">
                Create a multisig Account
              </h3>
              <div className=" bg-coin h-[60px] sm:h-[108px] w-full"></div>
              <p className="text-purple-100 text-xs sm:text-sm my-2 sm:my-3 leading-relaxed">
                Secure Your Digital Assets Seamlessly. Add Members to your new
                Multisig Vault.
              </p>
              <button className="w-full bg-white bg-opacity-20 backdrop-blur-sm text-white py-2 sm:py-3 rounded-lg font-medium hover:bg-black/40 transition-all text-xs sm:text-base">
                Create Now
              </button>
            </div>
          </div>
        </div>

        {/* More Details Section */}
        <div className="mt-4 sm:mt-8">
          <h3 className="text-base sm:text-xl font-medium text-gray-400 mb-3 sm:mb-6">
            More Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            {/* Members Card */}
            <div className="bg-[#1C1D1F] rounded-xl p-3 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Image src={group} width={30} height={30} alt="group" />
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Members</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-5xl font-bold text-white">5</p>
                </div>
              </div>

              <button
                onClick={() => router.push('/dapp/members')}
                className="w-full bg-[#272729] hover:bg-black/40 text-white py-2 sm:py-3 rounded-lg font-medium transition-all text-xs sm:text-base"
              >
                Manage Members
              </button>
            </div>

            {/* Threshold Card */}
            <div className="bg-[#1C1D1F] rounded-xl p-3 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Image
                    src={threshold_img}
                    width={30}
                    height={30}
                    alt="threshold"
                  />
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-400 text-xs sm:text-sm">Threshold</p>
                    <HelpCircle className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-5xl font-bold text-white">3/5</p>
                </div>
              </div>

              <button
                onClick={openModal}
                className="w-full bg-[#272729] hover:bg-black/40 text-white py-2 sm:py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 text-xs sm:text-base"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Threshold</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-[#1C1D1F] rounded-2xl p-4 sm:p-8 mx-2 sm:mx-4 relative w-full max-w-[95vw] sm:max-w-lg">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8">
              <h2 className="text-lg sm:text-2xl font-bold text-white mb-2">
                Edit Threshold
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Please select the amount of approvals needed to confirm a
                transaction.
              </p>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-12 mb-6 sm:mb-8">
              {/* Members */}
              <div className="bg-[#272729] rounded-xl p-3 sm:p-6 text-center flex items-center justify-between">
                <div className="flex flex-col items-start gap-8">
                  <Image src={group} width={30} height={30} alt="group" />
                  <div className="text-gray-400 text-xs sm:text-sm">Members</div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {totalMembers}
                </div>
              </div>

              {/* Threshold */}
              <div className="bg-[#272729] gap-12 rounded-xl p-3 sm:p-6 text-center flex items-center justify-between">
                <div className="flex flex-col items-start gap-8">
                  <Image src={group} width={30} height={30} alt="group" />
                  <div className="text-gray-400 text-xs sm:text-sm">Threshold</div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {threshold}/{totalMembers}
                </div>
                <div className="flex flex-col items-start gap-8"></div>
              </div>
            </div>

            {/* Slider */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max={totalMembers}
                  value={threshold}
                  onChange={(e) =>
                    handleThresholdChange(parseInt(e.target.value))
                  }
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-gray-400 text-xs sm:text-sm mt-2">
                  {Array.from({ length: totalMembers }, (_, i) => (
                    <span key={i + 1}>{i + 1}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                onClick={closeModal}
                className="w-full sm:flex-1 bg-[#272729] text-white py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-800 transition-all text-xs sm:text-base"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Handle threshold update logic here
                  console.log('New threshold:', threshold)
                  closeModal()
                }}
                className="w-full sm:flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 sm:py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all text-xs sm:text-base"
              >
                Propose Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider {
          background: linear-gradient(
            to right,
            white 0%,
            white ${(threshold - 1) * (100 / (totalMembers - 1))}%,
            #374151 ${(threshold - 1) * (100 / (totalMembers - 1))}%,
            #374151 100%
          );
        }
      `}</style>
    </div>
  )
}
