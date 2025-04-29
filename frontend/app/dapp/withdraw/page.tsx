'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import WithdrawalSteps from '@/components/withdrawal/withdrawal-steps'
import AccountSelector from '@/components/withdrawal/account-selector'
import AddressInput from '@/components/withdrawal/address-input'
import { ArrowLeft } from 'lucide-react'

export default function WithdrawalPage() {
  const router = useRouter()
  const [recipientAddress, setRecipientAddress] = useState<string>('')
  const [isAddressValid, setIsAddressValid] = useState<boolean>(false)
  const [addressTouched, setAddressTouched] = useState<boolean>(false)

  // Dummy data for the account
  const accountData = {
    name: 'Backstage Boys',
    address: 'G2SZ...62tsyw',
    balance: '$250.35',
    avatar: '/placeholder.svg?height=40&width=40',
  }

  const handleGoBack = () => {
    router.push('/dapp')
  }

  const handleNext = () => {
    if (isAddressValid) {
      // In a real app, you would store this data in state management or context
      // For now, we'll just log it
      console.log('Proceeding to next step with address:', recipientAddress)

      // Navigate to the next step (would be implemented in a real app)
      // router.push("/dapp/withdraw/amount");
    }
  }

  const handleCancel = () => {
    router.push('/dapp')
  }

  return (
    <div className="min-h-screen w-full font-sans bg-black text-white p-4 sm:p-6 flex items-center justify-center relative">
      {/* Go Back Button */}
      <button
        onClick={handleGoBack}
        className="flex items-center gap-2 sm:gap-3 text-white group absolute top-4 sm:top-10 left-4 sm:left-10 text-sm sm:text-base font-bold transition-colors"
      >
        <ArrowLeft className="p-1 sm:p-2 bg-[#29292A] w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:ml-1 sm:group-hover:ml-2 duration-300 rounded-md" />
        <span className="inline">Go Back</span>
      </button>

      <div>
        <WithdrawalSteps currentStep={1} />

        {/* Main Content */}
        <div className="flex flex-col pt-32 sm:pt-40 h-full w-full max-w-xs sm:max-w-sm md:max-w-lg xl:max-w-2xl mt-[-10%]">
          <h1 className="text-xl sm:text-3xl font-bold text-center mb-1 sm:mb-2">
            Withdraw to Another Wallet
          </h1>
          <p className="text-ash text-center text-sm sm:text-base mb-6 sm:mb-8">
            Please select the account you wish to withdraw from Spherre and
            choose a recipient.
          </p>
          {/* From Account Selector */}
          <div className="mb-6">
            <p className="text-gray-400 mb-2">From:</p>
            <AccountSelector account={accountData} />
            <div className="flex items-center text-ash text-sm mt-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Payments are processed within 24 hours
            </div>
          </div>
          {/* To Address Input */}
          <div className="mb-8">
            <p className="text-gray-400 mb-2">To:</p>
            <AddressInput
              value={recipientAddress}
              onChange={(value) => setRecipientAddress(value)}
              onValidityChange={(isValid) => setIsAddressValid(isValid)}
              onBlur={() => setAddressTouched(true)}
              showError={
                addressTouched && !isAddressValid && recipientAddress !== ''
              }
            />
          </div>
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <button
              onClick={handleCancel}
              className="py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base bg-[#272729] text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              disabled={!isAddressValid}
              className={`py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-lg ${
                isAddressValid
                  ? 'bg-primary hover:bg-purple-900'
                  : 'bg-primary/50 cursor-not-allowed'
              } transition-colors`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
