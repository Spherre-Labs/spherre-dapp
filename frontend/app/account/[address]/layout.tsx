'use client'
import { ReactNode } from 'react'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Dashboard from '@/public/Images/Dash.png'
import Trade from '@/public/Images/Trade.png'
import Members from '@/public/Images/Members.png'
import Transactions from '@/public/Images/Transactions.png'
import Stake from '@/public/Images/Stake.png'
import Treasury from '@/public/Images/Treasury.png'
import Payments from '@/public/Images/Payments.png'
import Apps from '@/public/Images/Apps.png'
import Settings from '@/public/Images/Settings.png'
import Support from '@/public/Images/Support.png'
import SmartLock from '@/public/Images/Smart-lock.png'
import { NavItem, getSelectedPage } from './navigation'
import { usePathname } from 'next/navigation'
import { useSpherreAccount } from '@/app/context/account-context'
import { useGetAccountName } from '@/lib'
import { routes } from '@/lib/utils/routes'
import React from 'react'

interface DappLayoutProps {
  children: ReactNode
  params: Promise<{ address: string }>
}

export default function DappLayout({ children, params }: DappLayoutProps) {
  // All hooks at the top - ALWAYS called in the same order
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isUltraWide, setIsUltraWide] = useState(false)
  const pathname = usePathname()
  const account_address = useSpherreAccount().accountAddress
  const { address } = React.use(params)
  const addressToUse = account_address ?? (address as `0x${string}`)
  const selectedPage = getSelectedPage(pathname, addressToUse)
  const { data: accountName } = useGetAccountName(addressToUse)
  const [title, setTitle] = useState(pathname)

  // Define navigation items using addressToUse for all routes
  const allNavItems: NavItem[] = [
    {
      name: 'Dashboard',
      icon: Dashboard,
      route: routes(addressToUse).dashboard,
    },
    {
      name: 'Trade',
      icon: Trade,
      route: routes(addressToUse).trade,
      comingSoon: true,
    },
    { name: 'Members', icon: Members, route: routes(addressToUse).members },
    {
      name: 'Transactions',
      icon: Transactions,
      route: routes(addressToUse).transactions,
    },
    {
      name: 'Stake',
      icon: Stake,
      comingSoon: true,
      route: routes(addressToUse).stake,
    },
    {
      name: 'Smart Will',
      icon: Stake,
      route: routes(addressToUse).smartWill,
    },
    {
      name: 'Treasury',
      icon: Treasury,
      route: routes(addressToUse).treasury,
    },
    {
      name: 'Smart Lock',
      icon: SmartLock,
      route: routes(addressToUse).smartLock,
    },
    {
      name: 'Payments',
      icon: Payments,
      comingSoon: true,
      route: routes(addressToUse).payments,
    },
    {
      name: 'Apps',
      icon: Apps,
      comingSoon: true,
      route: routes(addressToUse).apps,
    },
    { name: 'Settings', icon: Settings, route: routes(addressToUse).settings },
    {
      name: 'Support',
      icon: Support,
      route: routes(addressToUse).support,
    },
  ]

  // Filter out items with comingSoon: true to keep sidebar neater
  const navItems = allNavItems.filter((item) => !item.comingSoon)

  // Check for mobile and ultra-wide screen sizes - only use window after mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsUltraWide(window.innerWidth >= 2560)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Track desktop sidebar expansion for layout adjustments
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Listen to localStorage changes for pinned state
    const checkPinnedState = () => {
      const isPinned = localStorage.getItem('sidebarPinned')
      if (isPinned) {
        setDesktopSidebarExpanded(JSON.parse(isPinned))
      }
    }

    checkPinnedState()

    // Also check on storage events (for cross-tab sync)
    window.addEventListener('storage', checkPinnedState)
    return () => window.removeEventListener('storage', checkPinnedState)
  }, [])

  // Handle ultra-wide screen behavior
  useEffect(() => {
    if (isUltraWide) {
      setDesktopSidebarExpanded(true)
    }
  }, [isUltraWide])

  useEffect(() => {
    if (accountName) {
      setTitle(accountName)
    }
  }, [accountName])

  return (
    <>
      <Sidebar
        accountName={accountName ?? 'Spherre Account'}
        navItems={navItems}
        selectedPage={selectedPage}
        isMobile={isMobile}
        isUltraWide={isUltraWide}
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
        desktopSidebarExpanded={desktopSidebarExpanded}
        setDesktopSidebarExpanded={setDesktopSidebarExpanded}
      />
      <div className="bg-theme min-h-screen transition-colors duration-300">
        <div
          className={`flex flex-col min-h-screen main-content-transition ${
            isMobile
              ? 'ml-0'
              : isUltraWide
                ? 'ml-64'
                : desktopSidebarExpanded
                  ? 'ml-64'
                  : 'ml-16'
          }`}
        >
          <Navbar
            title={title}
            isMobile={isMobile}
            setSidebarExpanded={setSidebarExpanded}
          />
          <main className="flex-1 bg-theme transition-colors duration-300 pt-16 lg:pt-20">
            <div className="container-large debug-container px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 lg:pb-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
