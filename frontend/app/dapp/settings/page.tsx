// Changes made:
// 1. Improved overall padding and margin consistency
// 2. Used responsive Tailwind classes (e.g., w-full, max-w-md, md:flex-row) where appropriate
// 3. Added responsive breakpoints for layout adaption
// 4. Used flex-wrap and responsive widths to enhance mobile friendliness
// 5. Added overflow-hidden or adjusted width for elements with fixed size

'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PenLine, Users, BookX, CircleX } from 'lucide-react'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'

interface Items {
  name: string
  route: string
}

const Settings = () => {
  const Menubar: Items[] = [
    { name: 'Profile', route: '/dapp/settings' },
    { name: 'Wallet & Account', route: '/dapp/settings' },
    { name: 'Preferences', route: '/dapp/settings' },
    { name: 'Security', route: '/dapp/settings' },
    { name: 'SmartWill', route: '/dapp/settings' },
    { name: 'Smart Lock', route: '/dapp/settings' },
  ]

  const [thresholdModal, setThresholdModal] = useState(false)
  const [thresholdValue, setThresholdValue] = useState(3)

  const handleChange = (event: Event, newValue: number) => {
    setThresholdValue(newValue)
  }

  const handleSave = () => {
    localStorage.setItem('threshold-value', thresholdValue.toString())
  }

  useEffect(() => {
    const saved = localStorage.getItem('threshold-value')
    if (saved) {
      setThresholdValue(Number(saved))
    }
  }, [])

  return (
    <div className="px-4 sm:px-6">
      <div className="py-4">
        <div className="bg-gradient-to-b from-[#1c1d1f] to-[#181a1c] rounded-md">
          <ul className="px-4 py-2 flex flex-wrap gap-4 sm:gap-8 text-[16px]">
            {Menubar.map((item) => (
              <li
                key={item.name}
                className="staggered-item menu-item-animation"
              >
                <Link
                  href={item.route}
                  className="flex items-center px-4 py-1 rounded-lg sidebar-transition sidebar-menu-item text-gray-400 hover:text-white"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-2 text-[18px]">
        <h1 className="text-gray-400">All Mutlisig Wallets</h1>
        <div className="flex flex-col lg:flex-row pt-4 gap-6">
          <div className="w-full lg:w-[650px] h-[250px] bg-green-400 rounded-lg">
            <div className="flex flex-col justify-between h-full gap-4 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-red-500">
                    <Image
                      src="/Images/Profile.png"
                      alt="Profile"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      Backstage Boys
                    </p>
                    <p className="text-gray-400 text-xs truncate w-36">
                      G252...62teyw
                    </p>
                  </div>
                </div>
                <button className="text-black bg-white py-2 px-4 text-[12px] rounded-md">
                  STRK
                </button>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-[14px] text-gray-400">
                    Date created: March 12, 2025, 10:20 AM
                  </p>
                  <div className="pt-2">
                    <button className="flex gap-2 text-black bg-white py-2 px-4 text-[14px] rounded-md">
                      <PenLine className="size-5" />
                      Manage Account
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[12px]">Available balance</p>
                  <p className="text-[36px]">$250.00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[350px] h-[250px] bg-gradient-to-b from-[#1c1d1f] to-[#181a1c] rounded-lg">
            <div className="flex flex-col h-full justify-between py-4 px-4">
              <div className="text-[16px]">Create a Multisig Account</div>
              <div className="py-6 text-center">[Image Placeholder]</div>
              <p className="text-[12px] text-gray-400">
                Secure Your Digital Assets Seamlessly. Add Members to your new
                Multisig Vault.
              </p>
              <div className="text-center">
                <button className="bg-gray-400 w-full rounded-md py-2">
                  Create now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {thresholdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-[#272729] rounded-lg p-6 shadow-lg animate-slide-up w-[90%] max-w-md">
            <CircleX
              className="absolute top-4 right-4 text-white cursor-pointer"
              onClick={() => setThresholdModal(false)}
            />
            <h1 className="text-[24px] font-semibold text-white mb-4 text-center">
              Edit Threshold
            </h1>
            <p className="text-center text-[14px] text-gray-400 mb-4">
              Please select the amount of approvals needed to confirm a
              transaction.
            </p>
            <div className="flex gap-4 mb-4">
              <div className="flex justify-between w-1/2 bg-gradient-to-b from-[#1c1d1f] to-[#181a1c] rounded-md p-4">
                <div className="flex flex-col items-center">
                  <Users />
                  <div>Members</div>
                </div>
                <div className="text-[24px]">5</div>
              </div>
              <div className="flex justify-between w-1/2 bg-gradient-to-b from-[#1c1d1f] to-[#181a1c] rounded-md p-4">
                <div className="flex flex-col items-center">
                  <BookX />
                  <div>Threshold</div>
                </div>
                <div className="text-[24px]">{thresholdValue}/5</div>
              </div>
            </div>
            <Box sx={{ width: '100%' }}>
              <Slider
                aria-label="No of members"
                defaultValue={1}
                step={1}
                marks={[...Array(5)].map((_, i) => ({
                  value: i + 1,
                  label: `${i + 1}`,
                }))}
                min={1}
                max={5}
                sx={{
                  color: 'white',
                  '& .MuiSlider-markLabel': { color: 'white' },
                  '& .MuiSlider-thumb': { backgroundColor: 'white' },
                  '& .MuiSlider-track': { backgroundColor: 'white' },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '& .MuiSlider-mark': { backgroundColor: 'white' },
                }}
                onChange={handleChange}
                value={thresholdValue}
              />
            </Box>
            <div className="flex gap-4 mt-4">
              <button
                className="w-1/2 bg-gradient-to-b from-[#1c1d1f] to-[#181a1c] rounded-md py-2"
                onClick={() => setThresholdModal(false)}
              >
                Close
              </button>
              <button
                className="w-1/2 bg-purple-600 rounded-md py-2"
                onClick={() => {
                  setThresholdValue(thresholdValue)
                  setThresholdModal(false)
                  handleSave()
                }}
              >
                Propose Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-8 text-[18px]">
        <h1 className="text-gray-400">More Details</h1>
        <div className="flex flex-col md:flex-row gap-6 py-4">
          <div className="flex flex-col w-full md:w-1/2 bg-gradient-to-b from-[#1c1d1f] to-[#181a1c] rounded-md px-6 py-4">
            <div className="flex justify-between">
              <div className="flex flex-col gap-6">
                <Users />
                <div>Members</div>
              </div>
              <div className="text-[36px]">5</div>
            </div>
            <div className="pt-4">
              <button className="bg-gray-400 rounded-md py-2 w-full">
                <h1 className="text-[16px]">Manage Members</h1>
              </button>
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/2 bg-gradient-to-b from-[#1c1d1f] to-[#181a1c] rounded-md px-6 py-4">
            <div className="flex justify-between">
              <div className="flex flex-col gap-6">
                <BookX />
                <div>Threshold</div>
              </div>
              <div className="text-[36px]">{thresholdValue}/5</div>
            </div>
            <div className="pt-4">
              <button
                className="flex gap-2 bg-gray-400 rounded-md py-2 w-full justify-center"
                onClick={() => setThresholdModal(true)}
              >
                <PenLine className="size-6" />
                <h1 className="text-[16px]">Edit Threshold</h1>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
