'use client'

import React, { useState, useEffect, useRef } from 'react'
import logo from '../../public/Images/spherrelogo.png'
import Image from 'next/image'
import SidebarProfile from './Profile'
import { NavItem } from '@/app/dapp/navigation'
import Link from 'next/link'
import { X, Menu } from 'lucide-react'
// import WalletConnected from '@/components/shared/WalletConnected'
// import { useConnect } from '@starknet-react/core'
// import { ChevronUp, ChevronDown } from 'lucide-react'
// import { useStarknetkitConnectModal, StarknetkitConnector } from 'starknetkit'
// import { Connector } from '@starknet-react/core'

interface SidebarProps {
  navItems: NavItem[]
  selectedPage: string
  isMobile: boolean
  sidebarExpanded: boolean
  setSidebarExpanded: (expanded: boolean) => void
}

const Sidebar = ({
  navItems,
  selectedPage,
  isMobile,
  sidebarExpanded,
  setSidebarExpanded,
}: SidebarProps) => {
  // State to track sidebar expansion
  const [expanded, setExpanded] = useState(() => {
    // Check localStorage for saved preference if in browser environment
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarExpanded')
      return saved !== null ? JSON.parse(saved) : false
    }
    return false
  })

  // Store expanded state in localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarExpanded', JSON.stringify(expanded))
    }
  }, [expanded])

  // References for staggered animations
  const itemsRef = useRef<(HTMLLIElement | null)[]>([])

  // Reset expanded state when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar')
      if (sidebar && !sidebar.contains(event.target as Node)) {
        if (isMobile) {
          setSidebarExpanded(false)
        } else {
          setExpanded(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobile, setSidebarExpanded])

  // Set animation delays for staggered menu reveal
  useEffect(() => {
    itemsRef.current.forEach((item, index) => {
      if (item) {
        item.style.setProperty('--index', index.toString())
      }
    })
  }, [expanded])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMobile) {
          setSidebarExpanded(false)
        } else {
          setExpanded(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobile, setSidebarExpanded])

  // const { address } = useAccount()

  // const { connect, connectors } = useConnect()
  // const { starknetkitConnectModal } = useStarknetkitConnectModal({
  //   connectors: connectors as StarknetkitConnector[],
  // })

  // const [profileOpen, setProfileOpen] = useState(false)

  // Tooltip component for collapsed state
  const Tooltip = ({
    children,
    content,
  }: {
    children: React.ReactNode
    content: string
  }) => (
    <div className="sidebar-tooltip">
      {children}
      <span className="tooltip-text">{content}</span>
    </div>
  )

  // async function handleConnectWallet() {
  //   const { connector } = await starknetkitConnectModal()
  //   if (!connector) return
  //   await connect({ connector: connector as Connector })
  // }

  const isExpanded = isMobile ? sidebarExpanded : expanded

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarExpanded(false)}
        />
      )}

      <aside
        id="sidebar"
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-[#1c1d1f] to-[#181a1c] text-white border-r-[1px] border-gray-600 sidebar-transition z-30 ${
          isMobile
            ? `w-64 transform transition-transform duration-300 ${
                isExpanded ? 'translate-x-0' : '-translate-x-full'
              }`
            : isExpanded
              ? 'w-64'
              : 'w-16'
        }`}
        onMouseEnter={() => !isMobile && setExpanded(true)}
        onMouseLeave={() => !isMobile && setExpanded(false)}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Mobile close button */}
          {isMobile && (
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setSidebarExpanded(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* Logo */}
          <div
            className={`flex items-center sidebar-transition ${
              isExpanded ? 'gap-4 mb-14' : 'justify-center mb-14'
            }`}
          >
            <Image
              src={logo}
              alt="logo"
              width={isExpanded ? 24 : 40}
              height={isExpanded ? 24 : 40}
              className="sidebar-transition"
            />
            <div
              className={`overflow-hidden transition-all ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}
            >
              <h2 className="text-[24px] font-semibold whitespace-nowrap">
                Spherre
              </h2>
            </div>
          </div>

          {/* Menu Items */}
          <ul className="flex flex-col gap-5 text-[16px] flex-1 overflow-y-auto">
            {navItems.map((item, index) => (
              <li
                key={item.name}
                ref={(el) => {
                  itemsRef.current[index] = el
                }}
                className="staggered-item menu-item-animation"
              >
                {isExpanded ? (
                  <Link
                    href={item?.route ?? '/dapp/'}
                    className={`flex items-center p-3 rounded-lg sidebar-transition sidebar-menu-item ${
                      selectedPage === item.name
                        ? 'active'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => isMobile && setSidebarExpanded(false)}
                  >
                    <div className="relative flex items-center justify-center w-6 h-6 mr-3">
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={24}
                        height={24}
                        className="sidebar-transition"
                      />
                      {item.notification && (
                        <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                          {item.notification}
                        </span>
                      )}
                    </div>
                    <span className="truncate">{item.name}</span>
                    {item.comingSoon && (
                      <span className="text-[10px] text-green-400 border-[0.5px] bg-green-400/10 border-green-400/40 px-2 py-[0.5px] rounded-xl ml-auto flex-shrink-0">
                        Coming soon
                      </span>
                    )}
                  </Link>
                ) : (
                  <Tooltip content={item.name}>
                    <Link
                      href={item?.route ?? '/dapp/'}
                      className={`flex items-center justify-center p-3 rounded-lg sidebar-transition sidebar-menu-item ${
                        selectedPage === item.name
                          ? 'active'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      style={{
                        width: '40px',
                        height: '40px',
                      }}
                      onClick={() => isMobile && setSidebarExpanded(false)}
                    >
                      <div className="relative flex items-center justify-center">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={30}
                          height={30}
                          className="sidebar-transition"
                        />
                        {item.notification && (
                          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                            {item.notification}
                          </span>
                        )}
                      </div>
                    </Link>
                  </Tooltip>
                )}
              </li>
            ))}
          </ul>

          {/* Collapsible Profile/Wallet Section */}
          {/* Profile Section with smooth transition */}
          <div
            className={`profile-section mt-auto ${isExpanded ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}
          >
            {isExpanded && (
              <SidebarProfile
                name="Backstage Boys"
                walletAddress="G252...62teyw"
              />
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
