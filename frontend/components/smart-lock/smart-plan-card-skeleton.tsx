import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/app/context/theme-context-provider'

export function SmartPlanCardSkeleton() {
  useTheme()

  return (
    <Card className="bg-theme-bg-secondary border-theme-border overflow-hidden transition-colors duration-300">
      <CardHeader className="p-4">
        <div className="relative">
          <Skeleton className="w-full h-[130px] bg-theme-bg-tertiary rounded-lg" />
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Plan name skeleton */}
        <Skeleton className="h-5 w-3/4 bg-theme-bg-tertiary" />

        {/* Token section skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12 bg-theme-bg-tertiary" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 bg-theme-bg-tertiary rounded-full" />
            <Skeleton className="h-4 w-12 bg-theme-bg-tertiary" />
          </div>
        </div>

        {/* Date created skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20 bg-theme-bg-tertiary" />
          <Skeleton className="h-4 w-16 bg-theme-bg-tertiary" />
        </div>

        {/* Amount and Unlock Date container skeleton */}
        <div className="bg-theme-bg-tertiary border border-theme-border rounded-lg p-4 grid grid-cols-2 gap-6 transition-colors duration-300">
          <div>
            <Skeleton className="h-3 w-12 bg-theme-bg-secondary mb-1" />
            <Skeleton className="h-5 w-16 bg-theme-bg-secondary" />
          </div>
          <div>
            <Skeleton className="h-3 w-16 bg-theme-bg-secondary mb-1" />
            <Skeleton className="h-5 w-16 bg-theme-bg-secondary" />
          </div>
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-12 w-full bg-theme-bg-tertiary rounded-lg" />
      </CardContent>
    </Card>
  )
}
