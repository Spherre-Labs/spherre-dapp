import Image from 'next/image'
import React from 'react'
import avatar from '../../public/Images/avatar.png'

const WalletConnected = ({ address }: { address: string }) => {
  return (
    <button
      type="button"
      className="flex justify-center items-center gap-2 md:w-[188px] md:h-[50px] rounded-[50px] border-[1px] border-white bg-[#101213] font-[600] text-base text-white py-1.5 px-2.5 md:px-0 md:py-0"
    >
      <Image
        src={avatar}
        alt="avatar"
        width={36}
        height={36}
        quality={100}
        priority
      />
      <span className="text-sm md:text-base">
        {address.slice(0, 6)}...{address.slice(-4)}
      </span>
    </button>
  )
}

export default WalletConnected
