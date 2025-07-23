'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/app/context/theme-context-provider'
import { useSpherreAccount } from '@/app/context/account-context'

export default function SettingsNavbar() {
  const pathname = usePathname()
  const { accountAddress } = useSpherreAccount()
  useTheme()

  const tabs = [
    { name: 'Profile', href: `/${accountAddress}/settings/profile` },
    { name: 'Wallet & Account', href: `/${accountAddress}/settings/wallet` },
    { name: 'Preferences', href: `/${accountAddress}/settings/preferences` },
    { name: 'Security', href: `/${accountAddress}/settings/security` },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="border-b font-sans border-theme-border bg-theme-bg-secondary py-2 px-2 sm:py-2.5 sm:px-8 w-full rounded-md overflow-hidden transition-colors duration-300">
      <div className="flex space-x-2 sm:space-x-5 2xl:space-x-10 max-w-7xl overflow-x-auto scrollbar-hide pb-1">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={`relative px-3 sm:px-4 py-2 sm:py-1 text-xs sm:text-sm font-bold transition-all duration-200 ease-in-out group rounded-md whitespace-nowrap ${
              isActive(tab.href)
                ? 'text-white bg-primary'
                : 'text-theme-secondary hover:text-theme hover:bg-primary/80 bg-transparent'
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </div>
    </nav>
  )
}
