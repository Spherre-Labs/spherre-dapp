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
        <div key={step.number} className="flex items-center mb-4 sm:mb-0">
          {/* Step Circle and Label */}
          <div className="flex flex-col items-center gap-3">
            {/* Step Circle */}
            <div
              className={`
                flex items-center justify-center 
                w-16 h-16 sm:w-20 sm:h-20 
                rounded-full
                ${currentStep === step.number ? 'bg-purple-600 text-white' : 'bg-[#1C1D1F] text-gray-400'}
                text-2xl sm:text-3xl font-bold
              `}
            >
              {step.number}
            </div>

            {/* Step Label */}
            <div
              className={`
                text-center 
                ${currentStep === step.number ? 'text-white' : 'text-ash'} 
                text-base sm:text-2xl font-semibold
              `}
            >
              {step.label}
            </div>
          </div>

          {/* Connector Line (except after last step) */}
          {index < steps.length - 1 && (
            <div
              className="relative flex items-center justify-center w-20 h-1"
              role="separator"
              aria-orientation="horizontal"
            >
              <div
                className="h-1 w-12 bg-gray-700 absolute mx-auto mb-8"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
