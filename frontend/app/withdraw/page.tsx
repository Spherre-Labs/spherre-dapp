'use client'

import { useRouter } from 'next/navigation'
import { WithdrawAmount } from '@/app/components/withdraw-amount'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import WithdrawStepper from '../components/withdraw-stepper'
import { Button } from '@/components/shared/Button'

export default function WithdrawPage() {
  const [currentStep, setCurrentStep] = useState(2)
  const router = useRouter()

  const handleNext = () => {
    // Store the withdrawal details and navigate to the next step

    // Navigate to the next step (review)
    if (currentStep > 3) {
      router.push('/withdraw/review')
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    setCurrentStep((prev) => (prev <= 1 ? 1 : prev - 1))
  }

  const handleCancel = () => {
    // Navigate back to the dashboard or previous page
    router.push('/dashboard')
  }

  const steps = [
    { step: 1, label: 'Recipient' },
    { step: 2, label: 'Token and Amount' },
    { step: 3, label: 'Final Review' },
  ]

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white pt-16 pl-6">
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
        <div className="max-w-2xl mx-auto p-6 space-y-6 flex flex-col items-center">
          <h1 className="text-2xl font-semibold text-white mb-2">
            Withdraw to Another Wallet
          </h1>
          <p className="text-gray-400">
            Please select the token and amount you wish to send
          </p>
        </div>
      )}
      {currentStep === 2 && (
        <WithdrawAmount
          onNext={handleNext}
          onCancel={handleCancel}
          currentStep={currentStep}
          onPrev={handlePrev}
        />
      )}
    </div>
  )
}
