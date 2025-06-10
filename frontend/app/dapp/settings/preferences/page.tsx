'use client'

import { useState, useEffect } from 'react'
import ThemeCard from './components/theme-card'
import ToggleSwitch from './components/toggle-switch'
import Toast from './components/toast'
import BrowserPreview from './components/browser-preview'
import { Monitor, Moon, Sun } from 'lucide-react'

type Theme = 'dark' | 'light' | 'system'

interface ToastState {
  message: string
  type: 'success' | 'error'
  isVisible: boolean
}

const applyTheme = (theme: Theme) => {
  const root = document.documentElement

  if (theme === 'dark') {
    root.style.setProperty('--bg-primary', '#030712') // gray-950
    root.style.setProperty('--bg-secondary', '#111827') // gray-900
    root.style.setProperty('--text-primary', '#ffffff')
    root.style.setProperty('--text-secondary', '#9ca3af') // ash
    document.body.style.backgroundColor = '#030712'
    document.body.style.color = '#ffffff'
  } else if (theme === 'light') {
    root.style.setProperty('--bg-primary', '#ffffff')
    root.style.setProperty('--bg-secondary', '#f9fafb') // gray-50
    root.style.setProperty('--text-primary', '#111827') // gray-900
    root.style.setProperty('--text-secondary', '#6b7280') // gray-500
    document.body.style.backgroundColor = '#ffffff'
    document.body.style.color = '#111827'
  } else {
    // System mode - check system preference
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (systemDark) {
      applyTheme('dark')
    } else {
      applyTheme('light')
    }
  }
}

export default function PreferencesPage() {
  const [selectedTheme, setSelectedTheme] = useState<Theme>('dark')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [browserNotifications, setBrowserNotifications] = useState(false)
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'success',
    isVisible: false,
  })

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('spherre-theme') as Theme
    const savedEmail = localStorage.getItem('spherre-email-notifications')
    const savedBrowser = localStorage.getItem('spherre-browser-notifications')

    if (savedTheme) {
      setSelectedTheme(savedTheme)
      applyTheme(savedTheme)
    }
    if (savedEmail) setEmailNotifications(savedEmail === 'true')
    if (savedBrowser) setBrowserNotifications(savedBrowser === 'true')
  }, [applyTheme])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true })
  }

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme)
    localStorage.setItem('spherre-theme', theme)
    applyTheme(theme)
    showToast(`Theme changed to ${theme} mode`, 'success')
  }

  const handleEmailToggle = (enabled: boolean) => {
    setEmailNotifications(enabled)
    localStorage.setItem('spherre-email-notifications', enabled.toString())

    // Simulate API call with random success/failure
    const success = Math.random() > 0.1 // 90% success rate

    if (success) {
      showToast(
        enabled
          ? 'Email notifications enabled'
          : 'Email notifications disabled',
        'success',
      )
    } else {
      showToast('Failed to update email notification preference', 'error')
      // Revert the change on failure
      setEmailNotifications(!enabled)
      localStorage.setItem('spherre-email-notifications', (!enabled).toString())
    }
  }

  const handleBrowserToggle = (enabled: boolean) => {
    setBrowserNotifications(enabled)
    localStorage.setItem('spherre-browser-notifications', enabled.toString())

    // Simulate API call with random success/failure
    const success = Math.random() > 0.1 // 90% success rate

    if (success) {
      showToast(
        enabled
          ? 'Browser notifications enabled'
          : 'Browser notifications disabled',
        'success',
      )
    } else {
      showToast('Failed to update browser notification preference', 'error')
      // Revert the change on failure
      setBrowserNotifications(!enabled)
      localStorage.setItem(
        'spherre-browser-notifications',
        (!enabled).toString(),
      )
    }
  }

  return (
    <div className="space-y-10 font-sans w-full max-w-7x mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-3">Preferences</h1>
        <p className="text-ash text-sm ">
          Manage your notification preferences to control how and when you
          receive updates, alerts, and reminders.
        </p>
      </div>

      <hr className="border-t border-[#292929]" />

      {/* Interface Theme Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Interface Theme</h2>
        <p className="text-ash mb-6">
          Customize your Spherre&apos;s account theme.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <ThemeCard
            title="Dark Mode"
            description="More visible and eye-friendly design for low-light environments."
            icon={<Moon />}
            isSelected={selectedTheme === 'dark'}
            onClick={() => handleThemeChange('dark')}
            previewContent={<BrowserPreview theme="dark" />}
          />

          <ThemeCard
            title="Light Mode"
            description="Light visuals when your system is configured to light mode."
            icon={<Sun />}
            isSelected={selectedTheme === 'light'}
            onClick={() => handleThemeChange('light')}
            previewContent={<BrowserPreview theme="light" />}
          />

          <ThemeCard
            title="System Mode"
            description="This will make use of the theme your system is currently using now."
            icon={<Monitor />}
            isSelected={selectedTheme === 'system'}
            onClick={() => handleThemeChange('system')}
            previewContent={<BrowserPreview theme="system" />}
          />
        </div>
      </div>

      {/* Email Notification Section */}
      <div className="border-t border-gray-700 pt-8 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Email Notification
            </h2>
            <p className="text-ash">
              Receive email updates about Spherre on your email and be the first
              to get notified before anyone else.
            </p>
          </div>
          <ToggleSwitch
            enabled={emailNotifications}
            onChange={handleEmailToggle}
          />
        </div>
      </div>

      {/* Browser Notification Section */}
      <div className="border-t border-gray-700 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Browser Notification
            </h2>
            <p className="text-ash">
              Receive Spherre updates directly on your web browser as you go
              about your day.
            </p>
          </div>
          <ToggleSwitch
            enabled={browserNotifications}
            onChange={handleBrowserToggle}
          />
        </div>
      </div>

      {/* Toast Component */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  )
}
