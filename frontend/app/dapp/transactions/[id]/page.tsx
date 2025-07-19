'use client'
import React from 'react'
import { transactions } from '@/app/dapp/transactions/data'
import { TransactionDetailsHeader } from './components/TransactionDetailsHeader'
import { TransactionSummary } from './components/TransactionSummary'
import { TransactionDetailsBody } from './components/TransactionParticipants'
import { useTheme } from '@/app/context/theme-context-provider'
import { useExecuteTransaction, useApproveTransaction, useRejectTransaction } from '@/hooks/useSpherreHooks'
import { useAccount, useConnect, type Connector } from '@starknet-react/core'
import { useStarknetkitConnectModal, type StarknetkitConnector } from 'starknetkit'

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
  
  React.useEffect(() => {
    Promise.resolve(params).then(setResolvedParams)
  }, [params])

  // Use a fallback address if no wallet is connected (for testing)
  const contractAddress = accountAddress || "0x1234567890abcdef"

  // Always call hooks in the same order - before any conditional returns
  const executeTransactionResult = useExecuteTransaction(contractAddress);
  const approveTransactionResult = useApproveTransaction(contractAddress);
  const rejectTransactionResult = useRejectTransaction(contractAddress);
  
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

  const approveTransaction = async () => {
    try {
      console.log('🔄 Approving transaction...');
      const result = await approveTransactionResult.writeAsync({ transaction_id: resolvedParams.id });
      console.log('✅ Transaction approved:', result);
    } catch (error) {
      console.error('❌ Failed to approve transaction:', error);
    }
  }

  const rejectTransaction = async () => {
    try {
      console.log('🔄 Rejecting transaction...');
      const result = await rejectTransactionResult.writeAsync({ transaction_id: resolvedParams.id });
      console.log('✅ Transaction rejected:', result);
    } catch (error) {
      console.error('❌ Failed to reject transaction:', error);
    }
  }

  const executeTransaction = async () => {
    try {
      console.log('🔄 Executing transaction...');
      const result = await executeTransactionResult.writeAsync({ transaction_id: resolvedParams.id });
      console.log('✅ Transaction executed:', result);
    } catch (error) {
      console.error('❌ Failed to execute transaction:', error);
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
    }
  }



  return (
    <div className="bg-theme-bg-secondary border border-theme-border text-theme p-6 rounded-lg h-[95.5vh] transition-colors duration-300">
      <TransactionDetailsHeader status={transaction.status} />
      <TransactionSummary transaction={transaction} />
      <TransactionDetailsBody transaction={transaction} />
      
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
               Connect your wallet to approve, reject, or execute transactions.
             </p>
             <button 
               onClick={handleConnectWallet}
               className="bg-primary hover:opacity-90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
             >
               Connect Wallet
             </button>
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
               </div>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-3">
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
             </div>
           </>
         )}
       </div>
    </div>
 )
}



