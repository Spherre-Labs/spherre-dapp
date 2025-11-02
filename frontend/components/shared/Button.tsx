import React from 'react'
import Image from 'next/image'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string
  variant?: 'primary' | 'secondary' | 'outline'
  className?: string
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  icon,
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-[#6F2FCE] text-white',
    secondary: 'bg-[#1D1E22] text-[#FFFFFF]',
    outline: 'border-2 border-[#6F2FCE] text-[#6F2FCE] bg-transparent',
  }

  return (
    <button
      className={`px-[40.5px] py-3 rounded-[7px] flex items-center gap-x-3 justify-center 
      font-medium transition-all duration-300 hover:opacity-80 
      ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && (
        <Image
          className="sm:inline-block hidden"
          height={25}
          width={25}
          src={icon}
          alt={`${icon} Icon`}
        />
      )}
      {children}
    </button>
  )
}
