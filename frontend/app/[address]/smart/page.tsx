'use client'

import { useState } from 'react'
import SmartLockPlans from '@/components/smart-lock/smart-lock-plans'
import CreateSmartLockPlanModal from '@/app/components/modals/CreateSmartLockPlanModal'
import { mockPlans } from '@/lib/smart-lock-mock-data'
import type { SmartLockPlan } from '@/types/smart-lock'

interface SmartLockPlanData {
  name: string
  token: string
  amount: string
  duration: string
  durationType: 'days' | 'weeks' | 'months'
}

export default function SmartLock() {
  const [plans, setPlans] = useState<SmartLockPlan[]>(mockPlans)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreatePlan = async (planData: SmartLockPlanData) => {
    // Create new plan object
    const newPlan: SmartLockPlan = {
      id: (plans.length + 1).toString(),
      name: planData.name,
      token: planData.token,
      dateCreated: new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }),
      amount: `${planData.amount} ${planData.token}`,
      unlockDate: calculateUnlockDate(planData.duration, planData.durationType),
      isUnlockable: false,
      category: 'Custom',
      imageUrl: '/Smart-Lock-Banner-1.png', // Default image
    }

    // Add new plan to the beginning of the list
    setPlans((prevPlans) => [newPlan, ...prevPlans])
    setIsModalOpen(false)
  }

  const calculateUnlockDate = (
    duration: string,
    durationType: 'days' | 'weeks' | 'months',
  ): string => {
    const now = new Date()
    const durationNum = Number.parseInt(duration)

    switch (durationType) {
      case 'days':
        now.setDate(now.getDate() + durationNum)
        break
      case 'weeks':
        now.setDate(now.getDate() + durationNum * 7)
        break
      case 'months':
        now.setMonth(now.getMonth() + durationNum)
        break
    }

    return now.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <section>
      <SmartLockPlans
        plans={plans}
        onCreateNewPlan={() => setIsModalOpen(true)}
      />
      <CreateSmartLockPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePlan}
      />
    </section>
  )
}
