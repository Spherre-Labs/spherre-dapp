import React from 'react';
import Image from 'next/image';
import Logo from '@/public/Images/spherrelogo.png'

const Header = () => {
  return (
    <header className="bg-black text-white flex justify-between items-center p-4 fixed top-0 w-full z-10">
      {/* Logo */}
      <div className="flex items-center">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-2">
          <Image src={Logo} alt=''></Image>
        </div>
        <h1 className="text-lg font-semibold">Sphere</h1>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-6">
        <a href="#" className="text-gray-400 hover:text-white">Docs</a>
        <a href="#" className="text-gray-400 hover:text-white">Telegram</a>
        <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
      </nav>

      {/* User Profile */}
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-2">
          <span className="text-gray-400">👤</span> 
        </div>
        <span className="text-gray-400 text-sm">0x60...5542</span>
      </div>
    </header>
  );
};

export default Header;