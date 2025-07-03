import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function SmartPlanCardSkeleton() {
  return (
    <Card className="bg-[#101213] border-[#292929] overflow-hidden">
      <CardHeader className="p-4">
        <div className="relative">
          <Skeleton className="w-full h-[130px] bg-[#292929] rounded-lg" />
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Plan name skeleton */}
        <Skeleton className="h-5 w-3/4 bg-[#292929]" />

        {/* Token section skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12 bg-[#292929]" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 bg-[#292929] rounded-full" />
            <Skeleton className="h-4 w-12 bg-[#292929]" />
          </div>
        </div>

        {/* Date created skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20 bg-[#292929]" />
          <Skeleton className="h-4 w-16 bg-[#292929]" />
        </div>

        {/* Amount and Unlock Date container skeleton */}
        <div className="bg-[#1C1D1F] rounded-lg p-4 grid grid-cols-2 gap-6">
          <div>
            <Skeleton className="h-3 w-12 bg-[#292929] mb-1" />
            <Skeleton className="h-5 w-16 bg-[#292929]" />
          </div>
          <div>
            <Skeleton className="h-3 w-16 bg-[#292929] mb-1" />
            <Skeleton className="h-5 w-16 bg-[#292929]" />
          </div>
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-12 w-full bg-[#292929] rounded-lg" />
      </CardContent>
    </Card>
  )
}
