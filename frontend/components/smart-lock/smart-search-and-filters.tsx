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
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search by plans"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-[#101213] border-[#292929] text-white placeholder:text-gray-400 focus:border-gray-600"
        />
      </div>

      <div className="flex gap-3">
        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-40 bg-[#101213] border-[#292929] text-white">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Select Dates" />
          </SelectTrigger>
          <SelectContent className="bg-[#101213] border-[#292929]">
            <SelectItem
              value="all"
              className="text-white hover:bg-[#1a1d1e] focus:bg-[#1a1d1e] focus:text-white"
            >
              All Dates
            </SelectItem>
            <SelectItem
              value="01/01/2025"
              className="text-white hover:bg-[#1a1d1e] focus:bg-[#1a1d1e]  focus:text-white"
            >
              01/01/2025
            </SelectItem>
            <SelectItem
              value="02/01/2025"
              className="text-white hover:bg-[#1a1d1e] focus:bg-[#1a1d1e]  focus:text-white"
            >
              02/01/2025
            </SelectItem>
            <SelectItem
              value="03/01/2025"
              className="text-white hover:bg-[#1a1d1e] focus:bg-[#1a1d1e]  focus:text-white"
            >
              03/01/2025
            </SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-[#101213] border-[#292929] text-white hover:bg-[#1a1d1e] hover:text-white"
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
          <DropdownMenuContent className="bg-[#101213] border-[#292929]">
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedFilters.includes(category)}
                onCheckedChange={(checked) =>
                  handleFilterChange(category, checked)
                }
                className="text-white hover:bg-[#1a1d1e]"
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
