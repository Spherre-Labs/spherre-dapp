'use client'
import React, { useState, useMemo, useEffect } from 'react'
import Transaction from './components/transaction'
import FilterPopover from './components/FilterPopover'
import {
  DateRangePickerPopover,
  DateRange,
} from './components/DateRangePickerPopover'
import { useTransactionIntegration } from '@/hooks/useTransactionIntegration'
import { TransactionDisplayInfo, TransactionType } from '@/lib/contracts/types'

const TRANSACTIONS_PER_PAGE = 30

export default function TransactionsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const [filters, setFilters] = useState({
    status: 'All' as 'Pending' | 'Executed' | 'Rejected' | 'All',
    type: 'All' as TransactionType | 'All',
    sort: 'newest' as 'newest' | 'oldest' | 'amount',
    selectedMembers: [] as string[],
    selectedTokens: [] as string[],
    minAmount: '',
    maxAmount: '',
    amountToken: 'STRK',
  })

  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })

  // Fetch real transaction data from smart contract
  const {
    transactions: allTransactions,
    isLoading,
    error,
  } = useTransactionIntegration({
    start: BigInt(0),
    limit: BigInt(TRANSACTIONS_PER_PAGE),
  })

  // Apply filters and sorting
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...allTransactions]

    // Apply status filter
    if (filters.status !== 'All') {
      filtered = filtered.filter(
        (tx) => tx.transaction.status === filters.status,
      )
    }

    // Apply type filter
    if (filters.type !== 'All') {
      filtered = filtered.filter(
        (tx) => tx.transaction.transactionType === filters.type,
      )
    }

    // Apply member filter
    if (filters.selectedMembers.length > 0) {
      filtered = filtered.filter((tx) =>
        filters.selectedMembers.some((memberId) => {
          // Check proposer
          if (tx.transaction.proposer?.includes(memberId)) return true

          // Check approved members
          if (
            tx.transaction.approved?.some((approver: string) =>
              approver.includes(memberId),
            )
          )
            return true

          // Check transaction data based on type
          const data = tx.transaction.data
          if (
            data.type === TransactionType.MEMBER_ADD &&
            data.member?.includes(memberId)
          )
            return true
          if (
            data.type === TransactionType.MEMBER_REMOVE &&
            data.member_address?.includes(memberId)
          )
            return true
          if (
            data.type === TransactionType.MEMBER_PERMISSION_EDIT &&
            data.member?.includes(memberId)
          )
            return true

          // Check other transaction types that might involve members
          if (
            data.type === TransactionType.TOKEN_SEND &&
            data.recipient?.includes(memberId)
          )
            return true
          if (
            data.type === TransactionType.NFT_SEND &&
            data.recipient?.includes(memberId)
          )
            return true

          return false
        }),
      )
    }

    // Apply token filter
    if (filters.selectedTokens.length > 0) {
      filtered = filtered.filter((tx) =>
        filters.selectedTokens.some((tokenId) =>
          tx.token?.toLowerCase().includes(tokenId.toLowerCase()),
        ),
      )
    }

    // Apply date range filter
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((tx) => {
        const txDate = new Date(Number(tx.transaction.dateCreated) * 1000)
        const startOfDay = (date: Date) => {
          const d = new Date(date)
          d.setHours(0, 0, 0, 0)
          return d
        }
        const endOfDay = (date: Date) => {
          const d = new Date(date)
          d.setHours(23, 59, 59, 999)
          return d
        }

        if (dateRange.from && dateRange.to) {
          return (
            txDate >= startOfDay(dateRange.from) &&
            txDate <= endOfDay(dateRange.to)
          )
        } else if (dateRange.from) {
          return txDate >= startOfDay(dateRange.from)
        } else if (dateRange.to) {
          return txDate <= endOfDay(dateRange.to)
        }
        return true
      })
    }

    // Apply amount filter
    if (filters.minAmount || filters.maxAmount) {
      filtered = filtered.filter((tx) => {
        const amount = parseFloat(tx.amount || '0')
        const min = filters.minAmount ? parseFloat(filters.minAmount) : 0
        const max = filters.maxAmount ? parseFloat(filters.maxAmount) : Infinity
        return amount >= min && amount <= max
      })
    }

    // Apply sorting
    switch (filters.sort) {
      case 'newest':
        filtered.sort((a, b) =>
          Number(b.transaction.dateCreated - a.transaction.dateCreated),
        )
        break
      case 'oldest':
        filtered.sort((a, b) =>
          Number(a.transaction.dateCreated - b.transaction.dateCreated),
        )
        break
      case 'amount':
        filtered.sort((a, b) => {
          const amountA = parseFloat(a.amount || '0')
          const amountB = parseFloat(b.amount || '0')
          return amountB - amountA
        })
        break
    }

    return filtered
  }, [allTransactions, filters, dateRange])

  // Pagination logic
  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / TRANSACTIONS_PER_PAGE,
  )
  const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    startIndex,
    startIndex + TRANSACTIONS_PER_PAGE,
  )

  // Group paginated transactions by date
  const groupedTransactions = useMemo(() => {
    return paginatedTransactions.reduce(
      (acc, txInfo) => {
        const dateKey = new Date(
          Number(txInfo.transaction.dateCreated) * 1000,
        ).toLocaleDateString('en-GB', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        if (!acc[dateKey]) {
          acc[dateKey] = []
        }
        acc[dateKey].push(txInfo)
        return acc
      },
      {} as Record<string, TransactionDisplayInfo[]>,
    )
  }, [paginatedTransactions])

  // Toggle transaction expansion
  const toggleTransaction = (transactionId: string) => {
    setExpandedId(expandedId === transactionId ? null : transactionId)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setExpandedId(null) // Collapse any expanded transactions when changing pages
  }

  useEffect(() => {
    setCurrentPage(1)
    setExpandedId(null)
  }, [filters, dateRange])

  // Handle error logging as per requirements
  if (error) {
    console.error('Failed to fetch transactions:', error)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-theme">
          Transaction Activity
        </h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-theme-bg-secondary rounded-lg border border-theme-border"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-theme">Transaction Activity</h1>

        <div className="flex items-center justify-end gap-4 mb-6">
          <DateRangePickerPopover
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />

          {/* Filter Popover */}
          <FilterPopover filters={filters} onFiltersChange={setFilters} />
        </div>
      </div>

      {!isLoading &&
        !error &&
        Object.entries(groupedTransactions).map(([date, txns]) => (
          <div key={date} className="mb-4 sm:mb-6">
            <h2 className="font-sans font-medium text-theme-secondary mb-2 transition-colors duration-300">
              {date}
            </h2>
            <div className="">
              {txns.map((txInfo, index) => (
                <div
                  key={txInfo.transaction.id.toString()}
                  className={`bg-theme-bg-tertiary border border-theme-border overflow-hidden transition-colors duration-300 ${index === 0 ? 'rounded-t-lg' : ''} ${index === txns.length - 1 ? 'rounded-b-lg' : ''}`}
                >
                  <Transaction
                    transactionInfo={txInfo}
                    isExpanded={expandedId === txInfo.transaction.id.toString()}
                    onToggle={() =>
                      toggleTransaction(txInfo.transaction.id.toString())
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

      {!isLoading && !error && totalPages > 1 && currentPage < totalPages && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="bg-theme-bg-tertiary border border-theme-border text-theme px-6 py-2 rounded-lg hover:bg-theme-border transition-colors duration-200"
          >
            Load More Transactions
          </button>
        </div>
      )}

      {filteredAndSortedTransactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-theme-secondary text-lg">
            {filteredAndSortedTransactions.length === 0
              ? 'No transactions found.'
              : 'No transactions match your filters.'}
          </div>
          <div className="text-theme-secondary text-sm mt-2">
            Transactions will appear here once they are available from the smart
            contract
          </div>
        </div>
      )}
    </div>
  )
}
