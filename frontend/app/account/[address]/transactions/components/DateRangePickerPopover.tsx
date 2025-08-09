'use client'

import * as React from 'react'
import { CalendarDays, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export interface DateRange {
  from?: Date
  to?: Date
}

interface DateRangePickerPopoverProps {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
  className?: string
}

export function DateRangePickerPopover({
  dateRange,
  onDateRangeChange,
  className,
}: DateRangePickerPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const formatDateRange = (range: DateRange) => {
    if (!range.from) {
      return 'Select Dates'
    }

    if (!range.to) {
      return range.from.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    }

    const fromFormatted = range.from.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    const toFormatted = range.to.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    return `${fromFormatted} - ${toFormatted}`
  }

  const handleCalendarSelect = (
    value: Date | { from?: Date; to?: Date } | undefined,
  ) => {
    if (value && typeof value === 'object' && 'from' in value) {
      onDateRangeChange(value as DateRange)

      // Close popover when both dates are selected
      if (value.from && value.to) {
        setIsOpen(false)
      }
    }
  }

  const clearDateRange = () => {
    onDateRangeChange({ from: undefined, to: undefined })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex items-center gap-2 bg-theme-bg-tertiary border border-theme-border text-theme px-4 py-2 rounded-lg hover:bg-theme-border transition-colors duration-200',
            className,
          )}
        >
          <CalendarDays className="w-4 h-4" />
          {formatDateRange(dateRange)}
          <ChevronDown className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      {/* <PopoverContent className="w-auto p-0 bg-theme-bg-primary border-theme-border" align="end"> */}
      <PopoverContent
        className="w-auto bg-[#101213] border border-theme-border shadow-2xl font-sans"
        align="end"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-theme">Select Date Range</h3>
          {(dateRange.from || dateRange.to) && (
            <button
              onClick={clearDateRange}
              className="text-xs text-theme-secondary hover:text-theme transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <Calendar
          mode="range"
          // @ts-expect-error - Calendar component is not typed correctly
          selected={dateRange}
          onSelect={handleCalendarSelect}
          numberOfMonths={2}
          className="rounded-lg border-0"
        />

        <div className="flex items-center justify-between text-xs text-theme-secondary border-t border-theme-border pt-3">
          <span>Select start and end dates</span>
          {dateRange.from && dateRange.to && (
            <span className="text-theme">
              {Math.ceil(
                (dateRange.to.getTime() - dateRange.from.getTime()) /
                  (1000 * 60 * 60 * 24),
              )}{' '}
              days
            </span>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
