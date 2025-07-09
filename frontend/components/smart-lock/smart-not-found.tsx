import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/app/context/theme-context-provider'

interface SmartEmptyStateProps {
  onClearSearch: () => void
  onResetFilters: () => void
}

export function SmartNotFound({
  onClearSearch,
  onResetFilters,
}: SmartEmptyStateProps) {
  useTheme()

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-theme-bg-secondary border border-theme-border rounded-full flex items-center justify-center mb-6 transition-colors duration-300">
        <SearchX className="w-10 h-10 text-theme-muted" />
      </div>
      <h3 className="text-xl font-semibold text-theme mb-2 transition-colors duration-300">
        No plans found
      </h3>
      <p className="text-theme-secondary text-center mb-6 max-w-md transition-colors duration-300">
        We couldn&apos;t find any plans matching your current search criteria.
        Try adjusting your filters or search terms.
      </p>
      <div className="flex gap-3">
        <Button
          onClick={onClearSearch}
          variant="outline"
          className="bg-theme-bg-secondary border-theme-border text-theme hover:bg-theme-bg-tertiary hover:text-theme transition-colors duration-200"
        >
          Clear Search
        </Button>
        <Button
          onClick={onResetFilters}
          className="bg-primary text-white hover:opacity-90 transition-all duration-200"
        >
          Reset All Filters
        </Button>
      </div>
    </div>
  )
}
