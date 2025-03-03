import React from 'react'
import Image from 'next/image'
import Logo from '@/public/Images/spherrelogo.png'
import Avater from '@/public/Images/avatar.png'

const Header = () => {
  return (
    <header className="bg-black text-white flex justify-between items-center p-4 fixed top-0 w-full z-10">
      <div className="w-[155.12px] h-[37px] flex items-center gap-[8.12px] text-white p-2">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          <Image src={Logo} alt="" />
        </div>
        <h1 className="font-['Nunito_Sans'] font-bold text-[28.88px] leading-[49.63px] tracking-[2%] text-center">
          Spherre
        </h1>
      </div>

      <nav className="hidden md:flex space-x-8 lg:ml-6">
        <a href="#" className="text-gray-400 text-white">
          Docs
        </a>
        <a href="#" className="text-gray-400 text-white">
          Telegram
        </a>
        <a href="#" className="text-gray-400 text-white">
          Twitter
        </a>
      </nav>

      {/* User Profile */}
      <div className="flex items-center w-[188px] h-[50px] gap-[8px] rounded-[50px] border-[1.5px] p-[10px_20px] border border-white border-[1.5px]">
        <div className="w-8 h-8 bg-[#4A90E2] rounded-full flex items-center justify-center mr-2">
          <Image src={Avater} alt=""></Image>
        </div>
        <span className="text-white text-sm">0x60...5542</span>
      </div>
    </header>
  )
}

export default Header
