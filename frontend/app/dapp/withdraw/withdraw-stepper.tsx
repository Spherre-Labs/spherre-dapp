import React from 'react'

interface WithdrawStepperProps {
  currentStep: number
  steps: Array<{ step: number; label: string }>
}

const WithdrawStepper = ({ currentStep, steps }: WithdrawStepperProps) => {
  return (
    <div className="flex flex-col items-start md:items-center w-full ">
      <div className="flex flex-col items-start md:flex-row md:items-center md:justify-center  md:space-x-1 mb-4 gap-3 ">
        {steps.map((item, index) => (
          <div
            key={new Date().toISOString() + index}
            className="flex items-center"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-600 mr-4 ${
                currentStep == item.step && 'bg-purple-600'
              } ${currentStep > item.step && 'bg-green-500'}`}
            >
              {currentStep > item.step ? '✓' : item.step}
            </div>
            <span className="ml-2 text-sm text-gray-400 md:hidden">
              {item.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`hidden md:flex w-28 h-0.5  ${
                  currentStep > item.step ? 'bg-green-500' : 'bg-gray-600'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="hidden md:flex gap-16">
        {steps.map((item, index) => (
          <span
            key={new Date().toISOString() + index}
            className={`ml-2 text-sm text-gray-400 ${currentStep === item.step && 'text-white'}`}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default WithdrawStepper
