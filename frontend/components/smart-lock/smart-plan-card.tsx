import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SmartLockPlan } from '@/types/smart-lock'
import Image from 'next/image'

interface PlanCardProps {
  plan: SmartLockPlan
}

export function SmartPlanCard({ plan }: PlanCardProps) {
  const handleUnlock = () => {
    if (plan.isUnlockable) {
      alert(`Unlocking ${plan.name}!`)
    }
  }

  return (
    <Card className="bg-[#101213] border-[#292929] overflow-hidden hover:border-gray-600/50 transition-all duration-200 backdrop-blur-sm">
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
        <h3 className="text-white font-medium text-lg leading-tight">
          {plan.name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Token:</span>
          <div className="flex items-center gap-1">
            <Image
              src="/strk-coin.png"
              alt="STRK token"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span className="text-white font-medium">{plan.token}</span>
          </div>
        </div>

        <div className="text-sm">
          <span className="text-gray-400">Date created: </span>
          <span className="text-white">{plan.dateCreated}</span>
        </div>

        <div className="bg-[#1C1D1F] rounded-lg p-4 grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">Amount</p>
            <p className="text-white font-semibold text-lg">{plan.amount}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Unlock Date</p>
            <p className="text-white font-semibold text-lg">
              {plan.unlockDate}
            </p>
          </div>
        </div>

        <Button
          onClick={handleUnlock}
          // disabled={!plan.isUnlockable}
          className={`w-full h-12 text-base font-medium ${
            plan.isUnlockable
              ? ' text-white'
              : 'bg-[#272729] hover:bg-[#272729] text-white'
          } border-0 rounded-lg transition-all duration-200`}
        >
          Unlock Plan
        </Button>
      </CardContent>
    </Card>
  )
}
