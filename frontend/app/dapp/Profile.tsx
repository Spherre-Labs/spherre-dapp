import Image from 'next/image'
import { ChevronUp } from 'lucide-react'

interface ProfileProps {
  name: string
  walletAddress: string
  profileImage?: string // Optional profile image path
}

const SidebarProfile: React.FC<ProfileProps> = ({
  name,
  walletAddress,
  profileImage = '/Images/Profile.png', // Default image path
}) => {
  return (
    <div className="absolute bottom-0 left-0 w-full border-t border-gray-600 bg-[#1c1d1f]">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-red-500">
            <Image
              src={profileImage}
              alt="Profile"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <div>
            <p className="text-white text-sm font-medium">{name}</p>
            <p className="text-gray-400 text-xs truncate w-36">
              {walletAddress}
            </p>
          </div>
        </div>
        <ChevronUp className="text-gray-400 w-5 h-5" />
      </div>
    </div>
  )
}

export default SidebarProfile
