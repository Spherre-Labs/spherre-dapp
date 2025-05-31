"use client";

import React, { useState } from 'react';

const tabs = [
  'Profile',
  'Wallet & Account',
  'Preferences',
  'Security',
  'SmartWill',
  'Smart Lock',
];

export default function EditProfile() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [displayName, setDisplayName] = useState('');

  const walletName = 'Argent Wallet';
  const walletId = '352By...wtuya';

  return (
    <div className="bg-[#181A20] min-h-screen p-8 text-white">
      <div className="flex justify-center">
        <div className="flex w-[1144px] h-[48px] bg-[#23242B] rounded-[5px] p-[9px_8px] gap-[10px] mb-8"
          style={{ padding: '9px 8px' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-1.5 rounded-[5px] font-medium focus:outline-none transition-colors duration-150 text-sm h-full ${
                activeTab === tab
                  ? 'bg-[#29292A] text-white'
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
              style={{ minWidth: '120px' }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="ml-[60px] w-[1144px] rounded-xl p-8 shadow-lg">
        <div className="flex flex-col items-start mb-8">
          <div className="relative w-24 h-24 mb-2">
            <img
              src="/Images/profile2.png"
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#181A20]"
            />
            <label className="absolute bottom-0 right-0 bg-[#6C47FF] p-2 rounded-full cursor-pointer border-2 border-[#23242B]">
              <input type="file" className="hidden" />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="8.5" cy="10.5" r="1.5" fill="currentColor" />
                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 19l-5.5-7-4.5 6-3-4-4 5" />
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
            className="w-[1144px] h-[60px] rounded-[10px] px-[24px] py-[17px] bg-[#1C1D1F] text-[#8E9BAE] border-gray-700 focus:outline-none focus:border-[#6C47FF]"
          />
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 mb-8">
          <div className="flex-1 mb-4 md:mb-0">
            <label className="block text-gray-300 mb-2">Linked Wallet</label>
            <div className="flex items-center bg-[#1C1D1F] w-[561px] h-[60px] rounded-[10px] px-[24px] py-[17px] gap-[10px] border-gray-700">
              <span>
                <img src="/Images/argent.png" alt="Argent Wallet" className="w-6 h-6 object-contain rounded-full" />
              </span>
              <span className="text-[#8E9BAE]">{walletName}</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex-1 flex-col gap-[10px]">
              <label className="block text-gray-300 mb-2">Wallet ID</label>
              <div className="flex items-center bg-[#1C1D1F] w-[561px] h-[60px] rounded-[10px] px-[24px] py-[17px] gap-[10px] border-gray-700">
                <input type="text" placeholder="352By...wtuya" className="text-[#8E9BAE] bg-transparent border-none focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 justify-start">
          <button
            className="min-w-[156.8px] h-[50px] rounded-[7px] px-[19.4px] py-[12.93px] flex items-center gap-[6.47px] bg-[#6F2FCE] hover:bg-[#7d5fff] text-white font-semibold transition"
          >
            Save Changes
          </button>
          <button className="w-[154px] h-[50px] rounded-[7px] px-[19.4px] py-[12.93px] flex items-center justify-center gap-[6.47px] bg-[#272729] hover:bg-[#353537] text-white font-semibold transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
