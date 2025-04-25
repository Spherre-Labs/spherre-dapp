interface WithdrawalStepsProps {
    currentStep: number
  }
  
  export default function WithdrawalSteps({ currentStep }: WithdrawalStepsProps) {
    const steps = [
      { number: 1, label: "Recipient" },
      { number: 2, label: "Token and Amount" },
      { number: 3, label: "Final Review" },
    ]
  
    return (
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div
              className={`
                flex items-center justify-center w-8 h-8 rounded-full 
                ${currentStep === step.number ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400"}
              `}
            >
              {step.number}
            </div>
  
            {/* Step Label */}
            <div className="ml-2 text-sm text-gray-400">{step.label}</div>
  
            {/* Connector Line (except after the last step) */}
            {index < steps.length - 1 && <div className="w-12 h-px bg-gray-700 mx-2"></div>}
          </div>
        ))}
      </div>
    )
  }
  