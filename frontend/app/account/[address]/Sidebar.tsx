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
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // State to track sidebar expansion
  const [expanded, setExpanded] = useState(false) // Start with false for SSR

  // State to track if sidebar is pinned (fixed) or hover mode
  const [isPinned, setIsPinned] = useState(false)

  const { accountAddress } = useSpherreAccount()

  // Load saved preferences after mount
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const savedExpanded = localStorage.getItem('sidebarExpanded')
      if (savedExpanded !== null) {
        setExpanded(JSON.parse(savedExpanded))
      }

      const savedPinned = localStorage.getItem('sidebarPinned')
      if (savedPinned !== null) {
        setIsPinned(JSON.parse(savedPinned))
      }
    }
  }, [mounted])

  // Store expanded state in localStorage when it changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('sidebarExpanded', JSON.stringify(expanded))
    }
  }, [expanded, mounted])

  // Store pinned state in localStorage when it changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('sidebarPinned', JSON.stringify(isPinned))
    }
  }, [isPinned, mounted])

  // Update parent state when sidebar expansion changes (hover or pin)
  useEffect(() => {
    if (mounted && !isMobile && !isUltraWide) {
      const shouldExpand = isPinned || expanded
      setDesktopSidebarExpanded(shouldExpand)
    }
  }, [
    isPinned,
    expanded,
    mounted,
    isMobile,
    isUltraWide,
    setDesktopSidebarExpanded,
  ])

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

  if (!mounted) return null

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-25 lg:hidden"
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
            : `fixed top-0 left-0 h-screen flex-shrink-0 transition-all duration-300 z-20 ${isExpanded ? 'w-64' : 'w-16'}`
        } sidebar-bg text-theme border-r border-theme-border sidebar-transition`}
        onMouseEnter={() =>
          !isMobile && !isUltraWide && !isPinned && setExpanded(true)
        }
        onMouseLeave={() =>
          !isMobile && !isUltraWide && !isPinned && setExpanded(false)
        }
      >
        <div className="p-4 h-full flex flex-col overflow-hidden">
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
              mounted && isExpanded ? 'gap-4 mb-8' : 'justify-center mb-8'
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

          {/* Pin/Unpin Toggle Button - Only visible on desktop (not mobile or ultra-wide) */}
          {!isMobile && !isUltraWide && (
            <div
              className={`mb-6 ${isExpanded ? 'px-3' : 'flex justify-center'}`}
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
                    href={item?.route ?? `/account/${accountAddress}/`}
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
