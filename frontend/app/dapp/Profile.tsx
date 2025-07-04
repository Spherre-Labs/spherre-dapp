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
    <div className="absolute bottom-0 left-0 w-full border-t border-theme bg-theme-secondary transition-colors duration-300">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-red-500">
            <Image
              src={profileImage}
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <p className="text-theme text-sm font-medium">{name}</p>
            <p className="text-theme-secondary text-xs truncate w-36">
              {walletAddress}
            </p>
          </div>
        </div>
        <ChevronUp className="text-theme-secondary w-5 h-5" />
      </div>
    </div>
  )
}

export default SidebarProfile
