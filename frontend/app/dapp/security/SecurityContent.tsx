import React, { useState } from 'react'

const SecurityContent = () => {
  const [privacyOn, setPrivacyOn] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleToggle = () => {
    setPrivacyOn((v) => !v)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  return (
    <div className="w-full px-0">
      {/* Security Title */}
      <h2 className="text-2xl font-bold text-white mb-2">Security</h2>
      <p className="text-[#8E9BAE] mb-8">
        Protect your Spherre&apos;s account.
      </p>

      <hr className="border-[#292929] mb-8" />

      {/* Privacy Section */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Privacy</h3>
        <p className="text-[#8E9BAE] mb-2">
          Streamlining and viewing your Spherre content will only be available
          to Spherre members when turned on.
        </p>
        <p className="text-[#8E9BAE] text-sm mb-6">
          Note: all on-chain activity will still be visible.
        </p>
        {/* Toggle Switch */}
        <div className="flex w-full">
          <div className="flex-1" />
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={privacyOn}
              onChange={handleToggle}
            />
            <div className="w-11 h-6 bg-[#292929] rounded-full peer peer-checked:bg-[#a259ff] transition-colors"></div>
            <div
              className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${privacyOn ? 'translate-x-5' : ''}`}
            ></div>
          </label>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#f3e8ff] border border-[#a259ff] text-[#a259ff] px-6 py-3 rounded-lg shadow-lg font-semibold z-50">
          Privacy setting updated successfully!
        </div>
      )}
    </div>
  )
}

export default SecurityContent
