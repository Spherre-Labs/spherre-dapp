import type React from 'react'
import SettingsNavbar from './preferences/components/settings-navbar'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-950 text-white w-full font-sans">
      <div className="mx-auto px-7 w-full py-8 flex flex-col space-y-8 items-start">
        <SettingsNavbar />
        {children}
      </div>
    </div>
  )
}
