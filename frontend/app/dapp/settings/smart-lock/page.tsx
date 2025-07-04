'use client'
import { useTheme } from '@/app/context/theme-context-provider'

export default function SmartLockPage() {
  useTheme()

  return (
    <div className="space-y-8 bg-theme transition-colors duration-300">
      <div>
        <h1 className="text-3xl font-bold text-theme mb-3">Smart Lock</h1>
        <p className="text-theme-secondary">
          Manage your smart lock and security access settings.
        </p>
      </div>

      <div className="bg-theme-bg-secondary border border-theme-border rounded-lg p-8 text-center transition-colors duration-300">
        <h2 className="text-xl font-semibold text-theme mb-2">
          Smart Lock Settings
        </h2>
        <p className="text-theme-secondary">This page is under construction.</p>
      </div>
    </div>
  )
}
