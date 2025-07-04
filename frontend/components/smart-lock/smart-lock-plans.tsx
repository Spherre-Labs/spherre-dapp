'use client'

import { useState, useEffect } from 'react'
import { mockPlans, categories } from '@/lib/smart-lock-mock-data'
import { SmartEmpty } from '@/components/smart-lock/smart-empty'
import { SmartHeader } from '@/components/smart-lock/smart-header'
import { SmartNotFound } from './smart-not-found'
import { SmartSearchFilters } from './smart-search-and-filters'
import { SmartPlanCard } from './smart-plan-card'
import { SmartPlanCardSkeleton } from './smart-plan-card-skeleton'
import { SmartLockPlan } from '@/types/smart-lock'
import { useTheme } from '@/app/context/theme-context-provider'

export default function SmartLockPlans() {
  useTheme()
  const [plans, setPlans] = useState<SmartLockPlan[]>([])
  const [filteredPlans, setFilteredPlans] = useState<SmartLockPlan[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState('all')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading - change to empty array to test SmartEmpty component
    setTimeout(() => {
      setPlans(mockPlans) // Change to [] to see SmartEmpty component
      setFilteredPlans(mockPlans) // Change to [] to see SmartEmpty component
      setIsLoading(false)
    }, 2000)
  }, [])

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
      <div className="min-h-screen bg-theme p-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <SmartHeader />
          <SmartEmpty />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-theme p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <SmartHeader />

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
