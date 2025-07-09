import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import EmptyImage from '@/public/empty.svg'
import Image from 'next/image'
import { useTheme } from '@/app/context/theme-context-provider'

const ButtonSmart = ({ onClick }: { onClick?: () => void }) => {
  useTheme()

  return (
    <Button
      className="font-bold text-base h-[50px] rounded-md bg-primary hover:opacity-90 text-white transition-all duration-200"
      onClick={onClick}
    >
      <Plus />
      Create New Smart Lock Plan
    </Button>
  )
}

export function SmartEmpty() {
  useTheme()

  return (
    <div className="flex flex-col mx-auto max-w-[516px] mt-[156px] text-center">
      <Image
        src={EmptyImage}
        alt="No Smart Lock Plans"
        width={200}
        height={200}
        className="mx-auto mb-4"
      />
      <h3 className="font-bold text-3xl text-theme transition-colors duration-300">
        There are no Smart Lock Plans
      </h3>
      <div className="max-w-[390px] mx-auto mt-5">
        <p className="text-sm text-theme-secondary mb-5 transition-colors duration-300">
          Get started by creating your first smart lock plan by clicking the
          &quot;create new&quot; button below.
        </p>
        <ButtonSmart />
      </div>
    </div>
  )
}
