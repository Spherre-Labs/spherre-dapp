import type React from 'react'
import SettingsNavbar from './preferences/components/settings-navbar'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full font-sans px-2 sm:px-4 lg:px-6">
      <div className="w-full flex flex-col space-y-4 sm:space-y-8 items-start">
        <SettingsNavbar />
        {children}
      </div>
    </div>
  )
}
