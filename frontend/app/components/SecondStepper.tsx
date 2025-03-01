import React from 'react'

const SecondStepper = () => {
  return (
    <div className="flex items-center justify-center space-x-4 mt-16 mb-8">
      {/* Step 1 */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white">
          1
        </div>
        <span className="text-gray-400 text-sm mt-2">Account Details</span>
      </div>
      <div className="w-12 h-0.5 bg-gray-600"></div>

      {/* Step 2 */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white">
          2
        </div>
        <span className="text-gray-400 text-sm mt-2">Member & Threshold</span>
      </div>
      <div className="w-12 h-0.5 bg-gray-600"></div>

      {/* Step 3 (Active) */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white">
          3
        </div>
        <span className="text-white text-sm mt-2">Confirm & Setup</span>
      </div>
    </div>
  )
}

export default SecondStepper
