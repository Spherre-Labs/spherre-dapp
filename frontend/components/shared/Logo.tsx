import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import React from 'react'

interface LogoProps {
  className: string
  image: StaticImageData
  href: string
  textColor?: 'white' | 'default'
}

const Logo = ({ className, image, href, textColor = 'default' }: LogoProps) => {
  return (
    // A reuseable component for rendering Logo
    <Link href={href} className="flex items-center gap-2">
      <Image
        src={image}
        alt="Logo"
        className={className}
        width={148}
        height={148}
        priority
        quality={100}
      />
      <span
        className={`text-xl font-semibold ${textColor === 'white' ? 'text-white' : ''}`}
      >
        Spherre
      </span>
    </Link>
  )
}

export default Logo
