import Link from 'next/link'
import Image from 'next/image'
import notification from '@/public/Images/notification.png'

interface NavbarProps {
  title: string
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  return (
    <nav className="bg-[#1C1D1F] border-b-[1px] border-gray-600 flex justify-between p-3">
      <div className="">
        <Link href="/" className="text-white font-bold text-xl">
          {title}
        </Link>
      </div>

      <div className="w-[20px] h-[20px]">
        <Image
          src={notification}
          width={40}
          height={40}
          alt="notification-icon"
        />
      </div>
    </nav>
  )
}

export default Navbar
