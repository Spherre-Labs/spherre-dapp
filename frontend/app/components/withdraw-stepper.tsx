import React from 'react'

const WithdrawStepper = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex flex-col items-start md:items-center w-full ">
      <div className="flex flex-col items-start md:flex-row md:items-center md:justify-center  md:space-x-1 mb-4 gap-3 ">
        <div className="flex items-center md:flex-col gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep == 1 && 'bg-purple-600'
            } ${currentStep > 1 && 'bg-green-500'}`}
          >
            {currentStep > 1 ? '✓' : '1'}
          </div>
          <span className="ml-2 text-sm text-gray-400 md:hidden">
            Recipient
          </span>
        </div>
        <div
          className={`hidden md:flex w-28 h-0.5 ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-600'}`}
        />
        <div className="flex md:flex-col items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-600 ${
              currentStep == 2 && 'bg-purple-600'
            } ${currentStep > 2 && 'bg-green-500'}`}
          >
            {currentStep > 2 ? '✓' : '2'}
          </div>
          <span className="ml-2 text-sm text-white md:hidden">
            Token and Amount
          </span>
        </div>
        <div
          className={`hidden md:flex w-28 md:h-0.5 ${currentStep >= 3 ? 'bg-green-500' : 'bg-gray-600'}`}
        />
        <div className="flex items-center md:flex-col gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-600 ${
              currentStep == 3 && 'bg-purple-600'
            } ${currentStep > 3 && 'bg-green-500'}`}
          >
            {currentStep > 3 ? '✓' : '3'}
          </div>
          <span className="ml-2 text-sm text-gray-400 md:hidden">
            Final Review
          </span>
        </div>
      </div>
      <div className="hidden md:flex gap-16">
        <span className="ml-2 text-sm text-gray-400">Recipient</span>
        <span className="ml-2 text-sm text-white">Token and Amount</span>
        <span className="ml-2 text-sm text-gray-400">Final Review</span>
      </div>
    </div>
  )
}

export default WithdrawStepper
