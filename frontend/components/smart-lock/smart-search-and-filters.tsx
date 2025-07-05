'use client'

import { Search, Calendar, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/app/context/theme-context-provider'

interface SmartSearchFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedDate: string
  setSelectedDate: (date: string) => void
  selectedFilters: string[]
  handleFilterChange: (category: string, checked: boolean) => void
  categories: string[]
}

export function SmartSearchFilters({
  searchQuery,
  setSearchQuery,
  selectedDate,
  setSelectedDate,
  selectedFilters,
  handleFilterChange,
  categories,
}: SmartSearchFiltersProps) {
  useTheme()

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-muted w-4 h-4" />
        <Input
          placeholder="Search by plans"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-theme-bg-secondary border-theme-border text-theme placeholder:text-theme-muted focus:border-primary transition-colors duration-200"
        />
      </div>

      <div className="flex gap-3">
        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-40 bg-theme-bg-secondary border-theme-border text-theme transition-colors duration-200">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Select Dates" />
          </SelectTrigger>
          <SelectContent className="bg-theme-bg-secondary border-theme-border">
            <SelectItem
              value="all"
              className="text-theme hover:bg-theme-bg-tertiary focus:bg-theme-bg-tertiary focus:text-theme"
            >
              All Dates
            </SelectItem>
            <SelectItem
              value="01/01/2025"
              className="text-theme hover:bg-theme-bg-tertiary focus:bg-theme-bg-tertiary focus:text-theme"
            >
              01/01/2025
            </SelectItem>
            <SelectItem
              value="02/01/2025"
              className="text-theme hover:bg-theme-bg-tertiary focus:bg-theme-bg-tertiary focus:text-theme"
            >
              02/01/2025
            </SelectItem>
            <SelectItem
              value="03/01/2025"
              className="text-theme hover:bg-theme-bg-tertiary focus:bg-theme-bg-tertiary focus:text-theme"
            >
              03/01/2025
            </SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-theme-bg-secondary border-theme-border text-theme hover:bg-theme-bg-tertiary hover:text-theme transition-colors duration-200"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {selectedFilters.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-primary hover:bg-primary text-white"
                >
                  {selectedFilters.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-theme-bg-secondary border-theme-border">
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedFilters.includes(category)}
                onCheckedChange={(checked) =>
                  handleFilterChange(category, checked)
                }
                className="text-theme hover:bg-theme-bg-tertiary transition-colors duration-200"
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
