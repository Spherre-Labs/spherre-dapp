import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = ({
  className,
  image,
  href,
}: {
  className: string
  image: StaticImageData
  href: string
}) => {
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
      <span className="text-xl font-semibold">Spherre</span>
    </Link>
  )
}

export default Logo
