'use client'

import { CairoOption, CairoOptionVariant } from 'starknet'
import { useScaffoldReadContract } from './useScaffoldReadContract'
import { useScaffoldWriteContract } from './useScaffoldWriteContract'
import {
  spherreConfig,
  spherreAccountConfig,
} from '@/lib/contracts/spherre-contracts'
import type {
  AccountDetails,
  SpherreTransaction,
  U256,
  TokenTransactionData,
  NFTTransactionData,
  MemberAddData,
  MemberRemoveData,
  EditPermissionTransaction,
  ThresholdChangeData,
  SmartTokenLockTransaction,
} from '@/lib/contracts/types'

// Factory Contract Hooks
export function useDeployAccount() {
  return useScaffoldWriteContract({
    contractConfig: spherreConfig,
    functionName: 'deploy_account',
  })
}

export function useIsDeployedAccount(accountAddress: `0x${string}`) {
  return useScaffoldReadContract<boolean>({
    contractConfig: spherreConfig,
    functionName: 'is_deployed_account',
    args: accountAddress ? { account: accountAddress } : undefined,
    enabled: !!accountAddress,
  })
}

export function useGetDeploymentFee(address: `0x${string}`) {
  return useScaffoldReadContract<bigint>({
    contractConfig: spherreConfig,
    functionName: 'get_fee',
    args: { fees_type: 4, account: address },
  })
}

export function useGetFeesTokenAddress() {
  return useScaffoldReadContract<`0x${string}`>({
    contractConfig: spherreConfig,
    functionName: 'get_fees_token',
  })
}

export function useGetAccountClassHash() {
  return useScaffoldReadContract<string>({
    contractConfig: spherreConfig,
    functionName: 'get_account_class_hash',
  })
}

// Account Contract Read Hooks
export function useGetAccountMembers(accountAddress: `0x${string}`) {
  return useScaffoldReadContract<string[]>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'get_account_members',
    enabled: !!accountAddress,
  })
}

export function useGetMembersCount(accountAddress: `0x${string}`) {
  return useScaffoldReadContract<bigint>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'get_members_count',
    enabled: !!accountAddress,
  })
}

export function useGetThreshold(accountAddress: `0x${string}`) {
  return useScaffoldReadContract<[bigint, bigint]>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'get_threshold',
    enabled: !!accountAddress,
  })
}

export function useGetAccountName(accountAddress: `0x${string}`) {
  return useScaffoldReadContract<string>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'get_name',
    enabled: !!accountAddress,
  })
}

export function useGetAccountDescription(accountAddress: `0x${string}`) {
  return useScaffoldReadContract<string>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'get_description',
    enabled: !!accountAddress,
  })
}

export function useGetAccountDetails(accountAddress: `0x${string}`) {
  return useScaffoldReadContract<AccountDetails>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'get_account_details',
    enabled: !!accountAddress,
  })
}

export function useIsMember(
  accountAddress: `0x${string}`,
  memberAddress: `0x${string}`,
) {
  return useScaffoldReadContract<boolean>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'is_member',
    args: memberAddress ? { address: memberAddress } : undefined,
    enabled: !!(accountAddress && memberAddress),
  })
}

export function useGetTransaction(
  accountAddress: `0x${string}`,
  transactionId: U256,
) {
  return useScaffoldReadContract<SpherreTransaction>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'get_transaction',
    args: transactionId ? { transaction_id: transactionId } : undefined,
    enabled: !!(accountAddress && transactionId),
  })
}

// Transaction List Hooks
export function useTransactionList(
  accountAddress: `0x${string}`,
  start?: bigint,
  limit?: bigint,
) {
  // Use proper CairoOption class for Option types
  const args = {
    start:
      start !== undefined
        ? new CairoOption<bigint>(CairoOptionVariant.Some, start)
        : new CairoOption<bigint>(CairoOptionVariant.None),
    limit:
      limit !== undefined
        ? new CairoOption<bigint>(CairoOptionVariant.Some, limit)
        : new CairoOption<bigint>(CairoOptionVariant.None),
  }

  return useScaffoldReadContract<SpherreTransaction[]>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'transaction_list',
    args,
    enabled: !!accountAddress,
  })
}

export function useTokenTransactionList(accountAddress: `0x${string}`) {
  return useScaffoldReadContract<TokenTransactionData[]>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'token_transaction_list',
    enabled: !!accountAddress,
  })
}

export function useNftTransactionList(accountAddress: `0x${string}`) {
  return useScaffoldReadContract<NFTTransactionData[]>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'nft_transaction_list',
    enabled: !!accountAddress,
  })
}

export function useMemberAddTransactionList(accountAddress: `0x${string}`) {
  return useScaffoldReadContract<MemberAddData[]>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'member_add_transaction_list',
    enabled: !!accountAddress,
  })
}

export function useMemberRemovalTransactionList(accountAddress: `0x${string}`) {
  return useScaffoldReadContract<MemberRemoveData[]>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'member_removal_transaction_list',
    enabled: !!accountAddress,
  })
}

export function useEditPermissionTransactionList(
  accountAddress: `0x${string}`,
) {
  return useScaffoldReadContract<EditPermissionTransaction[]>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'get_edit_permission_transaction_list',
    enabled: !!accountAddress,
  })
}

export function useSmartTokenLockTransactionList(
  accountAddress: `0x${string}`,
) {
  return useScaffoldReadContract<SmartTokenLockTransaction[]>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'smart_token_lock_transaction_list',
    enabled: !!accountAddress,
  })
}

export function useAllThresholdChangeTransactions(
  accountAddress: `0x${string}`,
) {
  return useScaffoldReadContract<ThresholdChangeData[]>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'get_all_threshold_change_transactions',
    enabled: !!accountAddress,
  })
}

// Individual Transaction Getter Hooks
export function useGetTokenTransaction(
  accountAddress: `0x${string}`,
  transactionId: U256,
) {
  return useScaffoldReadContract<TokenTransactionData>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'get_token_transaction',
    args: transactionId ? { id: transactionId } : undefined,
    enabled: !!(accountAddress && transactionId),
  })
}

export function useGetNftTransaction(
  accountAddress: `0x${string}`,
  transactionId: U256,
) {
  return useScaffoldReadContract<NFTTransactionData>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'get_nft_transaction',
    args: transactionId ? { id: transactionId } : undefined,
    enabled: !!(accountAddress && transactionId),
  })
}

export function useGetMemberAddTransaction(
  accountAddress: `0x${string}`,
  transactionId: U256,
) {
  return useScaffoldReadContract<MemberAddData>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'get_member_add_transaction',
    args: transactionId ? { transaction_id: transactionId } : undefined,
    enabled: !!(accountAddress && transactionId),
  })
}

export function useGetMemberRemovalTransaction(
  accountAddress: `0x${string}`,
  transactionId: U256,
) {
  return useScaffoldReadContract<MemberRemoveData>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'get_member_removal_transaction',
    args: transactionId ? { transaction_id: transactionId } : undefined,
    enabled: !!(accountAddress && transactionId),
  })
}

export function useGetEditPermissionTransaction(
  accountAddress: `0x${string}`,
  transactionId: U256,
) {
  return useScaffoldReadContract<EditPermissionTransaction>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'get_edit_permission_transaction',
    args: transactionId ? { transaction_id: transactionId } : undefined,
    enabled: !!(accountAddress && transactionId),
  })
}

export function useGetSmartTokenLockTransaction(
  accountAddress: `0x${string}`,
  transactionId: U256,
) {
  return useScaffoldReadContract<SmartTokenLockTransaction>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'get_smart_token_lock_transaction',
    args: transactionId ? { transaction_id: transactionId } : undefined,
    enabled: !!(accountAddress && transactionId),
  })
}

export function useGetThresholdChangeTransaction(
  accountAddress: `0x${string}`,
  transactionId: U256,
) {
  return useScaffoldReadContract<ThresholdChangeData>({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'get_threshold_change_transaction',
    args: transactionId ? { id: transactionId } : undefined,
    enabled: !!(accountAddress && transactionId),
  })
}

// Account Contract Write Hooks
export function useApproveTransaction(accountAddress: `0x${string}`) {
  return useScaffoldWriteContract({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'approve_transaction',
  })
}

export function useRejectTransaction(accountAddress: `0x${string}`) {
  return useScaffoldWriteContract({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'reject_transaction',
  })
}

export function useProposeMemberAdd(accountAddress: `0x${string}`) {
  return useScaffoldWriteContract({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'propose_member_add_transaction',
  })
}

export function useExecuteMemberAdd(accountAddress: `0x${string}`) {
  return useScaffoldWriteContract({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'execute_member_add_transaction',
  })
}

export function useProposeMemberRemove(accountAddress: `0x${string}`) {
  return useScaffoldWriteContract({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'propose_remove_member_transaction',
  })
}

export function useExecuteMemberRemove(accountAddress: `0x${string}`) {
  return useScaffoldWriteContract({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'execute_remove_member_transaction',
  })
}

export function useProposeTokenTransaction(accountAddress: `0x${string}`) {
  return useScaffoldWriteContract({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'propose_token_transaction',
  })
}

export function useExecuteTokenTransaction(accountAddress: `0x${string}`) {
  return useScaffoldWriteContract({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'execute_token_transaction',
  })
}

export function useProposeThresholdChange(accountAddress: `0x${string}`) {
  return useScaffoldWriteContract({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'propose_threshold_change_transaction',
  })
}

export function useExecuteThresholdChange(accountAddress: `0x${string}`) {
  return useScaffoldWriteContract({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'execute_threshold_change_transaction',
  })
}

// Add execute_transaction hook
export function useExecuteTransaction(accountAddress: `0x${string}`) {
  return useScaffoldWriteContract({
    contractConfig: {
      address: accountAddress,
      abi: spherreAccountConfig.abi,
    },
    functionName: 'execute_transaction',
  })
}

// Utility hooks that combine multiple operations
export function useAccountInfo(accountAddress: `0x${string}`) {
  const {
    data: membersRaw,
    isLoading: membersLoading,
    error: membersError,
  } = useGetAccountMembers(accountAddress)
  const {
    data: threshold,
    isLoading: thresholdLoading,
    error: thresholdError,
  } = useGetThreshold(accountAddress)
  const {
    data: details,
    isLoading: detailsLoading,
    error: detailsError,
  } = useGetAccountDetails(accountAddress)
  const {
    data: membersCount,
    isLoading: countLoading,
    error: countError,
  } = useGetMembersCount(accountAddress)

  // Filter out placeholder addresses (like '0x0') and only count valid addresses
  const members = Array.isArray(membersRaw)
    ? membersRaw.filter((addr) => addr && addr !== '0x0' && addr !== '')
    : []

  return {
    members,
    threshold,
    details,
    membersCount,
    isLoading:
      membersLoading || thresholdLoading || detailsLoading || countLoading,
    error: membersError || thresholdError || detailsError || countError,
  }
}
