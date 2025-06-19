import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import notification from '@/public/Images/notification.png'
import NotificationModal from '../components/notification-modal'
import WalletConnected from '@/components/shared/WalletConnected'
// import { Sun, Moon } from 'lucide-react'
// import { useTheme } from '../context/ThemeContext'
import { useAccount, useConnect } from '@starknet-react/core'
import { useStarknetkitConnectModal, StarknetkitConnector } from 'starknetkit'
import { Connector } from '@starknet-react/core'

interface NavbarProps {
  title: string
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  // const { theme, setTheme } = useTheme()
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

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false)
      }
    }

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isNotificationOpen])

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen)
  }

  return (
    <nav className="bg-[#1C1D1F] border-b-[1px] border-gray-600 flex justify-between items-center p-3">
      <div className="">
        <Link href="/" className="text-white font-bold text-xl">
          {title}
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative" ref={notificationRef}>
          <div className="w-[20px] h-[20px] hover:opacity-80 transition-opacity cursor-pointer">
            <Image
              src={notification}
              width={40}
              height={40}
              alt="notification-icon"
              onClick={toggleNotification}
            />
          </div>
          {/* Notification Modal Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-1 md:right-10 top-full mt-2 z-50 w-80 lg:w-[550px]">
              <NotificationModal />
            </div>
          )}
        </div>
        {/* <button
          aria-label="Toggle theme"
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-900" />}
        </button> */}
        {!address ? (
          <button
            className="bg-[#6F2FCE] text-white font-semibold rounded-full px-6 py-2 transition hover:bg-[#7d5fff]"
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </button>
        ) : (
          <WalletConnected address={address} />
        )}
      </div>
    </nav>
  )
}

export default Navbar
