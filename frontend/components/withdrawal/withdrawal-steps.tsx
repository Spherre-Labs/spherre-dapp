interface WithdrawalStepsProps {
  currentStep: number
}

export default function WithdrawalSteps({ currentStep }: WithdrawalStepsProps) {
  const steps = [
    { number: 1, label: 'Recipient' },
    { number: 2, label: 'Token and Amount' },
    { number: 3, label: 'Final Review' },
  ]

  return (
    <div className="flex flex-wrap items-center justify-center pt-12 sm:pt-0">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center mb-2 sm:mb-0">
          {/* Step Circle */}
          <div className="flex flex-col items-center gap-2.5">
            <div
              className={`
                  flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full
                  ${currentStep === step.number ? 'bg-primary text-white' : 'bg-[#1C1D1F] text-gray-400'}
                  text-xs sm:text-sm
                `}
            >
              {step.number}
            </div>
            {/* Step Label */}
            <div
              className={`ml-1 sm:ml-2 text-xs sm:text-sm text-gray-400 ${currentStep === step.number ? ' text-white' : 'text-ash'}`}
            >
              {step.label}
            </div>
          </div>

          {/* Connector Line (except after the last step) */}
          {index < steps.length - 1 && (
            <div className="w-6 sm:w-20 h-px bg-gray-700 mx-1 -mt-3 md:-mt-8 sm:mx-2"></div>
          )}
        </div>
      ))}
    </div>
  )
}
