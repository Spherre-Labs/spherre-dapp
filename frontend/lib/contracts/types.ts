import type { Abi, CairoCustomEnum, InvokeFunctionResponse } from 'starknet'

// Base contract configuration
export interface ContractConfig {
  address: string
  abi: Abi
}

// Generic contract function arguments - using unknown instead of any
export type ContractFunctionArgs = Record<string, unknown>

// Transaction status types
export type TransactionStatus = 'pending' | 'success' | 'failed' | 'rejected'

// Contract read result - using generic with unknown default
export interface ContractReadResult<T = unknown> {
  data: T | undefined
  error: Error | null
  isLoading: boolean
  refetch: () => void
}

// Contract write result
export interface ContractWriteResult {
  writeAsync: (args?: ContractFunctionArgs) => Promise<InvokeFunctionResponse>
  data: InvokeFunctionResponse | undefined
  error: Error | null
  isLoading: boolean
  isSuccess: boolean
  reset: () => void
}

// Transaction receipt result - using unknown for data
export interface TransactionReceiptResult {
  data: unknown
  error: Error | null
  isLoading: boolean
  status: TransactionStatus
}

// Spherre specific types based on actual contract
export interface AccountDetails {
  name: string
  description: string
}

export interface AccountData {
  name: string
  description: string
  members: string[]
  threshold: bigint
}

// Transaction types from the contract
export enum TransactionType {
  VOID = 'VOID',
  MEMBER_ADD = 'MEMBER_ADD',
  MEMBER_REMOVE = 'MEMBER_REMOVE',
  MEMBER_PERMISSION_EDIT = 'MEMBER_PERMISSION_EDIT',
  THRESHOLD_CHANGE = 'THRESHOLD_CHANGE',
  TOKEN_SEND = 'TOKEN_SEND',
  NFT_SEND = 'NFT_SEND',
  SMART_TOKEN_LOCK = 'SMART_TOKEN_LOCK',
}

// type TxTypeVariant = {
//   VOID: string | undefined,
//   MEMBER_ADD: string | undefined,
//   MEMBER_REMOVE: string | undefined
// }

// export enum TxStatus {
//   VOID = 'VOID',
//   MEMBER_ADD = 'MEMBER_ADD',
//   MEMBER_REMOVE = 'MEMBER_REMOVE',
//   MEMBER_PERMISSION_EDIT = 'MEMBER_PERMISSION_EDIT',
//   THRESHOLD_CHANGE = 'THRESHOLD_CHANGE',
//   TOKEN_SEND = 'TOKEN_SEND',
//   NFT_SEND = 'NFT_SEND',
//   SMART_TOKEN_LOCK = 'SMART_TOKEN_LOCK',
// }

export interface SpherreTransaction {
  id: bigint
  tx_type: CairoCustomEnum
  tx_status: CairoCustomEnum // Renamed from TransactionStatus to avoid redeclaration
  proposer: string
  executor: string
  approved: string[]
  rejected: string[]
  date_created: bigint
  date_executed: bigint
}

export interface LockedPlan {
  token: `0x${string}`
  date_locked: bigint
  token_amount: bigint
  lock_duration: bigint
  lock_status: CairoCustomEnum
}

// Permission types
export enum PermissionEnum {
  PROPOSER = 0,
  VOTER = 1,
  EXECUTOR = 2,
}

// Member data structures
export interface MemberAddData {
  type: TransactionType.MEMBER_ADD
  member: string
  permissions: bigint // u8 bitmask
}

export interface MemberRemoveData {
  type: TransactionType.MEMBER_REMOVE
  member_address: string
}

export interface EditPermissionTransaction {
  type: TransactionType.MEMBER_PERMISSION_EDIT
  member: string
  new_permissions: bigint // u8 bitmask
}

// Token transaction data
export interface TokenTransactionData {
  type: TransactionType.TOKEN_SEND
  token: string
  amount: bigint
  recipient: string
}

// NFT transaction data
export interface NFTTransactionData {
  type: TransactionType.NFT_SEND
  nft_contract: string
  token_id: bigint
  recipient: string
}

// Threshold change data
export interface ThresholdChangeData {
  type: TransactionType.THRESHOLD_CHANGE
  new_threshold: bigint
}

// Smart Token Lock transaction data
export interface SmartTokenLockTransaction {
  type: TransactionType.SMART_TOKEN_LOCK
  token: string
  amount: bigint
  duration: bigint
  transaction_id: bigint
}

// Account deployment data
export interface AccountDeploymentData {
  owner: string
  name: string
  description: string
  members: string[]
  threshold: bigint
}

// Token types
export interface TokenInfo {
  address: string
  name: string
  symbol: string
  decimals: number
  icon?: string
}

export interface TokenBalance {
  token: TokenInfo
  balance: bigint
  formattedBalance: string
}

// Utility type for u256 values
export type U256 = bigint | string | number

// Unified transaction types for UI integration
export interface BaseTransactionDisplay {
  id: string | bigint
  status: 'Initiated' | 'Executed' | 'Rejected' | 'Approved'
  proposer: string
  executor?: string
  approved: string[]
  rejected: string[]
  dateCreated: bigint
  dateExecuted?: bigint
  transactionType: TransactionType
  transaction_id?: string
}

// Transaction data union type
export type TransactionData =
  | TokenTransactionData
  | NFTTransactionData
  | MemberAddData
  | MemberRemoveData
  | EditPermissionTransaction
  | ThresholdChangeData
  | SmartTokenLockTransaction

// Complete transaction with base info and specific data
export interface UnifiedTransaction extends BaseTransactionDisplay {
  data: TransactionData
}

// For UI components - transaction with display helpers
export interface TransactionDisplayInfo {
  transaction: UnifiedTransaction
  title: string
  subtitle?: string
  amount?: string
  recipient?: string
  token?: string
}
