'use client'
import { useState } from 'react'
import { TransactionType } from '@/lib/contracts/types'
import { useTheme } from '@/app/context/theme-context-provider'

interface TransactionFiltersProps {
  onFilterStatus: (
    status: 'Initiated' | 'Approved' | 'Executed' | 'Rejected' | 'All',
  ) => void
  onFilterType: (type: TransactionType | 'All') => void
  onSort: (sort: 'newest' | 'oldest' | 'amount') => void
  onPageChange: (page: number) => void
  currentPage: number
  totalPages: number
  totalTransactions: number
  currentFilters: {
    status: string
    type: string
    sort: string
  }
}

export default function TransactionFilters({
  onFilterStatus,
  onFilterType,
  onSort,
  onPageChange,
  currentPage,
  totalPages,
  totalTransactions,
  currentFilters,
}: TransactionFiltersProps) {
  useTheme()
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const statusOptions = [
    { value: 'All', label: 'All Status' },
    { value: 'Initiated', label: 'Initiated' },
    { value: 'Executed', label: 'Executed' },
    { value: 'Rejected', label: 'Rejected' },
  ]

  const typeOptions = [
    { value: 'All', label: 'All Types' },
    { value: TransactionType.TOKEN_SEND.toString(), label: 'Token Transfer' },
    { value: TransactionType.NFT_SEND.toString(), label: 'NFT Transfer' },
    { value: TransactionType.MEMBER_ADD.toString(), label: 'Add Member' },
    { value: TransactionType.MEMBER_REMOVE.toString(), label: 'Remove Member' },
    {
      value: TransactionType.MEMBER_PERMISSION_EDIT.toString(),
      label: 'Edit Permissions',
    },
    {
      value: TransactionType.THRESHOLD_CHANGE.toString(),
      label: 'Change Threshold',
    },
    { value: TransactionType.SMART_TOKEN_LOCK.toString(), label: 'Smart Lock' },
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'amount', label: 'By Amount' },
  ]

  return (
    <div className="mb-6 space-y-4">
      {/* Filter Toggle and Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center gap-2 bg-theme-bg-tertiary border border-theme-border text-theme px-4 py-2 rounded-lg hover:bg-theme-border transition-colors duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
              />
            </svg>
            Filters
            <svg
              className={`w-4 h-4 transform transition-transform duration-200 ${isFiltersOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div className="text-theme-secondary text-sm">
            Showing {totalTransactions} transactions
          </div>
        </div>

        {/* Quick Status Filters */}
        <div className="flex gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                onFilterStatus(
                  option.value as
                    | 'Initiated'
                    | 'Approved'
                    | 'Executed'
                    | 'Rejected'
                    | 'All',
                )
              }
              className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                currentFilters.status === option.value
                  ? 'bg-primary text-white'
                  : 'bg-theme-bg-tertiary text-theme hover:bg-theme-border'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable Filters */}
      {isFiltersOpen && (
        <div className="bg-theme-bg-tertiary border border-theme-border p-4 rounded-lg transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-theme text-sm font-medium mb-2">
                Status
              </label>
              <select
                value={currentFilters.status}
                onChange={(e) =>
                  onFilterStatus(
                    e.target.value as
                      | 'Initiated'
                      | 'Approved'
                      | 'Executed'
                      | 'Rejected'
                      | 'All',
                  )
                }
                className="w-full bg-theme-bg-secondary border border-theme-border text-theme p-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-theme text-sm font-medium mb-2">
                Transaction Type
              </label>
              <select
                value={currentFilters.type}
                onChange={(e) =>
                  onFilterType(
                    e.target.value === 'All'
                      ? 'All'
                      : (e.target.value as TransactionType),
                  )
                }
                className="w-full bg-theme-bg-secondary border border-theme-border text-theme p-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-theme text-sm font-medium mb-2">
                Sort By
              </label>
              <select
                value={currentFilters.sort}
                onChange={(e) =>
                  onSort(e.target.value as 'newest' | 'oldest' | 'amount')
                }
                className="w-full bg-theme-bg-secondary border border-theme-border text-theme p-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                onFilterStatus('All')
                onFilterType('All')
                onSort('newest')
              }}
              className="bg-theme-bg-secondary border border-theme-border text-theme px-4 py-2 rounded-lg hover:bg-theme-border transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-theme-secondary text-sm">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-theme-bg-tertiary border border-theme-border text-theme px-3 py-1 rounded-lg hover:bg-theme-border transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {(() => {
                const maxButtons = 5
                let startPage = Math.max(
                  1,
                  currentPage - Math.floor(maxButtons / 2),
                )
                const endPage = Math.min(totalPages, startPage + maxButtons - 1)

                if (endPage - startPage + 1 < maxButtons) {
                  startPage = Math.max(1, endPage - maxButtons + 1)
                }

                return Array.from(
                  { length: endPage - startPage + 1 },
                  (_, i) => {
                    const pageNumber = startPage + i
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => onPageChange(pageNumber)}
                        className={`px-3 py-1 rounded-lg transition-colors duration-200 ${
                          currentPage === pageNumber
                            ? 'bg-primary text-white'
                            : 'bg-theme-bg-tertiary border border-theme-border text-theme hover:bg-theme-border'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  },
                )
              })()}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-theme-bg-tertiary border border-theme-border text-theme px-3 py-1 rounded-lg hover:bg-theme-border transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
