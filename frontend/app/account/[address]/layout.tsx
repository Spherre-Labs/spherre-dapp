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
import { useSpherreAccount } from '../../context/account-context'
import { useGetAccountName } from '@/lib'
import React from 'react'

interface DappLayoutProps {
  children: ReactNode
  params: Promise<{ address: string }>
}

export default function DappLayout({ children, params }: DappLayoutProps) {
  // All hooks at the top - ALWAYS called in the same order
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const selectedPage = pathname
  const account_address = useSpherreAccount().accountAddress
  const { address } = React.use(params)
  const addressToUse = account_address ?? (address as `0x${string}`)
  const { data: accountName } = useGetAccountName(addressToUse)
  const [title, setTitle] = useState(pathname)

  // Define navigation items using addressToUse for all routes
  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: Dashboard, route: `/${addressToUse}/` },
    {
      name: 'Trade',
      icon: Trade,
      route: `/${addressToUse}/trade`,
      comingSoon: true,
    },
    { name: 'Members', icon: Members, route: `/${addressToUse}/members` },
    {
      name: 'Transactions',
      icon: Transactions,
      route: `/${addressToUse}/transactions`,
    },
    {
      name: 'Stake',
      icon: Stake,
      comingSoon: true,
      route: `/${addressToUse}/stake`,
    },
    {
      name: 'Smart Will',
      icon: Stake,
      comingSoon: true,
      route: `/${addressToUse}/smart-will`,
    },
    {
      name: 'Treasury',
      icon: Treasury,
      route: `/${addressToUse}/treasury`,
      comingSoon: true,
    },
    {
      name: 'Smart Lock',
      icon: SmartLock,
      route: `/${addressToUse}/smart`,
      comingSoon: true,
    },
    {
      name: 'Payments',
      icon: Payments,
      comingSoon: true,
      route: `/${addressToUse}/payments`,
    },
    {
      name: 'Apps',
      icon: Apps,
      comingSoon: true,
      route: `/${addressToUse}/apps`,
    },
    { name: 'Settings', icon: Settings, route: `/${addressToUse}/settings` },
    {
      name: 'Support',
      icon: Support,
      comingSoon: true,
      route: `/${addressToUse}/support`,
    },
  ]

  // Check for mobile screen size - only use window after mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Listen for sidebar expansion state changes - only use document after mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const sidebar = document.getElementById('sidebar')

    const handleSidebarHover = () => {
      if (!isMobile) {
        setSidebarExpanded(true)
      }
    }
    const handleSidebarLeave = () => {
      if (!isMobile) {
        setSidebarExpanded(false)
      }
    }

    if (sidebar && !isMobile) {
      sidebar.addEventListener('mouseenter', handleSidebarHover)
      sidebar.addEventListener('mouseleave', handleSidebarLeave)
    }

    return () => {
      if (sidebar && !isMobile) {
        sidebar.removeEventListener('mouseenter', handleSidebarHover)
        sidebar.removeEventListener('mouseleave', handleSidebarLeave)
      }
    }
  }, [isMobile])

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
            <div className="max-w-full">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
