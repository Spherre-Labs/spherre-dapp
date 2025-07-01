import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import EmptyImage from '@/public/empty.svg'
import Image from 'next/image'

export function SmartEmpty() {
  return (
    <div>
      <div className="flex max-sm:flex-col justify-between items-center mb-4 gap-4">
        <div className="max-sm:text-center">
          <h2 className="text-2xl text-white font-bold">
            Your Smart Lock Plans
          </h2>
          <p className="text-sm text-ash">
            Manage, plan and lock desirable amount of tokens for future
            spending.
          </p>
        </div>
        <Button className="font-bold text-base h-[50px] rounded-md">
          <Plus />
          Create New Smart Lock Plan
        </Button>
      </div>

      <div className="flex flex-col mx-auto max-w-[516px] mt-[156px] text-center">
        <Image
          src={EmptyImage}
          alt="No Smart Lock Plans"
          className="mx-auto mb-4"
        />
        <h3 className="font-bold text-3xl">There are no Smart Lock Plans</h3>
        <div className="max-w-[390px] mx-auto mt-5">
          <p className="text-sm text-ash">
            Get started by creating your first smart lock plan by clicking the
            “create new” button below.
          </p>
          <Button className="font-bold text-base h-[50px] rounded-md mt-5">
            <Plus />
            Create New Smart Lock Plan
          </Button>
        </div>
      </div>
    </div>
  )
}
