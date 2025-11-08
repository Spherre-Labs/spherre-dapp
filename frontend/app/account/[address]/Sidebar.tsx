'use client'

import React, { useState, useEffect, useRef } from 'react'
import logo from '@/public/Images/spherrelogo.png'
import Image from 'next/image'
import SidebarProfile from './Profile'
import { NavItem } from './navigation'
import Link from 'next/link'
import { X, Pin, PinOff } from 'lucide-react'
import { useSpherreAccount } from '../../context/account-context'
import { sliceWalletAddress } from '@/components/utils'

interface SidebarProps {
  accountName: string
  navItems: NavItem[]
  selectedPage: string
  isMobile: boolean
  isUltraWide: boolean
  sidebarExpanded: boolean
  setSidebarExpanded: (expanded: boolean) => void
  desktopSidebarExpanded: boolean
  setDesktopSidebarExpanded: (expanded: boolean) => void
}

const Sidebar = ({
  accountName,
  navItems,
  selectedPage,
  isMobile,
  isUltraWide,
  sidebarExpanded,
  setSidebarExpanded,
  setDesktopSidebarExpanded,
}: SidebarProps) => {
  // State to track sidebar expansion
  const [expanded, setExpanded] = useState(false) // Start with false for SSR

  // State to track if sidebar is pinned (fixed) or hover mode
  const [isPinned, setIsPinned] = useState(false)

  const { accountAddress } = useSpherreAccount()

  // Load saved preferences after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedExpanded = localStorage.getItem('sidebarExpanded')
      if (savedExpanded !== null) {
        setExpanded(JSON.parse(savedExpanded))
      }

      const savedPinned = localStorage.getItem('sidebarPinned')
      if (savedPinned !== null) {
        setIsPinned(JSON.parse(savedPinned))
      }
    }
  }, [])

  // Store expanded state in localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarExpanded', JSON.stringify(expanded))
    }
  }, [expanded])

  // Store pinned state in localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarPinned', JSON.stringify(isPinned))
    }
  }, [isPinned])

  // Update parent state when sidebar expansion changes (hover or pin)
  useEffect(() => {
    if (!isMobile && !isUltraWide) {
      const shouldExpand = isPinned || expanded
      setDesktopSidebarExpanded(shouldExpand)
    }
  }, [isPinned, expanded, isMobile, isUltraWide, setDesktopSidebarExpanded])

  // References for staggered animations
  const itemsRef = useRef<(HTMLLIElement | null)[]>([])

  // Reset expanded state when clicking outside (not on ultra-wide or when pinned)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar')
      if (sidebar && !sidebar.contains(event.target as Node)) {
        if (isMobile) {
          setSidebarExpanded(false)
        } else if (!isUltraWide && !isPinned) {
          setExpanded(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobile, isUltraWide, isPinned, setSidebarExpanded])

  // Set animation delays for staggered menu reveal
  useEffect(() => {
    itemsRef.current.forEach((item, index) => {
      if (item) {
        item.style.setProperty('--index', index.toString())
      }
    })
  }, [expanded])

  // Handle keyboard navigation (not on ultra-wide or when pinned)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMobile) {
          setSidebarExpanded(false)
        } else if (!isUltraWide && !isPinned) {
          setExpanded(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobile, isUltraWide, isPinned, setSidebarExpanded])

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

  // Determine if sidebar should be expanded:
  // - Ultra-wide: always expanded
  // - Mobile: use sidebarExpanded state
  // - Desktop: if pinned, always expanded; otherwise use hover-based expanded state
  const isExpanded = isUltraWide
    ? true
    : isMobile
      ? sidebarExpanded
      : isPinned || expanded

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isExpanded && (
        <div
          className="fixed top-16 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-25 lg:hidden"
          onClick={() => setSidebarExpanded(false)}
        />
      )}

      <aside
        id="sidebar"
        className={`${
          isMobile
            ? `fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 transform transition-transform duration-300 z-30 ${
                isExpanded ? 'translate-x-0' : '-translate-x-full'
              }`
            : `fixed top-[5.3rem] left-0 h-[calc(100vh-4rem)] flex-shrink-0 transition-all duration-300 z-20 ${isExpanded ? 'w-64' : 'w-16'}`
        } sidebar-bg text-theme border-r border-theme-border sidebar-transition overflow-x-hidden`}
        onMouseEnter={() =>
          !isMobile && !isUltraWide && !isPinned && setExpanded(true)
        }
        onMouseLeave={() =>
          !isMobile && !isUltraWide && !isPinned && setExpanded(false)
        }
      >
        <div className="h-full flex flex-col">
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

          {/* Logo - Simple and Always Visible */}
          <div
            className={`flex items-center justify-center flex-shrink-0 ${
              isExpanded ? 'py-6 px-4' : 'py-4 px-2'
            }`}
          >
            <Image
              src={logo}
              alt="Spherre Logo"
              width={40}
              height={40}
              priority
              className={`transition-all duration-300 ${
                isExpanded ? 'w-10 h-10' : 'w-8 h-8'
              }`}
            />
          </div>

          {/* Menu Items - Fill remaining space between logo and profile */}
          <div className="flex-1 min-h-0 flex flex-col">
            <ul
              className={`flex flex-col ${isExpanded ? 'gap-5' : 'gap-6 mt-3'} text-[16px] flex-1 overflow-y-auto overflow-x-hidden`}
            >
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
                      href={item?.route ?? `/account/${accountAddress}/`}
                      className={`flex items-center p-3 rounded-lg mx-2 sidebar-transition sidebar-menu-item ${
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
                        className={`flex items-center justify-center mx-auto rounded-lg sidebar-transition sidebar-menu-item ${
                          selectedPage === item.name
                            ? 'active'
                            : 'text-theme-secondary hover:text-theme'
                        }`}
                        style={{
                          width: '32px',
                          height: '32px',
                        }}
                        onClick={() => isMobile && setSidebarExpanded(false)}
                      >
                        <div className="relative flex items-center justify-center">
                          <Image
                            src={item.icon}
                            alt={item.name}
                            width={20}
                            height={20}
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
          </div>

          {/* Pin/Unpin Toggle Button - Only visible on desktop (not mobile or ultra-wide) */}
          {!isMobile && !isUltraWide && (
            <div
              className={`mb-40 ${isExpanded ? 'px-3' : 'flex justify-center'}`}
            >
              <button
                onClick={() => setIsPinned(!isPinned)}
                className={`p-2 rounded-lg transition-colors duration-200 hover:bg-theme-tertiary ${
                  isPinned
                    ? 'bg-primary/10 text-primary'
                    : 'text-theme-secondary'
                }`}
                title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
                aria-label={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
              >
                {isPinned ? <Pin size={18} /> : <PinOff size={18} />}
              </button>
            </div>
          )}

          {/* Profile Section with smooth transition */}
          <div
            className={`profile-section flex-shrink-0 ${isExpanded ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}
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
