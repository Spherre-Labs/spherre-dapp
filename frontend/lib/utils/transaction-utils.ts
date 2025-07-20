import {
  TransactionType,
} from '@/lib/contracts/types'
import type {
  SpherreTransaction,
  TransactionData,
  UnifiedTransaction,
  TransactionDisplayInfo,
  TokenTransactionData,
  NFTTransactionData,
  MemberAddData,
  MemberRemoveData,
  EditPermissionTransaction,
  ThresholdChangeData,
  SmartTokenLockTransaction,
} from '@/lib/contracts/types'

// Map contract status to UI status
export function mapTransactionStatus(contractStatus: number): 'Pending' | 'Executed' | 'Rejected' {
  switch (contractStatus) {
    case 0:
      return 'Pending'
    case 1:
      return 'Executed'
    case 2:
      return 'Rejected'
    default:
      return 'Pending'
  }
}

// Transform contract transaction to unified format
export function transformTransaction(
  baseTransaction: SpherreTransaction,
  transactionData: TransactionData
): UnifiedTransaction {
  return {
    id: baseTransaction.id,
    status: mapTransactionStatus(baseTransaction.tx_status),
    proposer: baseTransaction.proposer,
    executor: baseTransaction.executor || undefined,
    approved: baseTransaction.approved,
    rejected: baseTransaction.rejected,
    dateCreated: baseTransaction.date_created,
    dateExecuted: baseTransaction.date_executed > BigInt(0) ? baseTransaction.date_executed : undefined,
    transactionType: baseTransaction.tx_type,
    data: transactionData,
  }
}

// Generate display information for transactions
export function getTransactionDisplayInfo(transaction: UnifiedTransaction): TransactionDisplayInfo {
  let title = ''
  let subtitle = ''
  let amount = ''
  let recipient = ''
  let token = ''

  switch (transaction.transactionType) {
    case TransactionType.TOKEN_SEND:
      {
        const tokenData = transaction.data as TokenTransactionData
        title = 'Token Transfer'
        subtitle = `Send ${formatTokenAmount(tokenData.amount)} tokens`
        amount = formatTokenAmount(tokenData.amount)
        recipient = formatAddress(tokenData.recipient)
        token = formatAddress(tokenData.token)
        break
      }
    case TransactionType.NFT_SEND:
      {
        const nftData = transaction.data as NFTTransactionData
        title = 'NFT Transfer'
        subtitle = `Send NFT #${nftData.token_id}`
        recipient = formatAddress(nftData.recipient)
        break
      }
    case TransactionType.MEMBER_ADD:
      {
        const memberAddData = transaction.data as MemberAddData
        title = 'Add Member'
        subtitle = `Add ${formatAddress(memberAddData.member)} as member`
        recipient = formatAddress(memberAddData.member)
        break
      }
    case TransactionType.MEMBER_REMOVE:
      {
        const memberRemoveData = transaction.data as MemberRemoveData
        title = 'Remove Member'
        subtitle = `Remove ${formatAddress(memberRemoveData.member_address)}`
        recipient = formatAddress(memberRemoveData.member_address)
        break
      }
    case TransactionType.MEMBER_PERMISSION_EDIT:
      {
        const permissionData = transaction.data as EditPermissionTransaction
        title = 'Edit Permissions'
        subtitle = `Update permissions for ${formatAddress(permissionData.member)}`
        recipient = formatAddress(permissionData.member)
        break
      }
    case TransactionType.THRESHOLD_CHANGE:
      {
        const thresholdData = transaction.data as ThresholdChangeData
        title = 'Change Threshold'
        subtitle = `Set threshold to ${thresholdData.new_threshold}`
        amount = thresholdData.new_threshold.toString()
        break
      }
    case TransactionType.SMART_TOKEN_LOCK:
      {
        const smartLockData = transaction.data as SmartTokenLockTransaction
        title = 'Smart Token Lock'
        subtitle = `Lock ${formatTokenAmount(smartLockData.amount)} tokens for ${smartLockData.duration} seconds`
        amount = formatTokenAmount(smartLockData.amount)
        token = formatAddress(smartLockData.token)
        break
      }

    default:
      title = 'Unknown Transaction'
      subtitle = 'Transaction type not recognized'
      break
  }

  return {
    transaction,
    title,
    subtitle,
    amount,
    recipient,
    token,
  }
}

// Utility functions for formatting
export function formatAddress(address: string): string {
  if (!address) return ''
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatTokenAmount(amount: bigint, decimals: number = 18): string {
  // Convert from wei to readable format (assuming 18 decimals)
  const divisor = BigInt(10) ** BigInt(decimals)
  const whole = amount / divisor
  const decimal = amount % divisor

  if (decimal === BigInt(0)) {
    return whole.toString()
  }

  // Show up to 6 decimal places
  const decimalStr = decimal.toString().padStart(18, '0')
  const trimmedDecimal = decimalStr.slice(0, 6).replace(/0+$/, '')

  return trimmedDecimal ? `${whole}.${trimmedDecimal}` : whole.toString()
}

export function formatTimestamp(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000)
  return date.toLocaleDateString()
}

export function formatTime(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000)
  return date.toLocaleTimeString()
}

// Group transactions by date for UI display
export function groupTransactionsByDate(transactions: TransactionDisplayInfo[]): Record<string, TransactionDisplayInfo[]> {
  return transactions.reduce((acc, txInfo) => {
    const dateKey = formatTimestamp(txInfo.transaction.dateCreated)
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(txInfo)
    return acc
  }, {} as Record<string, TransactionDisplayInfo[]>)
}

// Sort transactions by date (newest first)
export function sortTransactionsByDate(transactions: TransactionDisplayInfo[]): TransactionDisplayInfo[] {
  return [...transactions].sort((a, b) => {
    return Number(b.transaction.dateCreated - a.transaction.dateCreated)
  })
}

// Filter transactions by status
export function filterTransactionsByStatus(
  transactions: TransactionDisplayInfo[],
  status: 'Pending' | 'Executed' | 'Rejected'
): TransactionDisplayInfo[] {
  return transactions.filter(tx => tx.transaction.status === status)
}

// Filter transactions by type
export function filterTransactionsByType(
  transactions: TransactionDisplayInfo[],
  type: TransactionType
): TransactionDisplayInfo[] {
  return transactions.filter(tx => tx.transaction.transactionType === type)
} 