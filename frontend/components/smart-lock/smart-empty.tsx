import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import EmptyImage from '@/public/empty.svg'
import Image from 'next/image'

const ButtonSmart = ({ onClick }: { onClick?: () => void }) => (
  <Button className="font-bold text-base h-[50px] rounded-md" onClick={onClick}>
    <Plus />
    Create New Smart Lock Plan
  </Button>
)

export function SmartEmpty() {
  return (
    <div className="flex flex-col mx-auto max-w-[516px] mt-[156px] text-center">
      <Image
        src={EmptyImage}
        alt="No Smart Lock Plans"
        width={200}
        height={200}
        className="mx-auto mb-4"
      />
      <h3 className="font-bold text-3xl text-white">
        There are no Smart Lock Plans
      </h3>
      <div className="max-w-[390px] mx-auto mt-5">
        <p className="text-sm text-gray-400 mb-5">
          Get started by creating your first smart lock plan by clicking the
          &quot;create new&quot; button below.
        </p>
        <ButtonSmart />
      </div>
    </div>
  )
}
