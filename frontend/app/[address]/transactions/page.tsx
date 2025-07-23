'use client'

import { useState, useMemo } from 'react'
import Transaction from './components/transaction'
import TransactionFilters from './components/TransactionFilters'
import { useTheme } from '@/app/context/theme-context-provider'
import { useTransactionIntegration } from '@/hooks/useTransactionIntegration'
import { TransactionType, type TransactionDisplayInfo } from '@/lib/contracts/types'

const TRANSACTIONS_PER_PAGE = 10

export default function TransactionPage() {
  useTheme()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    status: 'All' as 'Pending' | 'Executed' | 'Rejected' | 'All',
    type: 'All' as TransactionType | 'All',
    sort: 'newest' as 'newest' | 'oldest' | 'amount',
  })

  // Fetch real transaction data from smart contract
  const {
    transactions: allTransactions,
    isLoading,
    error,
    refetch,
  } = useTransactionIntegration({
    start: BigInt(0),
    limit: BigInt(100),
  })

  // Apply filters and sorting
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...allTransactions]

    // Apply status filter
    if (filters.status !== 'All') {
      filtered = filtered.filter(tx => tx.transaction.status === filters.status)
    }

    // Apply type filter
    if (filters.type !== 'All') {
      filtered = filtered.filter(tx => tx.transaction.transactionType === filters.type)
    }

    // Apply sorting
    switch (filters.sort) {
      case 'newest':
        filtered.sort((a, b) => Number(b.transaction.dateCreated - a.transaction.dateCreated))
        break
      case 'oldest':
        filtered.sort((a, b) => Number(a.transaction.dateCreated - b.transaction.dateCreated))
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
  }, [allTransactions, filters])

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / TRANSACTIONS_PER_PAGE)
  const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    startIndex,
    startIndex + TRANSACTIONS_PER_PAGE
  )

  // Group paginated transactions by date
  const groupedTransactions = useMemo(() => {
    return paginatedTransactions.reduce((acc, txInfo) => {
      const dateKey = new Date(Number(txInfo.transaction.dateCreated) * 1000).toLocaleDateString()
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(txInfo)
      return acc
    }, {} as Record<string, TransactionDisplayInfo[]>)
  }, [paginatedTransactions])

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleFilterStatus = (status: 'Pending' | 'Executed' | 'Rejected' | 'All') => {
    setFilters(prev => ({ ...prev, status }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleFilterType = (type: TransactionType | 'All') => {
    setFilters(prev => ({ ...prev, type }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleSort = (sort: 'newest' | 'oldest' | 'amount') => {
    setFilters(prev => ({ ...prev, sort }))
    setCurrentPage(1) // Reset to first page when sorting
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setExpandedId(null) // Collapse any expanded transactions when changing pages
  }

  // Handle error logging as per requirements
  if (error) {
    console.error('Failed to fetch transactions:', error)
  }

  return (
    <div className="overflow-x-hidden bg-theme transition-colors duration-300">
      <div className="p-4 sm:p-6 lg:p-10 bg-theme-bg-secondary border border-theme-border rounded-xl transition-colors duration-300">
        {/* Filters */}
        <TransactionFilters
          onFilterStatus={handleFilterStatus}
          onFilterType={handleFilterType}
          onSort={handleSort}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          totalPages={totalPages}
          totalTransactions={filteredAndSortedTransactions.length}
          currentFilters={{
            status: filters.status,
            type: filters.type.toString(),
            sort: filters.sort,
          }}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-theme-secondary transition-colors duration-300">
              Loading transactions...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-red-500 mb-4 text-center">
              Unable to fetch transactions. Please try again later.
            </div>
            <button
              onClick={refetch}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredAndSortedTransactions.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="text-theme-secondary transition-colors duration-300">
              {allTransactions.length === 0 ? 'No transactions found.' : 'No transactions match your filters.'}
            </div>
          </div>
        )}

        {/* Transactions */}
        {!isLoading && !error && Object.entries(groupedTransactions).map(([date, txns]) => (
          <div key={date} className="mb-4 sm:mb-6">
            <h2 className="text-theme-secondary text-xs sm:text-sm mb-2 transition-colors duration-300">
              {date}
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {txns.map((txInfo) => (
                <div
                  key={txInfo.transaction.id.toString()}
                  className="bg-theme-bg-tertiary border border-theme-border rounded-lg overflow-hidden transition-colors duration-300"
                >
                  <Transaction
                    transactionInfo={txInfo}
                    isExpanded={expandedId === txInfo.transaction.id.toString()}
                    onToggle={() => handleToggle(txInfo.transaction.id.toString())}
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
      </div>
    </div>
  )
}