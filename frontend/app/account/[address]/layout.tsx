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
import { NavItem } from './navigation'
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
  const [isMobile, setIsMobile] = useState(false)
  const [isUltraWide, setIsUltraWide] = useState(false)
  const pathname = usePathname()
  const selectedPage = pathname
  const account_address = useSpherreAccount().accountAddress
  const { address } = React.use(params)
  const addressToUse = account_address ?? (address as `0x${string}`)
  const { data: accountName } = useGetAccountName(addressToUse)
  const [title, setTitle] = useState(pathname)

  // Define navigation items using addressToUse for all routes
  const navItems: NavItem[] = [
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

  // Listen for sidebar expansion state changes - only use document after mount
  // Disable hover behavior on ultra-wide screens
  useEffect(() => {
    if (typeof window === 'undefined') return

    const sidebar = document.getElementById('sidebar')

    const handleSidebarHover = () => {
      if (!isMobile && !isUltraWide) {
        setSidebarExpanded(true)
      }
    }
    const handleSidebarLeave = () => {
      if (!isMobile && !isUltraWide) {
        setSidebarExpanded(false)
      }
    }

    if (sidebar && !isMobile && !isUltraWide) {
      sidebar.addEventListener('mouseenter', handleSidebarHover)
      sidebar.addEventListener('mouseleave', handleSidebarLeave)
    }

    return () => {
      if (sidebar && !isMobile && !isUltraWide) {
        sidebar.removeEventListener('mouseenter', handleSidebarHover)
        sidebar.removeEventListener('mouseleave', handleSidebarLeave)
      }
    }
  }, [isMobile, isUltraWide])

  useEffect(() => {
    if (accountName) {
      setTitle(accountName)
    }
  }, [accountName])

  return (
    <div className="bg-theme min-h-screen overflow-x-hidden transition-colors duration-300">
      <div className="flex min-h-screen">
        <Sidebar
          accountName={accountName ?? 'Spherre Account'}
          navItems={navItems}
          selectedPage={selectedPage}
          isMobile={isMobile}
          isUltraWide={isUltraWide}
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
        />
        <div className="flex-1 flex flex-col min-h-screen">
          <Navbar
            title={title}
            isMobile={isMobile}
            setSidebarExpanded={setSidebarExpanded}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden bg-theme transition-colors duration-300">
            <div className={`max-w-full ${isUltraWide ? 'main-content-centered' : ''}`}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
