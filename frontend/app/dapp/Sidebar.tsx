'use client'

import React, { useState, useEffect } from 'react'
import logo from '../../public/Images/spherrelogo.png'
import Image from 'next/image'
import SidebarProfile from './Profile'
import { NavItem } from '@/app/dapp/navigation'
import Link from 'next/link'

const Sidebar = ({
  navItems,
  selectedPage,
}: {
  navItems: NavItem[]
  selectedPage: string
}) => {
  // State to track active page - set dashboard as default
  // const [activePage, setActivePage] = useState('Dashboard')

  // State to track sidebar expansion
  const [expanded, setExpanded] = useState(false)

  // Function to handle navigation click
  /* const handleNavClick = (pageName: string) => {
         setActivePage(pageName)
         // You can add navigation logic here if needed
       }*/

  // Reset expanded state when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar')
      if (sidebar && !sidebar.contains(event.target as Node)) {
        setExpanded(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <aside
      id="sidebar"
      className={`fixed top-0 left-0 h-screen bg-[#1c1d1f] text-white border-r-[1px] border-gray-600 transition-all duration-300 z-10 ${
        expanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="p-4">
        {/* Logo */}
        <div
          className={`flex items-center ${expanded ? 'gap-4 mb-14' : 'justify-center mb-14'}`}
        >
          <Image
            src={logo}
            alt="logo"
            width={expanded ? 24 : 40}
            height={expanded ? 24 : 40}
          />
          {expanded && <h2 className="text-[24px] font-semibold">Spherre</h2>}
        </div>

        {/* Menu Items */}
        <ul className="flex flex-col gap-5 text-[16px]">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item?.route ?? '/dapp/'}
                className={`flex items-center cursor-pointer p-3 rounded-lg transition-all ${
                  expanded ? 'gap-3' : 'justify-center'
                } ${
                  selectedPage === item.name
                    ? 'bg-[#27292D] text-white'
                    : 'text-gray-400'
                }`}
                style={{
                  width: expanded ? 'auto' : '40px', // Ensure enough space for icons when collapsed
                  height: '40px', // Fixed height for consistency
                }}
              >
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: expanded ? 'auto' : '40px', // Adjust width for collapsed state
                    height: '40px', // Fixed height for icons
                  }}
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={expanded ? 24 : 30} // Dynamically adjust icon size
                    height={expanded ? 24 : 30} // Dynamically adjust icon size
                    className="transition-all duration-300" // Smooth transition for size changes
                  />
                  {item.notification && expanded && (
                    <span className="absolute top-0 right-0 text-[10px] bg-red-500 text-white rounded-full px-1">
                      {item.notification}
                    </span>
                  )}
                </div>

                {expanded && (
                  <>
                    <span>{item.name}</span>
                    {item.comingSoon && (
                      <span className="text-[10px] text-green-400 border-[0.5px] bg-green-400/10 border-green-400/40 px-2 py-[0.5px] rounded-xl ml-auto">
                        Coming soon
                      </span>
                    )}
                  </>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {expanded && (
        <SidebarProfile name="Backstage Boys" walletAddress="G252...62teyw" />
      )}
    </aside>
  )
}

export default Sidebar
