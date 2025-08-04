'use client'

import React, { useState, useEffect, useRef } from 'react'
import logo from '@/public/Images/spherrelogo.png'
import Image from 'next/image'
import SidebarProfile from './Profile'
import { NavItem } from './navigation'
import Link from 'next/link'
import { X } from 'lucide-react'
import { useSpherreAccount } from '../../context/account-context'
import { sliceWalletAddress } from '@/components/utils'

interface SidebarProps {
  accountName: string
  navItems: NavItem[]
  selectedPage: string
  isMobile: boolean
  sidebarExpanded: boolean
  setSidebarExpanded: (expanded: boolean) => void
}

const Sidebar = ({
  accountName,
  navItems,
  selectedPage,
  isMobile,
  sidebarExpanded,
  setSidebarExpanded,
}: SidebarProps) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // State to track sidebar expansion
  const [expanded, setExpanded] = useState(false) // Start with false for SSR

  const { accountAddress } = useSpherreAccount()

  // Load saved preference after mount
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarExpanded')
      if (saved !== null) {
        setExpanded(JSON.parse(saved))
      }
    }
  }, [mounted])

  // Store expanded state in localStorage when it changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('sidebarExpanded', JSON.stringify(expanded))
    }
  }, [expanded, mounted])

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

  const isExpanded = isMobile ? sidebarExpanded : expanded

  if (!mounted) return null

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
        className={`${
          isMobile
            ? `fixed top-0 left-0 h-screen w-64 transform transition-transform duration-300 z-30 ${
                isExpanded ? 'translate-x-0' : '-translate-x-full'
              }`
            : `flex-shrink-0 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`
        } sidebar-bg text-theme border-r border-theme sidebar-transition`}
        onMouseEnter={() => !isMobile && setExpanded(true)}
        onMouseLeave={() => !isMobile && setExpanded(false)}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Mobile close button */}
          {isMobile && (
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setSidebarExpanded(false)}
                className="p-2 hover:bg-theme-tertiary rounded-lg transition-colors"
              >
                <X size={20} className="text-theme" />
              </button>
            </div>
          )}

          {/* Logo */}
          <div
            className={`flex items-center sidebar-transition ${
              mounted && isExpanded ? 'gap-4 mb-14' : 'justify-center mb-14'
            }`}
          >
            <Image
              src={logo}
              alt="logo"
              width={mounted && isExpanded ? 24 : 40}
              height={mounted && isExpanded ? 24 : 40}
              className="sidebar-transition"
            />
            <div
              className={`overflow-hidden transition-all ${mounted && isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}
            >
              <h2 className="text-[24px] font-semibold whitespace-nowrap text-theme">
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
                {mounted && isExpanded ? (
                  <Link
                    href={item?.route ?? `/${accountAddress}/`}
                    className={`flex items-center p-3 rounded-lg sidebar-transition sidebar-menu-item ${
                      selectedPage === item.name
                        ? 'active'
                        : 'text-theme-secondary hover:text-theme'
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
                      href={item?.route ?? `/${accountAddress}/`}
                      className={`flex items-center justify-center p-3 rounded-lg sidebar-transition sidebar-menu-item ${
                        selectedPage === item.name
                          ? 'active'
                          : 'text-theme-secondary hover:text-theme'
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

          {/* Profile Section with smooth transition */}
          <div
            className={`profile-section mt-auto ${isExpanded ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}
          >
            {isExpanded && (
              <SidebarProfile
                name={accountName}
                walletAddress={sliceWalletAddress(accountAddress)}
              />
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
