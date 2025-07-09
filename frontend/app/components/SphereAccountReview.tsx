'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Fill from '@/public/Images/sphere-fill.png'
import { useOnboarding } from '@/context/OnboardingContext'

interface SphereAccountReviewProps {
  deployFee?: string
}

function shortenAddress(address: string): string {
  if (!address) return ''
  return address.slice(0, 6) + '...' + address.slice(-4)
}

const SphereAccountReview: React.FC<SphereAccountReviewProps> = ({
  deployFee = '~100 STRK',
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  // const [approvals, setApprovals] = useState<number>(1)
  const onboarding = useOnboarding()

  // Fallbacks in case context is not available
  const groupName = onboarding?.accountName || 'Unnamed Group'
  const members = onboarding?.members || []

  return (
    <div className="w-full ">
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
      <div className="text-sm text-gray-400 mb-2">Members:</div>
      <div className="flex gap-2 text-sm text-white mb-4 pl-4 list-disc">
        {members.length > 0 ? (
          members.map((addr: string) => (
            <p key={addr} className="break-all">
              {shortenAddress(addr)},
            </p>
          ))
        ) : (
          <p className="text-gray-500">No members added</p>
        )}
      </div>

      {/* Deploy Fee Section */}
      <div className="mb-4 relative">
        <div className="flex flex-wrap gap-6 py-3 items-center">
          <p className="text-sm text-theme">
            Deploy Fee{' '}
            <span
              className="text-gray-400 cursor-pointer ml-2"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              ⓘ
            </span>
          </p>
          <p className="font-['Nunito_Sans'] font-bold text-xl sm:text-2xl md:text-3xl text-theme">
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
            className="text-theme mr-2 cursor-pointer"
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
  )
}

export default SphereAccountReview
