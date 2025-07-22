import React, { useState, useEffect } from 'react'
import SignMessageModal from '../../components/modals/SignMessageModal'
import Loader from '../../components/modals/Loader'
import SuccessModal from '../../components/modals/SuccessModal'

const SecurityContent = () => {
  const [privacyOn, setPrivacyOn] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  useEffect(() => {
    const savedPrivacy = localStorage.getItem('spherre-privacy')
    if (savedPrivacy) {
      setPrivacyOn(savedPrivacy === 'true')
    }
  }, [])

  const handleToggle = () => {
    if (!privacyOn) {
      setIsModalOpen(true)
    } else {
      setPrivacyOn(false)
      localStorage.setItem('spherre-privacy', 'false')
    }
  }

  const handleSignMessage = (email: string) => {
    console.log('Signing message with email:', email)
    setIsModalOpen(false)
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setPrivacyOn(true)
      localStorage.setItem('spherre-privacy', 'true')
      setIsSuccessModalOpen(true)
    }, 3000)
  }

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false)
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

      <SignMessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSign={handleSignMessage}
        title="Sign Message"
        description="Please provide your email address and sign the message to add it."
      />

      {isLoading && <Loader />}

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        message="Your privacy settings have been updated successfully."
      />
    </div>
  )
}

export default SecurityContent
