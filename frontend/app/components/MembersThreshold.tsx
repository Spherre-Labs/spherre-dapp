import React from 'react'
import Image from 'next/image'
import Users from '@/public/Images/users-group.png'
import Book from '@/public/Images/fluent-book.png'

const MembersThreshold = ({ members = 3, threshold = '1/2' }) => {
  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-[#1C1D1F] rounded-lg p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#272729] rounded-lg p-4 flex items-center justify-between">
          <div className="flex flex-col items-start gap-6">
            <Image src={Users} alt="" className="w-8 h-8" />
            <p className="text-sm text-gray-400">Members</p>
          </div>
          <p className="font-['Nunito_Sans'] font-bold text-3xl sm:text-4xl leading-tight text-right">
            {members}
          </p>
        </div>

        <div className="bg-[#272729] rounded-lg p-4 flex items-center justify-between">
          <div className="flex flex-col items-start gap-6">
            <Image src={Book} alt="" className="w-8 h-8" />
            <p className="text-sm text-gray-400">Threshold</p>
          </div>
          <p className="font-['Nunito_Sans'] font-bold text-3xl sm:text-4xl leading-tight text-right">
            {threshold}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button className="w-full sm:w-1/2 py-2 bg-[#272729] text-white rounded-lg hover:bg-gray-600">
          Back
        </button>
        <button className="w-full sm:w-1/2 py-2 bg-white text-black rounded-lg hover:bg-gray-200">
          Confirm
        </button>
      </div>
    </div>
  )
}

export default MembersThreshold
