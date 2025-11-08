'use client'

import { useState, useEffect, useMemo } from 'react'
import { SmartEmpty } from '@/components/smart-lock/smart-empty'
import { SmartHeader } from '@/components/smart-lock/smart-header'
import { SmartNotFound } from './smart-not-found'
import { SmartSearchFilters } from './smart-search-and-filters'
import { SmartPlanCard } from './smart-plan-card'
import { SmartPlanCardSkeleton } from './smart-plan-card-skeleton'
import type { SmartLockPlan } from '@/types/smart-lock'
import { useTheme } from '@/app/context/theme-context-provider'
import { categories as mockCategories } from '@/lib/smart-lock-mock-data'

interface SmartLockPlansProps {
  plans: SmartLockPlan[]
  isLoading: boolean
  onCreateNewPlan: () => void
}

export default function SmartLockPlans({
  plans: initialPlans,
  isLoading: loadingFromProps,
  onCreateNewPlan,
}: SmartLockPlansProps) {
  useTheme()
  const [plans, setPlans] = useState<SmartLockPlan[]>(initialPlans)
  const [filteredPlans, setFilteredPlans] =
    useState<SmartLockPlan[]>(initialPlans)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState('all')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(loadingFromProps)

  useEffect(() => {
    setPlans(initialPlans)
    setFilteredPlans(initialPlans)
  }, [initialPlans])

  useEffect(() => {
    setIsLoading(loadingFromProps)
  }, [loadingFromProps])

  const categories = useMemo(() => {
    const planCategories = Array.from(
      new Set(initialPlans.map((plan) => plan.category).filter(Boolean)),
    )

    const combined = [...mockCategories]
    for (const category of planCategories) {
      if (category && !combined.includes(category)) {
        combined.push(category)
      }
    }

    return combined
  }, [initialPlans])

  useEffect(() => {
    let filtered = plans

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((plan) =>
        plan.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by date
    if (selectedDate !== 'all') {
      filtered = filtered.filter((plan) => plan.dateCreated === selectedDate)
    }

    // Filter by categories
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((plan) =>
        selectedFilters.includes(plan.category),
      )
    }

    setFilteredPlans(filtered)
  }, [plans, searchQuery, selectedDate, selectedFilters])

  const handleFilterChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedFilters([...selectedFilters, category])
    } else {
      setSelectedFilters(selectedFilters.filter((f) => f !== category))
    }
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedDate('all')
    setSelectedFilters([])
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  // Show SmartEmpty when there are no plans at all (not just filtered results)
  if (!isLoading && plans.length === 0) {
    return (
      <div className="bg-theme p-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <SmartHeader onCreateNewPlan={onCreateNewPlan} />
          <SmartEmpty />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-theme p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <SmartHeader onCreateNewPlan={onCreateNewPlan} />

        <SmartSearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedFilters={selectedFilters}
          handleFilterChange={handleFilterChange}
          categories={categories}
        />

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <SmartPlanCardSkeleton key={index} />
              ))
            : filteredPlans.map((plan) => (
                <SmartPlanCard key={plan.id} plan={plan} />
              ))}
        </div>

        {/* Show SmartEmptyState only when there are plans but none match the filters */}
        {!isLoading && plans.length > 0 && filteredPlans.length === 0 && (
          <SmartNotFound
            onClearSearch={clearSearch}
            onResetFilters={clearAllFilters}
          />
        )}
      </div>
    </div>
  )
}
