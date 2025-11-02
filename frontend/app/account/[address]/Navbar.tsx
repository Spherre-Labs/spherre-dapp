import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import notification from '@/public/Images/notification.png'
import NotificationModal from '../../components/notification-modal'
import WalletConnected from '@/components/shared/WalletConnected'
import { Menu, Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/app/context/theme-context-provider'
import { useAccount, useConnect } from '@starknet-react/core'
import { useStarknetkitConnectModal, StarknetkitConnector } from 'starknetkit'
import { Connector } from '@starknet-react/core'

interface NavbarProps {
  title: string
  isMobile: boolean
  setSidebarExpanded: (expanded: boolean) => void
}

const Navbar: React.FC<NavbarProps> = ({
  title,
  isMobile,
  setSidebarExpanded,
}) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const themeMenuRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme, actualTheme } = useTheme()
  const { address } = useAccount()
  const { connect, connectors } = useConnect()
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
  })

  // Connect wallet handler
  async function handleConnectWallet() {
    const { connector } = await starknetkitConnectModal()
    if (!connector) return
    await connect({ connector: connector as Connector })
  }

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false)
      }
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target as Node)
      ) {
        setIsThemeMenuOpen(false)
      }
    }

    if (isNotificationOpen || isThemeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isNotificationOpen, isThemeMenuOpen])

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen)
    setIsThemeMenuOpen(false)
  }

  const toggleThemeMenu = () => {
    setIsThemeMenuOpen(!isThemeMenuOpen)
    setIsNotificationOpen(false)
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={20} className="text-theme" />
      case 'dark':
        return <Moon size={20} className="text-theme" />
      case 'system':
        return <Monitor size={20} className="text-theme" />
      default:
        return <Moon size={20} className="text-theme" />
    }
  }

  const themeOptions = [
    { value: 'light', label: 'Light', icon: <Sun size={16} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={16} /> },
    { value: 'system', label: 'System', icon: <Monitor size={16} /> },
  ]

  return (
    <nav className="sticky top-0 z-10 bg-theme-secondary border-b border-theme text-theme flex justify-between items-center p-3 lg:p-4 transition-colors duration-300">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        {isMobile && (
          <button
            onClick={() => setSidebarExpanded(true)}
            className="p-2 hover:bg-theme-tertiary rounded-lg transition-colors"
          >
            <Menu size={20} className="text-theme" />
          </button>
        )}

        <Link
          href="/"
          className="text-theme font-bold text-lg lg:text-xl truncate"
        >
          {title}
        </Link>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Theme Toggle */}
        <div className="relative" ref={themeMenuRef}>
          <button
            onClick={toggleThemeMenu}
            className="p-2 hover:bg-theme-tertiary rounded-lg transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {getThemeIcon()}
          </button>

          {/* Theme Menu Dropdown */}
          {isThemeMenuOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 w-40 bg-theme-secondary border border-theme rounded-lg shadow-lg py-1">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setTheme(option.value as 'light' | 'dark' | 'system')
                    setIsThemeMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                    theme === option.value
                      ? 'bg-primary text-white'
                      : 'text-theme-secondary hover:bg-theme-tertiary hover:text-theme'
                  }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                  {theme === option.value && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={toggleNotification}
            className="p-2 hover:bg-theme-tertiary rounded-lg transition-colors duration-200"
          >
            <div className="w-[20px] h-[20px] hover:opacity-80 transition-opacity cursor-pointer">
              <Image
                src={notification}
                width={40}
                height={40}
                alt="notification-icon"
                className={`${actualTheme === 'light' ? 'filter invert' : ''}`}
              />
            </div>
          </button>

          {/* Notification Modal Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 lg:right-10 top-full mt-2 z-50 w-80 lg:w-[550px] max-w-[calc(100vw-2rem)]">
              <NotificationModal onClose={() => setIsNotificationOpen(false)} />
            </div>
          )}
        </div>

        {/* Wallet Connection */}
        {!address ? (
          <button
            className="bg-primary text-white rounded-lg px-3 lg:px-6 py-2 text-sm lg:text-base transition hover:opacity-90 whitespace-nowrap"
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </button>
        ) : (
          <div className="hidden sm:block">
            <WalletConnected address={address} />
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
