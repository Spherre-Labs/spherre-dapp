import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useTheme } from '@/app/context/theme-context-provider'

const ButtonSmart = ({ onClick }: { onClick?: () => void }) => {
  useTheme()

  return (
    <Button
      className="font-bold text-base h-[50px] rounded-md bg-primary hover:opacity-90 text-white transition-all duration-200"
      onClick={onClick}
    >
      <Plus />
      Create New Smart Lock Plan{' '}
    </Button>
  )
}

export function SmartHeader() {
  useTheme()

  return (
    <div className="flex max-sm:flex-col justify-between items-center mb-4 gap-4">
      <div className="max-sm:text-center">
        <h2 className="text-2xl text-theme font-bold transition-colors duration-300">
          Your Smart Lock Plans
        </h2>
        <p className="text-sm text-theme-secondary transition-colors duration-300">
          Manage, plan and lock desirable amount of tokens for future spending.
        </p>
      </div>
      <ButtonSmart />
    </div>
  )
}
