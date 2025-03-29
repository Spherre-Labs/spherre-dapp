'use client'
import React, { useEffect, useState } from 'react'
import { useAccount } from '@starknet-react/core'
import Logo from '../shared/Logo'
import spherreLogo from '../../public/Images/spherrelogo.png'
import ConnectButton from '../lib/Connect' // Create this component
import { IoMdMenu } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'

const Nav = () => {
  const { address } = useAccount() // Get connected wallet address
  const [openMenu, setOpenMenu] = useState(false)

  const handleToggle = () => {
    setOpenMenu(!openMenu)
  }

  useEffect(() => {
    document.body.style.overflow = openMenu ? 'hidden' : 'unset'
  }, [openMenu])

  return (
    <header className="w-full flex justify-between items-center">
      {/* Logo */}
      <Logo
        href={'/'}
        className="md:w-[50px] w-[40px] "
        image={spherreLogo}
        textColor="white"
      />

      {/* Connect button & Hamburger Menu Button */}
      <div className="flex items-center gap-4">
        {/* If wallet is connected, show address; else show Connect button */}
        {address ? (
          <div className="text-white font-medium">
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        ) : (
          <ConnectButton />
        )}

        {/* Hamburger Menu */}
        <button
          type="button"
          className="md:hidden block text-3xl text-white"
          onClick={handleToggle}
        >
          <IoMdMenu />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 z-[99] w-full h-screen bg-[#101213]/60 transition-all duration-500 ease-[cubic-bezier(0.86,0,0.07,1)] lg:hidden flex justify-end ${
          openMenu ? 'left-0' : 'left-[100%]'
        }`}
      >
        <div
          className={`w-[80%] h-full bg-[#101213] border-l border-gray-900 flex flex-col gap-10 transition-all duration-500 ease-[cubic-bezier(0.86,0,0.07,1)] px-6 py-8 delay-300 ${
            openMenu ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <header className="flex justify-between items-center w-full">
            {/* Logo */}
            <Logo
              href={'/'}
              className="md:w-[50px] w-[40px]"
              image={spherreLogo}
            />
            {/* Close Menu Button*/}
            <button
              type="button"
              className="text-3xl text-white"
              onClick={handleToggle}
            >
              <IoClose />
            </button>
          </header>
        </div>
      </div>
    </header>
  )
}

export default Nav
