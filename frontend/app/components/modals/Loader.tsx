import React from 'react'

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div className="relative bg-[#1E1E1E] rounded-2xl shadow-lg p-8 w-full max-w-md mx-4 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#a259ff] mx-auto mb-4"></div>
        <p className="text-white text-lg">Processing...</p>
      </div>
    </div>
  )
}

export default Loader
