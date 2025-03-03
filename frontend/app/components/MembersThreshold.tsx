import React from 'react'
import Image from 'next/image'
import Users from '@/public/Images/users-group.png'
import Book from '@/public/Images/fluent-book.png'

const MembersThreshold = ({ members = 3, threshold = '1/2' }) => {
  return (
    <div className="w-full max-w-md bg-[#1C1D1F] rounded-[10px] p-6 mt-4">
      <div className="w-full flex gap-4 mb-6">
        <div className="bg-[#272729] w-[281px] h-[139px] rounded-[10px] p-4 flex items-center justify-between">
          <div className="flex flex-col items-start gap-[40px]">
            <Image src={Users} alt=""></Image>
            <p className="text-sm text-gray-400">Members</p>
          </div>
          <p className="font-['Nunito_Sans'] font-bold text-[40px] leading-[54.56px] tracking-[-0.8px] text-right">
            {members}
          </p>
        </div>

        <div className="bg-[#272729] w-[281px] h-[139px] rounded-[10px] p-4 flex items-center justify-between">
          <div className="flex flex-col items-start gap-[40px]">
            <Image src={Book} alt=""></Image>
            <p className="text-sm text-gray-400">Threshold</p>
          </div>
          <p className="font-['Nunito_Sans'] font-bold text-[40px] leading-[54.56px] tracking-[-0.8px] text-right">
            {threshold}
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button className="w-1/2 mr-2 py-2 bg-[#272729] text-white rounded-lg hover:bg-gray-600">
          Back
        </button>
        <button className="w-1/2 ml-2 py-2 bg-white text-black rounded-lg hover:bg-gray-200">
          Confirm
        </button>
      </div>
    </div>
  )
}

export default MembersThreshold
