import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SmartEmptyStateProps {
  onClearSearch: () => void
  onResetFilters: () => void
}

export function SmartNotFound({
  onClearSearch,
  onResetFilters,
}: SmartEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-[#101213] rounded-full flex items-center justify-center mb-6">
        <SearchX className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No plans found</h3>
      <p className="text-gray-400 text-center mb-6 max-w-md">
        We couldn&apos;t find any plans matching your current search criteria.
        Try adjusting your filters or search terms.
      </p>
      <div className="flex gap-3">
        <Button
          onClick={onClearSearch}
          variant="outline"
          className="bg-[#101213] border-[#292929]  text-white hover:bg-[#101213] hover:text-white"
        >
          Clear Search
        </Button>
        <Button onClick={onResetFilters} className=" text-white">
          Reset All Filters
        </Button>
      </div>
    </div>
  )
}
