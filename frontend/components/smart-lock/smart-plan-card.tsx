'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SmartLockPlan } from '@/types/smart-lock'
import Image from 'next/image'
import { useTheme } from '@/app/context/theme-context-provider'

interface PlanCardProps {
  plan: SmartLockPlan
}

export function SmartPlanCard({ plan }: PlanCardProps) {
  useTheme()

  const handleUnlock = () => {
    if (plan.isUnlockable) {
      alert(`Unlocking ${plan.name}!`)
    }
  }

  return (
    <Card className="bg-theme-bg-secondary border-theme-border overflow-hidden hover:border-theme-border/80 transition-all duration-200 backdrop-blur-sm">
      <CardHeader className="p-4">
        <div className="relative">
          <Image
            src={plan.imageUrl || '/placeholder.svg'}
            alt={`${plan.name} header`}
            width={300}
            height={130}
            className="w-full h-[130px] object-cover rounded-lg"
          />
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <h3 className="text-theme font-medium text-lg leading-tight transition-colors duration-300">
          {plan.name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-theme-secondary text-sm">Token:</span>
          <div className="flex items-center gap-1">
            <Image
              src="/strk-coin.png"
              alt="STRK token"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span className="text-theme font-medium transition-colors duration-300">
              {plan.token}
            </span>
          </div>
        </div>

        <div className="text-sm">
          <span className="text-theme-secondary transition-colors duration-300">
            Date created:{' '}
          </span>
          <span className="text-theme transition-colors duration-300">
            {plan.dateCreated}
          </span>
        </div>

        <div className="bg-theme-bg-tertiary border border-theme-border rounded-lg p-4 grid grid-cols-2 gap-6 transition-colors duration-300">
          <div>
            <p className="text-theme-secondary text-sm mb-1">Amount</p>
            <p className="text-theme font-semibold text-lg transition-colors duration-300">
              {plan.amount}
            </p>
          </div>
          <div>
            <p className="text-theme-secondary text-sm mb-1">Unlock Date</p>
            <p className="text-theme font-semibold text-lg transition-colors duration-300">
              {plan.unlockDate}
            </p>
          </div>
        </div>

        <Button
          onClick={handleUnlock}
          // disabled={!plan.isUnlockable}
          className={`w-full h-12 text-base font-medium border-0 rounded-lg transition-all duration-200 ${
            plan.isUnlockable
              ? 'bg-primary text-white hover:opacity-90'
              : 'bg-theme-bg-tertiary border border-theme-border hover:bg-theme-bg-secondary text-theme'
          }`}
        >
          Unlock Plan
        </Button>
      </CardContent>
    </Card>
  )
}
