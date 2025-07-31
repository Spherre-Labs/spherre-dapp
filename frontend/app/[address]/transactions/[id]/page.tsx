'use client'
import React, { use } from 'react'
import { TransactionDetailsHeader } from './components/TransactionDetailsHeader'
import { TransactionSummary } from './components/TransactionSummary'
import { TransactionDetails } from './components/TransactionDetails'
import { useTheme } from '@/app/context/theme-context-provider'
import { useTransactionDetails } from '@/hooks/useTransactionIntegration'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function TransactionDetailsPage({ params }: PageProps) {
  useTheme()
  const resolvedParams = use(params)

  // PRIMARY: Try to fetch real transaction data from smart contract
  const {
    transaction: realTransactionInfo,
    isLoading,
    error,
    refetch,
  } = useTransactionDetails(resolvedParams.id)
  console.log(realTransactionInfo)

  // Handle error logging as per requirements
  if (error) {
    console.error('Failed to fetch transaction details:', error)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-theme-bg-secondary border border-theme-border text-theme p-6 rounded-lg h-[95.5vh] transition-colors duration-300">
        <div className="flex justify-center items-center h-full">
          <div className="text-theme-secondary transition-colors duration-300">
            Loading transaction details...
          </div>
        </div>
      </div>
    )
  }

  // Error state with retry option (still try mock fallback)
  if (error && !isLoading) {
    return (
      <div className="bg-theme-bg-secondary border border-theme-border text-theme p-6 rounded-lg h-[95.5vh] transition-colors duration-300">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-red-500 mb-4 text-center">
            Unable to fetch transaction details. Please try again later.
          </div>
          <button
            onClick={() => refetch()}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Determine which data to use (real data takes precedence)
  const transactionInfo = realTransactionInfo

  // Transaction not found in either real or mock data
  if (!transactionInfo) {
    return (
      <div className="text-theme text-center p-10 bg-theme min-h-screen transition-colors duration-300">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Transaction not found</h1>
          <p className="text-theme-secondary mb-6">
            The transaction with ID {resolvedParams.id} could not be found.
          </p>
          <div className="space-y-3">
            {error && (
              <button
                onClick={() => refetch()}
                className="w-full bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200"
              >
                Retry Smart Contract
              </button>
            )}
            <button
              onClick={() => window.history.back()}
              className="w-full bg-theme-bg-tertiary text-theme px-6 py-2 rounded-lg hover:bg-theme-border transition-colors duration-200 border border-theme-border"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-theme-bg-secondary border border-theme-border text-theme p-6 rounded-lg h-[95.5vh] transition-colors duration-300">
      <TransactionDetailsHeader
        status={transactionInfo.transaction.status}
        transactionId={transactionInfo.transaction.id}
      />
      <TransactionSummary transactionInfo={transactionInfo} />
      <TransactionDetails transactionInfo={transactionInfo} />
    </div>
  )
}
