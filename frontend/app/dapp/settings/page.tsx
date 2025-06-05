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
    { name: 'Profile', route: '/dapp/settings/profile' },
    { name: 'Wallet & Account', route: '/dapp/settings/wallet' },
    { name: 'Preferences', route: '/dapp/settings/preferences' },
    { name: 'Security', route: '/dapp/settings/security' },
    { name: 'SmartWill', route: '/dapp/settings/smartwill' },
    { name: 'Smart Lock', route: '/dapp/settings/smartlock' },
  ]
  const [selected, setSelected] = useState('Wallet & Account')
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
                onClick={() => setSelected(item.name)}
              >
                <Link
                  href={item.route}
                  className={`flex items-center font-sans px-4 py-1 rounded-lg sidebar-transition sidebar-menu-item text-gray-400 hover:text-white
                    ${selected === item.name ? 'bg-[#29292a] text-white' : 'bg-gradient-to-b from-[#1c1d1f] to-[#181a1c]'}
                  `}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-2 text-[18px]">
        <h1 className="text-[#8e9bae] font-sans">All Mutlisig Wallets</h1>
        <div className="flex flex-col lg:flex-row pt-4 gap-6">
          <div className="relative w-[628px] h-[271px] bg-[#34aa6d] rounded-lg overflow-hidden">
            {/* Background Image */}
            <Image
              src="/Images/Vector.png" // Add image source here
              alt="Background"
              width={210}
              height={210}
              className="absolute"
              style={{
                top: '15.25px',
                left: '419.15px',
                transform: 'rotate(5deg) scale(1.2)',
                opacity: 10,
              }}
            />

            {/* Foreground Content */}
            <div className="relative flex flex-col justify-between h-full gap-4 p-6 z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-red-500">
                    <Image
                      src="/Images/Profile.png"
                      alt="Profile"
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium font-sans">
                      Backstage Boys
                    </p>
                    <p className="text-gray-400 text-xs truncate w-36 font-sans">
                      G252...62teyw
                    </p>
                  </div>
                </div>
                <button className="flex items-center justify-center gap-2 text-black bg-white py-2 px-2 text-[12px] rounded-md w-[94px] h-[43px] font-sans">
                  <Image
                    src="/Images/Starknet.png"
                    alt="Starknet logo"
                    width={25}
                    height={25}
                  />
                  <span>STRK</span>
                </button>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-[14px] text-[#e6f2ff] font-sans">
                    Date created:{' '}
                    <span className="text-white font-sans">
                      March 12, 2025, 10:20 AM
                    </span>
                  </p>
                  <div className="pt-2">
                    <button className="flex gap-2 text-black bg-white py-3 px-3 text-[14px] font-sans rounded-md w-[161px] h-[45px]">
                      <PenLine className="size-5" />
                      Manage Account
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-sans">Available balance</p>
                  <p className="text-[40px] font-sans">$250.00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[349px] h-[271px] bg-gradient-to-b from-[#1c1d1f] to-[#181a1c] rounded-lg">
            <div className="flex flex-col h-full justify-between py-4 px-4">
              <div className="text-[16px] font-sans">
                Create a Multisig Account
              </div>
              <Image
                src="/Images/settingsimg2.png"
                alt="img"
                width={325}
                height={100}
              />
              <p className="text-[12px] text-gray-400 font-sans">
                Secure Your Digital Assets Seamlessly. Add Members to your new
                Multisig Vault.
              </p>
              <div className="text-center">
                <button className="bg-[#272729] w-full rounded-md py-2 font-sans">
                  Create now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {thresholdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-[#272729] rounded-lg p-6 shadow-lg animate-slide-up max-w-md w-[583px] h-[505px]">
            <CircleX
              className="absolute top-4 right-4 text-white cursor-pointer"
              onClick={() => setThresholdModal(false)}
            />
            <h1 className="text-[30px] font-semibold text-white mb-2 text-center pt-4 font-sans">
              Edit Threshold
            </h1>
            <p className="text-center text-[14px] text-gray-400 mb-4 pb-4 font-sans">
              Please select the amount of approvals needed to confirm a
              transaction.
            </p>
            <div className="flex gap-2 mb-4 pb-4">
              <div className="flex justify-between w-[242px] h-[139px] bg-gradient-to-b from-[#1c1d1f] to-[#181a1c] rounded-md p-4">
                <div className="flex flex-col items-center pt-4">
                  <Users />
                  <div className="pt-8 font-sans">Members</div>
                </div>
                <div className="text-[40px] pt-6 font-sans">5</div>
              </div>
              <div className="flex justify-between w-[242px] h-[139px] bg-gradient-to-b from-[#1c1d1f] to-[#181a1c] rounded-md p-4">
                <div className="flex flex-col items-center pt-4">
                  <BookX />
                  <div className="pt-8 font-sans">Threshold</div>
                </div>
                <div className="text-[40px] pt-6 font-sans">
                  {thresholdValue}/5
                </div>
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
            <div className="flex gap-4 mt-4 pt-4">
              <button
                className="w-[235px] h-[50px] bg-gradient-to-b from-[#1c1d1f] to-[#181a1c] rounded-md py-2 font-sans"
                onClick={() => setThresholdModal(false)}
              >
                Close
              </button>
              <button
                className="w-[235px] h-[50px] bg-[#6f2fce] rounded-md py-2 font-sans"
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
        <h1 className="text-[#8e9bae] font-sans">More Details</h1>
        <div className="flex flex-col md:flex-row gap-6 py-4">
          <div className="flex flex-col w-[523px] h-[184px] bg-gradient-to-b from-[#1c1d1f] to-[#181a1c] rounded-md px-6 py-4">
            <div className="flex justify-between">
              <div className="flex flex-col gap-6 ">
                <Users className="stroke-[#8e9bae]" />
                <div className="text-[#8e9bae] font-sans">Members</div>
              </div>
              <div className="text-[36px]  font-bold">5</div>
            </div>
            <div className="pt-8">
              <button className="bg-[#272729] rounded-md py-2 w-[473px] h-[45px]">
                <h1 className="text-[16px] font-sans">Manage Members</h1>
              </button>
            </div>
          </div>

          <div className="flex flex-col w-[523px] h-[184px] bg-gradient-to-b from-[#1c1d1f] to-[#181a1c] rounded-md px-6 py-4">
            <div className="flex justify-between">
              <div className="flex flex-col gap-6">
                <BookX className="stroke-[#8e9bae]" />
                <div className="text-[#8e9bae] font-sans">Threshold</div>
              </div>
              <div className="text-[36px] font-sans font-bold">
                {thresholdValue}/5
              </div>
            </div>
            <div className="pt-8">
              <button
                className="flex gap-2 bg-[#272729] rounded-md py-3 w-[473px] h-[45px] justify-center"
                onClick={() => setThresholdModal(true)}
              >
                <PenLine className="size-6" />
                <h1 className="text-[16px] font-sans">Edit Threshold</h1>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings