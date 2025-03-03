'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Fill from '@/public/Images/sphere-fill.png'

const SphereAccountReview = ({
  groupName = 'Backstage Boys',
  members = 'Deon, John and Joshua',
  deployFee = '~0.0530 SOL',
}) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-[#272729] rounded-lg overflow-hidden">
      {/* Header */}
      <h1 className="text-lg sm:text-xl font-semibold bg-[#272729] h-16 flex items-center px-6 text-white">
        Review your Sphere Account
      </h1>

      {/* Content */}
      <div className="w-full bg-[#1C1D1F] p-6 rounded-b-lg">
        {/* Group Name */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mr-3">
            <Image src={Fill} alt="" className="w-6 h-6" />
          </div>
          <h2 className="font-['Nunito_Sans'] font-bold text-xl sm:text-2xl md:text-3xl leading-tight">
            {groupName}
          </h2>
        </div>

        {/* Members */}
        <p className="text-sm text-gray-400">Members: {members}</p>

        {/* Deploy Fee Section */}
        <div className="mb-4 relative">
          <div className="flex flex-wrap gap-6 py-3 items-center">
            <p className="text-sm text-white">
              Deploy Fee{' '}
              <span
                className="text-gray-400 cursor-pointer ml-2"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                ⓘ
              </span>
            </p>
            <p className="font-['Nunito_Sans'] font-bold text-xl sm:text-2xl md:text-3xl text-white">
              {deployFee}
            </p>
          </div>

          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute left-0 top-12 bg-gray-800 text-white text-xs p-2 rounded-lg w-52">
              More info about the deploy fee will go here.
            </div>
          )}

          {/* Info Text */}
          <p className="text-xs text-gray-500 mt-2">
            <span
              className="text-gray-400 mr-2 cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              ⓘ
            </span>
            This info section should explain why there is a {deployFee} deploy
            fee. Please the information should be quite detailed.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SphereAccountReview
