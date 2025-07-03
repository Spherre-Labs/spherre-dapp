'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface SmartHeaderProps {
  onCreateNewPlan?: () => void
}

const ButtonSmart = ({ onClick }: { onClick?: () => void }) => (
  <Button className="font-bold text-base h-[50px] rounded-md" onClick={onClick}>
    <Plus />
    Create New Smart Lock Plan{' '}
  </Button>
)

export function SmartHeader({ onCreateNewPlan }: SmartHeaderProps) {
  return (
    <div className="flex max-sm:flex-col justify-between items-center mb-4 gap-4">
      <div className="max-sm:text-center">
        <h2 className="text-2xl text-white font-bold">Your Smart Lock Plans</h2>
        <p className="text-sm text-gray-400">
          Manage, plan and lock desirable amount of tokens for future spending.
        </p>
      </div>
      <ButtonSmart onClick={onCreateNewPlan} />
    </div>
  )
}
