import React from 'react'
import Image from 'next/image'
import Logo from '@/public/Images/spherrelogo.png'
import Avatar from '@/public/Images/avatarr.png'

const Header = () => {
  return (
    <header className="text-white flex justify-between items-center p-8 fixed top-0 w-full z-10">
      <div className="w-[155.12px] h-[37px] flex items-center gap-[8.12px] text-white p-2">
        <Image src={Logo} width={50} height={80} alt="logo" />
        <h1 className="font-bold text-[20px] leading-[49.63px] tracking-[2%] text-center">
          Spherre
        </h1>
      </div>

      <nav className="hidden md:flex space-x-8 lg:ml-6">
        <a href="#" className="text-white">
          Docs
        </a>
        <a href="#" className="text-white">
          Telegram
        </a>
        <a href="#" className="text-white">
          Twitter
        </a>
      </nav>

      {/* User Profile */}
      <div className="flex items-center w-[188px] h-[50px] gap-[8px] rounded-[50px] border-[1.5px] p-[10px_20px] border border-white border-[1.5px]">
        <div className="w-8 h-8 bg-[#4A90E2] rounded-full flex items-center justify-center mr-2">
          <Image src={Avatar} alt=""></Image>
        </div>
        <span className="text-white text-sm">0x60...5542</span>
      </div>
    </header>
  )
}

export default Header
