'use client'

import SmartWillModal from '@/app/components/modals/SmartWillModal'
import React, { useState } from 'react'

const SmartWillPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Smart Will</h1>
      <p className="text-gray-500">
        This page is under construction. Please check back later.
      </p>
      {isModalOpen && <SmartWillModal setIsModalOpen={setIsModalOpen} />}
    </div>
  )
}

export default SmartWillPage
