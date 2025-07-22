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
import { useSpherreAccount } from '../context/account-context'
import { spherreAccountConfig, useGetAccountName, useGetAccountDetails } from '@/lib'
import React from 'react';

interface DappLayoutProps {
  children: ReactNode
  params: { address: string }
}

export const routes = (address: `0x${string}` | null) => ({
  dashboard: `/${address}/`,
  depositViaAddress: `/${address}/deposit/deposit-via-address`,
  depositViaWallet: `/${address}/deposit/deposit-via-wallet`,
  trade: `/${address}/trade`,
  members: `/${address}/members`,
  transactions: `/${address}/transactions`,
  transactionDetails: (id: string) => `/${address}/transactions/${id}`,
  stake: `/${address}/stake`,
  smartWill: `/${address}/smart-will`,
  treasury: `/${address}/treasury`,
  smartLock: `/${address}/smart`,
  payments: `/${address}/payments`,
  apps: `/${address}/apps`,
  settings: `/${address}/settings`,
  editProfile: `/${address}/settings/edit-profile`,
  support: `/${address}/support`,
})

export default function DappLayout({ children, params }: DappLayoutProps) {
  // State to track sidebar expansion
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const selectedPage = pathname
  const account_address = useSpherreAccount().accountAddress
  
  // Unwrap params with React.use()
  const { address } = React.use(params);
  const addressToUse = account_address ?? (address as `0x${string}`);
  const { data: accountName } = useGetAccountName(addressToUse);
  const [title, setTitle] = useState(pathname)

  // Define navigation items
  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: Dashboard, route: `/${account_address}/` },
    {
      name: 'Trade',
      icon: Trade,
      route: `/${account_address}/trade`,
      comingSoon: true,
    },
    { name: 'Members', icon: Members, route: `/${account_address}/members` },
    {
      name: 'Transactions',
      icon: Transactions,
      route: `/${account_address}/transactions`,
    },
    {
      name: 'Stake',
      icon: Stake,
      comingSoon: true,
      route: `/${account_address}/stake`,
    },
    {
      name: 'Smart Will',
      icon: Stake,
      comingSoon: true,
      route: `/${account_address}/smart-will`,
    },
    {
      name: 'Treasury',
      icon: Treasury,
      route: `/${account_address}/treasury`,
      comingSoon: true,
    },
    {
      name: 'Smart Lock',
      icon: SmartLock,
      route: `/${account_address}/smart`,
      comingSoon: true,
    },
    {
      name: 'Payments',
      icon: Payments,
      comingSoon: true,
      route: `/${account_address}/payments`,
    },
    {
      name: 'Apps',
      icon: Apps,
      comingSoon: true,
      route: `/${account_address}/apps`,
    },
    { name: 'Settings', icon: Settings, route: `/${account_address}/settings` },
    {
      name: 'Support',
      icon: Support,
      comingSoon: true,
      route: `/${account_address}/support`,
    },
  ]

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Listen for sidebar expansion state changes
  useEffect(() => {
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
      <Sidebar
        accountName={accountName ?? 'Spherre Account'}
        navItems={navItems}
        selectedPage={selectedPage}
        isMobile={isMobile}
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
      />
      <div
        className={`transition-all duration-300 ${
          isMobile ? 'ml-0' : sidebarExpanded ? 'ml-64' : 'ml-16'
        }`}
      >
        <div className="flex flex-col min-h-screen">
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
