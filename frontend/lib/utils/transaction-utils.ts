import { TransactionType } from '@/lib/contracts/types'
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
export function mapTransactionStatus(
  contractStatus: number,
): 'Pending' | 'Executed' | 'Rejected' {
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
  transactionData: TransactionData,
): UnifiedTransaction {
  return {
    id: baseTransaction.id,
    status: baseTransaction.tx_status.activeVariant(),
    proposer: contractAddressToHex(baseTransaction.proposer),
    executor: contractAddressToHex(baseTransaction.executor) || undefined,
    approved: baseTransaction.approved.map((approver) => contractAddressToHex(approver)),
    rejected: baseTransaction.rejected.map((rejector) => contractAddressToHex(rejector)),
    dateCreated: baseTransaction.date_created,
    dateExecuted:
      baseTransaction.date_executed > BigInt(0)
        ? baseTransaction.date_executed
        : undefined,
    transactionType: baseTransaction.tx_type.activeVariant(),
    data: transactionData, //TODO: Transform this
  }
}

// TODO: MAKE THIS FUNCTION WORK PROPERLY
export function transformTransactionData(
  transactionData: TransactionData
) {

  switch(transactionData.type) {
    case TransactionType.TOKEN_SEND: {
      return {
        type: transactionData.type,
        token: contractAddressToHex(transactionData.token),
        amount: transactionData.amount,
        recipient: contractAddressToHex(transactionData.recipient),
      }
    }

    case TransactionType.MEMBER_ADD: {
      return {
        type: transactionData.type,
        member: contractAddressToHex(transactionData.member),
        permissions: transactionData.permissions,
      }
    }

    case TransactionType.MEMBER_PERMISSION_EDIT: {
      return {
        type: transactionData.type,
        member: contractAddressToHex(transactionData.member),
        new_permissions: transactionData.new_permissions,
      }
    }

    case TransactionType.MEMBER_REMOVE: {
      return {
        type: transactionData.type,
        member_address: contractAddressToHex(transactionData.member_address),
      }
    }

    case TransactionType.NFT_SEND: {
      return {
        type: transactionData.type,
        nft_contract: contractAddressToHex(transactionData.nft_contract),
        token_id: transactionData.token_id,
        recipient: contractAddressToHex(transactionData.recipient),
      }
    }

    case TransactionType.SMART_TOKEN_LOCK: {
      return {
        type: transactionData.type,
        token: contractAddressToHex(transactionData.token),
        amount: transactionData.amount,
        duration: transactionData.duration,
        transaction_id: transactionData.transaction_id,
      }
    }

    case TransactionType.THRESHOLD_CHANGE: {
      return {
        type: transactionData.type,
        new_threshold: transactionData.new_threshold,
      }
    }
  }

  // return transformedData
}

// Generate display information for transactions
export function getTransactionDisplayInfo(
  transaction: UnifiedTransaction,
): TransactionDisplayInfo {
  let title = ''
  let subtitle = ''
  let amount = ''
  let recipient = ''
  let token = ''

  switch (transaction.transactionType) {
    case TransactionType.TOKEN_SEND: {
      const tokenData = transaction.data as TokenTransactionData
      title = 'Token Transfer'
      subtitle = `Send ${formatTokenAmount(tokenData?.amount)} tokens`
      amount = formatTokenAmount(tokenData?.amount)
      recipient = formatAddress(contractAddressToHex(tokenData?.recipient))
      token = formatAddress(contractAddressToHex(tokenData?.token))
      break
    }
    case TransactionType.NFT_SEND: {
      const nftData = transaction.data as NFTTransactionData
      title = 'NFT Transfer'
      subtitle = `Send NFT #${nftData?.token_id}`
      recipient = formatAddress(contractAddressToHex(nftData?.recipient))
      break
    }
    case TransactionType.MEMBER_ADD: {
      const memberAddData = transaction.data as MemberAddData
      title = 'Add Member'
      subtitle = `Add ${formatAddress(contractAddressToHex(memberAddData?.member))} as member`
      recipient = formatAddress(contractAddressToHex(memberAddData?.member))
      break
    }
    case TransactionType.MEMBER_REMOVE: {
      const memberRemoveData = transaction.data as MemberRemoveData
      title = 'Remove Member'
      subtitle = `Remove ${formatAddress(contractAddressToHex(memberRemoveData?.member_address))}`
      recipient = formatAddress(contractAddressToHex(memberRemoveData?.member_address))
      break
    }
    case TransactionType.MEMBER_PERMISSION_EDIT: {
      const permissionData = transaction.data as EditPermissionTransaction
      title = 'Edit Permissions'
      subtitle = `Update permissions for ${formatAddress(contractAddressToHex(permissionData?.member))}`
      recipient = formatAddress(contractAddressToHex(permissionData?.member))
      break
    }
    case TransactionType.THRESHOLD_CHANGE: {
      const thresholdData = transaction.data as ThresholdChangeData
      title = 'Change Threshold'
      subtitle = `Set threshold to ${thresholdData?.new_threshold}`
      amount = thresholdData?.new_threshold?.toString()
      break
    }
    case TransactionType.SMART_TOKEN_LOCK: {
      const smartLockData = transaction.data as SmartTokenLockTransaction
      title = 'Smart Token Lock'
      subtitle = `Lock ${formatTokenAmount(smartLockData?.amount)} tokens for ${smartLockData?.duration} seconds`
      amount = formatTokenAmount(smartLockData?.amount)
      token = formatAddress(contractAddressToHex(smartLockData?.token))
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

  const addressString = address.toString()
  if (addressString.length <= 10) return addressString
  return `${addressString.slice(0, 6)}...${addressString.slice(-4)}`
}

export function formatTokenAmount(
  amount: bigint,
  decimals: number = 18,
): string {
  // Convert from wei to readable format (assuming 18 decimals)
  const divisor = 10 ** decimals
  const whole = amount / BigInt(divisor)
  const decimal = amount % BigInt(divisor)

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
export function groupTransactionsByDate(
  transactions: TransactionDisplayInfo[],
): Record<string, TransactionDisplayInfo[]> {
  return transactions.reduce(
    (acc, txInfo) => {
      const dateKey = formatTimestamp(txInfo.transaction.dateCreated)
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(txInfo)
      return acc
    },
    {} as Record<string, TransactionDisplayInfo[]>,
  )
}

// Sort transactions by date (newest first)
export function sortTransactionsByDate(
  transactions: TransactionDisplayInfo[],
): TransactionDisplayInfo[] {
  return [...transactions].sort((a, b) => {
    return Number(b.transaction.dateCreated - a.transaction.dateCreated)
  })
}

// Filter transactions by status
export function filterTransactionsByStatus(
  transactions: TransactionDisplayInfo[],
  status: 'Pending' | 'Executed' | 'Rejected',
): TransactionDisplayInfo[] {
  return transactions.filter((tx) => tx.transaction.status === status)
}

// Filter transactions by type
export function filterTransactionsByType(
  transactions: TransactionDisplayInfo[],
  type: TransactionType,
): TransactionDisplayInfo[] {
  return transactions.filter((tx) => tx.transaction.transactionType === type)
}

export function contractAddressToHex(addressValue: string | bigint | number): `0x${string}` {
  if (!addressValue) return "0x0" as `0x${string}`;
  
  let bigIntValue: bigint;
  
  // Handle different input types
  if (typeof addressValue === 'bigint') {
    bigIntValue = addressValue;
  } else if (typeof addressValue === 'number') {
    bigIntValue = BigInt(addressValue);
  } else {
    // This handles the case where it is already a string
    // If it's already a hex string, return as is (with proper formatting)
    if (addressValue.startsWith('0x')) {
      return addressValue.toLowerCase().padStart(66, '0') as `0x${string}`; // Ensure 64 chars after 0x
    }
    // If it's a decimal string, convert to BigInt
    bigIntValue = BigInt(addressValue);
  }
  
  // Convert to hex string
  const hexString = bigIntValue.toString(16);
  
  // Pad to 64 characters (32 bytes) and add 0x prefix
  const paddedHex = '0x' + hexString.padStart(64, '0');
  
  return paddedHex as `0x${string}`;
}