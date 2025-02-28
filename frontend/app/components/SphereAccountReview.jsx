"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Fill from '@/public/Images/sphere-fill.png'
const SphereAccountReview = ({
  groupName = 'Backstage Boys',
  members = 'Deon, John and Joshua',
  deployFee = '−0.0530 SOL',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div>
      <h1 className="text-lg font-semibold bg-gray-800 text-white py-2 px-4 mb-[-2]">Review your Sphere Account</h1>
      <div className="w-full max-w-md bg-gray-900 rounded-b-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-700 rounded-full mr-3 flex items-center justify-center">
            <Image src={Fill} alt=''></Image>
          </div>
          <h2 className="text-base font-medium text-white">{groupName}</h2>
      
        </div>
        <p className="text-sm text-gray-400">Members: {members}</p>

        <div className="mb-4">
          <div className="flex justify-between py-3 items-center">
            <p className="text-sm text-white">
              Deploy Fee{' '}
              <span
                className="text-gray-400 cursor-pointer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                ⓘ
              </span>
            </p>
            <p className="text-sm font-medium ">{deployFee}</p>
          </div>
          {showTooltip && (
            <div className="absolute bg-gray-800 text-white text-xs p-2 rounded-lg mt-1">
              More info about the deploy fee will go here.
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
              <span
                className="text-gray-400 mr-2 cursor-pointer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                ⓘ
              </span>
            This info section should explain why there is a {deployFee} deploy fee. Please the information should be quite detailed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SphereAccountReview;