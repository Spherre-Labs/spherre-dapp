'use client'
import React from 'react'
import { transactions } from '@/app/dapp/transactions/data'
import { TransactionDetailsHeader } from './components/TransactionDetailsHeader'
import { TransactionSummary } from './components/TransactionSummary'
import { TransactionDetailsBody } from './components/TransactionParticipants'
import { useTheme } from '@/app/context/theme-context-provider'
import { useExecuteTransaction, useApproveTransaction, useRejectTransaction, useGetTransaction, useGetThreshold, useIsMember } from '@/hooks/useSpherreHooks'
import { useAccount, useConnect, type Connector } from '@starknet-react/core'
import { useStarknetkitConnectModal, type StarknetkitConnector } from 'starknetkit'
import { useState, useEffect } from 'react'

interface PageProps {
  params: {
    id: string
  }
}

export default function TransactionDetailsPage({ params }: PageProps) { 
  useTheme()
  const { address: accountAddress } = useAccount()
  const { connect, connectors } = useConnect()
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
  })
  
  // Unwrap params Promise for client components
  const [resolvedParams, setResolvedParams] = React.useState<{ id: string } | null>(null)
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  
  React.useEffect(() => {
    Promise.resolve(params).then(setResolvedParams)
  }, [params])

  // Use a fallback address if no wallet is connected (for testing)
  const contractAddress = accountAddress || "0x1234567890abcdef"

  // Always call hooks in the same order - before any conditional returns
  const executeTransactionResult = useExecuteTransaction(contractAddress);
  const approveTransactionResult = useApproveTransaction(contractAddress);
  const rejectTransactionResult = useRejectTransaction(contractAddress);
  
  // Additional hooks for enhanced functionality
  const { data: blockchainTransaction } = useGetTransaction(contractAddress, resolvedParams?.id ? BigInt(resolvedParams.id) : BigInt(0))
  const { data: thresholdData } = useGetThreshold(contractAddress)
  const { data: isMember } = useIsMember(contractAddress, accountAddress as `0x${string}`)
  
  // Toast notification handler
  const showToast = (type: 'success' | 'error', message: string) => {
    setToastMessage({ type, message })
    setTimeout(() => setToastMessage(null), 5000)
  }
  
  if (!resolvedParams) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-theme transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-theme text-lg">Loading transaction...</span>
        </div>
      </div>
    )
  }
  
  const transaction = transactions.find(
    (t) => t.id === parseInt(resolvedParams.id),
  )

  if (!transaction) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-theme transition-colors duration-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-theme mb-2">Transaction Not Found</h2>
          <p className="text-theme-secondary">The requested transaction could not be located.</p>
        </div>
      </div>
    )
  }

  // Calculate approval status
  const currentApprovals = blockchainTransaction?.approved?.length || transaction.approvals.filter(a => a.status === 'Confirmed').length
  const requiredApprovals = Number(thresholdData?.[0] || transaction.threshold.required)
  const canExecute = currentApprovals >= requiredApprovals && transaction.status === 'Pending'

  const approveTransaction = async () => {
    try {
      console.log('🔄 Approving transaction...');
      const result = await approveTransactionResult.writeAsync({ transaction_id: resolvedParams.id });
      console.log('✅ Transaction approved:', result);
      showToast('success', 'Transaction approved successfully!')
    } catch (error: any) {
      console.error('❌ Failed to approve transaction:', error);
      if (error.message?.includes('user rejected')) {
        showToast('error', 'Transaction was rejected by user')
      } else if (error.message?.includes('insufficient funds')) {
        showToast('error', 'Insufficient funds to complete transaction')
      } else {
        showToast('error', 'Failed to approve transaction. Please try again.')
      }
    }
  }

  const rejectTransaction = async () => {
    try {
      console.log('🔄 Rejecting transaction...');
      const result = await rejectTransactionResult.writeAsync({ transaction_id: resolvedParams.id });
      console.log('✅ Transaction rejected:', result);
      showToast('success', 'Transaction rejected successfully!')
    } catch (error: any) {
      console.error('❌ Failed to reject transaction:', error);
      if (error.message?.includes('user rejected')) {
        showToast('error', 'Action was cancelled by user')
      } else {
        showToast('error', 'Failed to reject transaction. Please try again.')
      }
    }
  }

  const executeTransaction = async () => {
    try {
      console.log('🔄 Executing transaction...');
      const result = await executeTransactionResult.writeAsync({ transaction_id: resolvedParams.id });
      console.log('✅ Transaction executed:', result);
      showToast('success', 'Transaction executed successfully!')
    } catch (error: any) {
      console.error('❌ Failed to execute transaction:', error);
      if (error.message?.includes('user rejected')) {
        showToast('error', 'Execution was cancelled by user')
      } else if (error.message?.includes('insufficient approvals')) {
        showToast('error', 'Insufficient approvals to execute transaction')
      } else {
        showToast('error', 'Failed to execute transaction. Please try again.')
      }
    }
  }

  // Connect wallet handler
  const handleConnectWallet = async () => {
    try {
      const { connector } = await starknetkitConnectModal()
      if (!connector) return
      await connect({ connector: connector as Connector })
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      showToast('error', 'Failed to connect wallet')
    }
  }

  return (
    <div className="min-h-screen bg-theme p-4 lg:p-6 transition-colors duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl text-white font-medium transition-all duration-300 transform ${
          toastMessage.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } animate-in slide-in-from-top-2`}>
          <div className="flex items-center gap-3">
            {toastMessage.type === 'success' ? (
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-theme-bg-secondary border border-theme-border rounded-2xl shadow-lg overflow-hidden">
          
          {/* Transaction Header & Summary */}
          <div className="p-6 lg:p-8 border-b border-theme-border">
            <TransactionDetailsHeader status={transaction.status} />
            <div className="mt-6">
              <TransactionSummary transaction={transaction} />
            </div>
          </div>

          {/* Transaction Details */}
          <div className="p-6 lg:p-8 border-b border-theme-border">
            <TransactionDetailsBody transaction={transaction} />
          </div>
          
          {/* Enhanced Approval Status */}
          <div className="p-6 lg:p-8 bg-theme-bg-tertiary/50">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-theme">Approval Progress</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-theme">{currentApprovals}</span>
                  <span className="text-theme-secondary">of</span>
                  <span className="text-xl font-semibold text-theme-secondary">{requiredApprovals}</span>
                  <span className="text-theme-secondary">required</span>
                </div>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="relative">
                <div className="w-full bg-theme-border rounded-full h-3 shadow-inner">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      currentApprovals >= requiredApprovals 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/30' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30'
                    }`}
                    style={{ width: `${Math.min((currentApprovals / requiredApprovals) * 100, 100)}%` }}
                  ></div>
                </div>
                
                {/* Progress indicators */}
                <div className="flex justify-between mt-2">
                  {Array.from({ length: requiredApprovals }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        index < currentApprovals ? 'bg-green-500' : 'bg-theme-border'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {canExecute && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium">Ready to execute</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons Section */}
            <div className="space-y-4">
              {!accountAddress ? (
                <div className="bg-theme-bg-secondary border border-theme-border rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-theme mb-2">Wallet Required</h3>
                  <p className="text-theme-secondary mb-6 max-w-sm mx-auto">
                    Connect your wallet to manage this transaction and participate in the approval process.
                  </p>
                  <button 
                    onClick={handleConnectWallet}
                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : !isMember ? (
                <div className="bg-theme-bg-secondary border border-theme-border rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-theme mb-2">Access Restricted</h3>
                  <p className="text-theme-secondary max-w-sm mx-auto">
                    Only account members can manage transactions. Please contact an administrator for access.
                  </p>
                </div>
              ) : (
                <>
                  {/* Wallet Status */}
                  <div className="bg-theme-bg-secondary border border-theme-border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-theme-secondary">Connected:</span>
                        <span className="text-theme font-mono text-sm bg-theme-bg-tertiary px-2 py-1 rounded">
                          {accountAddress.slice(0, 8)}...{accountAddress.slice(-6)}
                        </span>
                      </div>
                      {isMember && (
                        <span className="text-xs bg-green-500/10 text-green-600 px-3 py-1 rounded-full font-medium border border-green-500/20">
                          ✓ Member
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Approve Button */}
                    {transaction.status === 'Pending' && (
                      <button 
                        onClick={approveTransaction}
                        disabled={approveTransactionResult.isLoading}
                        className="group relative bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                      >
                        {approveTransactionResult.isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        <span>{approveTransactionResult.isLoading ? 'Approving...' : 'Approve'}</span>
                      </button>
                    )}
                    
                    {/* Reject Button */}
                    {transaction.status === 'Pending' && (
                      <button 
                        onClick={rejectTransaction}
                        disabled={rejectTransactionResult.isLoading}
                        className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                      >
                        {rejectTransactionResult.isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                        <span>{rejectTransactionResult.isLoading ? 'Rejecting...' : 'Reject'}</span>
                      </button>
                    )}
                    
                    {/* Execute Button */}
                    {canExecute && (
                      <button 
                        onClick={executeTransaction}
                        disabled={executeTransactionResult.isLoading}
                        className="group relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl sm:col-span-2 lg:col-span-1"
                      >
                        {executeTransactionResult.isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                        )}
                        <span>{executeTransactionResult.isLoading ? 'Executing...' : 'Execute'}</span>
                      </button>
                    )}
                    
                    {/* Waiting Status */}
                    {transaction.status === 'Pending' && !canExecute && (
                      <div className="sm:col-span-2 lg:col-span-3 bg-theme-bg-secondary border border-theme-border text-theme-secondary px-6 py-4 rounded-xl font-medium flex items-center justify-center gap-3">
                        <div className="w-5 h-5 bg-orange-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span>
                          Waiting for {requiredApprovals - currentApprovals} more approval{requiredApprovals - currentApprovals !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



