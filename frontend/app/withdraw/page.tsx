'use client'

import { useRouter } from 'next/navigation'
import { WithdrawAmount } from '@/app/components/withdraw-amount'

export default function WithdrawPage() {
  const router = useRouter()

  const handleNext = (amount: number, token: string) => {
    // Store the withdrawal details and navigate to the next step
    console.log(`Withdrawing ${amount} ${token}`)
    // Navigate to the next step (review)
    router.push('/withdraw/review')
  }

  const handleCancel = () => {
    // Navigate back to the dashboard or previous page
    router.push('/dashboard')
  }

  return (
    <WithdrawAmount
      onNext={handleNext}
      onCancel={handleCancel}
      currentStep={2}
    />
  )
}
