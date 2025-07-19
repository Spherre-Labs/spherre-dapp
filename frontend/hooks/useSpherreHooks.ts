'use client'

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

// Utility hooks that combine multiple operations
export function useAccountInfo(accountAddress: `0x${string}`) {
  const {
    data: members,
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
