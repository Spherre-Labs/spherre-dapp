import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import notification from '@/public/Images/notification.png'
import NotificationModal from '../components/notification-modal'

interface NavbarProps {
  title: string
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

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
    <nav className="bg-[#1C1D1F] border-b-[1px] border-gray-600 flex justify-between p-3">
      <div className="">
        <Link href="/" className="text-white font-bold text-xl">
          {title}
        </Link>
      </div>

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
          <div className="absolute right-10 top-full mt-2 z-50 lg:w-[550px]">
            <NotificationModal onClose={() => setIsNotificationOpen(false)} />
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
