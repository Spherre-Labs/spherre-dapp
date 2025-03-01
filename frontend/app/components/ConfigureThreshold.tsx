'use client'

import React, { useState } from 'react'

const ConfigureThreshold = () => {
  const [threshold, setThreshold] = useState(1) // Default value of 1

  // Handle slider change
  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThreshold(Number(e.target.value))
  }

  return (
    <div className="w-full max-w-md bg-gray-900 rounded-lg p-6">
      {/* Title */}
      <h1 className="text-lg font-semibold text-white mb-2">
        Configure Threshold
      </h1>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-6">
        Please select the amount of approvals needed to confirm a transaction.
      </p>

      {/* Slider */}
      <div className="mb-6">
        <input
          type="range"
          min="1"
          max="2"
          value={threshold}
          onChange={handleThresholdChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-400">1</span>
          <span className="text-sm text-gray-400">2</span>
        </div>
      </div>

      {/* Continue Button */}
      <button className="w-full py-2 bg-white text-black rounded-lg hover:bg-gray-200">
        Continue
      </button>
    </div>
  )
}

export default ConfigureThreshold
