'use client'
import { useRouter } from 'next/navigation'
import WithdrawStepTwo from '@/app/components/withdraw-step-two'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/shared/Button'
import WithdrawStepper from '@/app/components/withdraw-stepper'
import WithdrawalPage from '@/app/components/withdraw-step-one'

export default function WithdrawPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  const handleNext = () => {
    // Store the withdrawal details and navigate to the next step

    // Navigate to the next step (review)
    if (currentStep > 3) {
      // router.push('/withdraw/review')
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep === 1) {
      router.push('/dapp')
    }
    setCurrentStep((prev) => (prev <= 1 ? 1 : prev - 1))
  }

  const handleCancel = () => {
    // Navigate back to the dashboard or previous page
    router.push('/dapp')
  }

  const steps = [
    { step: 1, label: 'Recipient' },
    { step: 2, label: 'Token and Amount' },
    { step: 3, label: 'Final Review' },
  ]

  return (
    <div className="min-h-screen bg-[#000] text-white pt-16 pl-6">
      <div className="flex items-center mb-6 md:mb-0">
        <Button
          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-600 transition duration-200 px-[1.25rem]"
          onClick={() => handlePrev()}
        >
          <ArrowLeft className="h-4 w-4 text-white" />
        </Button>
        <span className=" font-semibold text-white ml-4">Go Back</span>
      </div>

      <WithdrawStepper currentStep={currentStep} steps={steps} />
      {currentStep === 1 && (
        <WithdrawalPage
          onNext={handleNext}
          onCancel={handleCancel}
        />
      )}
      {currentStep === 2 && (
        <WithdrawStepTwo
          onNext={handleNext}
          onCancel={handleCancel}
          currentStep={currentStep}
          onPrev={handlePrev}
        />
      )}
    </div>
  )
}
