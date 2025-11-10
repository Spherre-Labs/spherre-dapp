import React from 'react'
import Image, { StaticImageData } from 'next/image'
import { useTheme } from '@/app/context/theme-context-provider'

interface ThemeButtonProps {
  onClick: () => void
  icon?: StaticImageData
  children: React.ReactNode
  disabled?: boolean
}

const ThemeButton: React.FC<ThemeButtonProps> = ({
  onClick,
  icon,
  children,
  disabled,
}) => {
  const { actualTheme } = useTheme()

  return (
    <button
      onClick={onClick}
      className={`w-full sm:w-72 flex items-center justify-center gap-1 px-6 py-2 rounded-lg mx-auto my-3 transition-all duration-200 ${
        actualTheme === 'dark'
          ? 'bg-white text-black hover:bg-gray-200'
          : 'bg-gray-900 text-white hover:bg-gray-800'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
    >
      {icon && <Image src={icon} height={30} width={24} alt="" />}
      <p className={actualTheme === 'dark' ? 'text-black' : 'text-white'}>
        {children}
      </p>
    </button>
  )
}

export default ThemeButton
