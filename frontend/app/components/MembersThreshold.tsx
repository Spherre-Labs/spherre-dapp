import React from 'react'
import Image from 'next/image'
import Users from '@/public/Images/users-group.png'
import Book from '@/public/Images/fluent-book.png'

const MembersThreshold = ({ members = 3, threshold = '1/2' }) => {
  return (
    <div className="w-full max-w-md bg-gray-900 p-4 mt-4">
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Members Card */}
        <div className="bg-gray-800 rounded-lg p-2 flex items-center justify-between">
          <div className="justify-between items-center">
            <Image src={Users} alt=""></Image>
            <p className="text-sm text-gray-400">Members</p>
          </div>
          <p className="text-lg font-semibold text-white">{members}</p>
        </div>

        {/* Threshold Card */}
        <div className="bg-gray-800 rounded-lg p-2 flex items-center justify-between">
          <div className="justify-between items-center">
            <Image src={Book} alt=""></Image>
            <p className="text-sm text-gray-400">Threshold</p>
          </div>
          <p className="text-lg font-semibold text-white">{threshold}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <button className="w-1/2 mr-2 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
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
