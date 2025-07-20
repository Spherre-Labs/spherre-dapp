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
    return <div className="text-theme text-center p-10 bg-theme min-h-screen transition-colors duration-300">Loading...</div>
  }
  
  const transaction = transactions.find(
    (t) => t.id === parseInt(resolvedParams.id),
  )

  if (!transaction) {
    return (
      <div className="text-theme text-center p-10 bg-theme min-h-screen transition-colors duration-300">
        Transaction not found.
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
    <div className="bg-theme-bg-secondary border border-theme-border text-theme p-6 rounded-lg h-[95.5vh] transition-colors duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
          toastMessage.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toastMessage.message}
          </div>
        </div>
      )}

      <TransactionDetailsHeader status={transaction.status} />
      <TransactionSummary transaction={transaction} />
      <TransactionDetailsBody transaction={transaction} />
      
      {/* Enhanced Approval Status */}
      <div className="mt-6 p-4 bg-theme-bg-tertiary border border-theme-border rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-theme font-medium">Approval Status</h3>
          <span className="text-sm text-theme-secondary">
            {currentApprovals} of {requiredApprovals} required
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-theme-border rounded-full h-2 mb-3">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              currentApprovals >= requiredApprovals ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min((currentApprovals / requiredApprovals) * 100, 100)}%` }}
          ></div>
        </div>
        
        {canExecute && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Ready to execute
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 mt-6 pt-6 border-t border-theme-border">
        {!accountAddress ? (
          <div className="bg-theme-bg-tertiary border border-theme-border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2 text-theme-secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-medium">Wallet Required</span>
            </div>
            <p className="text-sm text-theme-secondary mb-4">
              Connect your wallet to manage this transaction.
            </p>
            <button 
              onClick={handleConnectWallet}
              className="bg-primary hover:opacity-90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
            >
              Connect Wallet
            </button>
          </div>
        ) : !isMember ? (
          <div className="bg-theme-bg-tertiary border border-theme-border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2 text-theme-secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span className="font-medium">Access Restricted</span>
            </div>
            <p className="text-sm text-theme-secondary">
              Only account members can manage transactions.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-theme-bg-tertiary border border-theme-border rounded-lg p-3 mb-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-theme-secondary">Connected:</span>
                <span className="text-theme font-mono text-xs">
                  {accountAddress.slice(0, 6)}...{accountAddress.slice(-4)}
                </span>
                {isMember && (
                  <span className="ml-auto text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">
                    Member
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Approve Button - Only for pending transactions */}
              {transaction.status === 'Pending' && (
                <button 
                  onClick={approveTransaction}
                  disabled={approveTransactionResult.isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {approveTransactionResult.isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {approveTransactionResult.isLoading ? 'Approving...' : 'Approve Transaction'}
                </button>
              )}
              
              {/* Reject Button - Only for pending transactions */}
              {transaction.status === 'Pending' && (
                <button 
                  onClick={rejectTransaction}
                  disabled={rejectTransactionResult.isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {rejectTransactionResult.isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {rejectTransactionResult.isLoading ? 'Rejecting...' : 'Reject Transaction'}
                </button>
              )}
              
              {/* Execute Button - Only when threshold is met */}
              {canExecute && (
                <button 
                  onClick={executeTransaction}
                  disabled={executeTransactionResult.isLoading}
                  className="flex-1 bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {executeTransactionResult.isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {executeTransactionResult.isLoading ? 'Executing...' : 'Execute Transaction'}
                </button>
              )}
              
              {/* Information about execution eligibility */}
              {transaction.status === 'Pending' && !canExecute && (
                <div className="flex-1 bg-theme-bg-tertiary border border-theme-border text-theme-secondary px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Waiting for {requiredApprovals - currentApprovals} more approval{requiredApprovals - currentApprovals !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}



