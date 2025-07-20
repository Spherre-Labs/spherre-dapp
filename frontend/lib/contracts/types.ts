import type { Abi, InvokeFunctionResponse } from 'starknet'

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

// Transaction types from the contract
export enum TransactionType {
  VOID = 0,
  MEMBER_ADD = 1,
  MEMBER_REMOVE = 2,
  MEMBER_PERMISSION_EDIT = 3,
  THRESHOLD_CHANGE = 4,
  TOKEN_SEND = 5,
  NFT_SEND = 6,
  SMART_TOKEN_LOCK = 7,
}

export interface SpherreTransaction {
  id: bigint
  tx_type: TransactionType
  tx_status: number // Renamed from TransactionStatus to avoid redeclaration
  proposer: string
  executor: string
  approved: string[]
  rejected: string[]
  date_created: bigint
  date_executed: bigint
}

// Permission types
export enum PermissionEnum {
  PROPOSER = 0,
  VOTER = 1,
  EXECUTOR = 2,
}

// Member data structures
export interface MemberAddData {
  member: string
  permissions: number // u8 bitmask
}

export interface MemberRemoveData {
  member_address: string
}

export interface EditPermissionTransaction {
  member: string
  new_permissions: number // u8 bitmask
}

// Token transaction data
export interface TokenTransactionData {
  token: string
  amount: bigint
  recipient: string
}

// NFT transaction data
export interface NFTTransactionData {
  nft_contract: string
  token_id: bigint
  recipient: string
}

// Threshold change data
export interface ThresholdChangeData {
  new_threshold: bigint
}

// Smart Token Lock transaction data
export interface SmartTokenLockTransaction {
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
  status: 'Pending' | 'Executed' | 'Rejected'
  proposer: string
  executor?: string
  approved: string[]
  rejected: string[]
  dateCreated: bigint
  dateExecuted?: bigint
  transactionType: TransactionType
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
