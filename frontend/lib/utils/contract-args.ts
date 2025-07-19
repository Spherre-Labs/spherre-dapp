import { isValidStarknetAddress } from './validation'
import type { U256, PermissionEnum } from '../contracts/types'

// Type for resolver functions - accepts unknown and returns any type
type ResolverFunction<T = unknown> = (value: unknown) => T

// Argument validation and formatting utilities
export class ContractArgsResolver {
  /**
   * Validates and formats StarkNet address
   */
  static resolveAddress(address: string): string {
    if (!isValidStarknetAddress(address)) {
      throw new Error(`Invalid StarkNet address: ${address}`)
    }
    return address.toLowerCase()
  }

  /**
   * Validates and formats array of addresses
   */
  static resolveAddressArray(addresses: string[]): string[] {
    if (!Array.isArray(addresses) || addresses.length === 0) {
      throw new Error('Address array cannot be empty')
    }

    return addresses.map((addr, index) => {
      try {
        return this.resolveAddress(addr)
      } catch {
        throw new Error(`Invalid address at index ${index}: ${addr}`)
      }
    })
  }

  /**
   * Validates and formats threshold value
   */
  static resolveThreshold(threshold: number, memberCount: number): bigint {
    if (!Number.isInteger(threshold) || threshold < 1) {
      throw new Error('Threshold must be a positive integer')
    }

    if (threshold > memberCount) {
      throw new Error(
        `Threshold (${threshold}) cannot exceed member count (${memberCount})`,
      )
    }

    return BigInt(threshold)
  }

  /**
   * Validates and formats U256 value
   */
  static resolveU256(value: U256): bigint {
    if (typeof value === 'bigint') {
      return value
    }

    if (typeof value === 'string') {
      try {
        return BigInt(value)
      } catch {
        throw new Error(`Invalid U256 string: ${value}`)
      }
    }

    if (typeof value === 'number') {
      if (!Number.isInteger(value) || value < 0) {
        throw new Error(`Invalid U256 number: ${value}`)
      }
      return BigInt(value)
    }

    throw new Error(`Invalid U256 value: ${value}`)
  }

  /**
   * Validates and formats permission mask
   */
  static resolvePermissionMask(permissions: PermissionEnum[]): number {
    if (!Array.isArray(permissions)) {
      throw new Error('Permissions must be an array')
    }

    let mask = 0
    for (const permission of permissions) {
      if (typeof permission !== 'number' || permission < 0 || permission > 2) {
        throw new Error(`Invalid permission: ${permission}`)
      }
      mask |= 1 << permission
    }

    return mask
  }

  /**
   * Validates and formats ByteArray (string)
   */
  static resolveByteArray(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('ByteArray must be a string')
    }
    return value
  }

  /**
   * Generic argument resolver with type checking
   */
  static resolveArgs<T extends Record<string, unknown>>(
    args: T,
    schema: Record<keyof T, ResolverFunction>,
  ): T {
    const resolved = {} as T

    for (const [key, resolver] of Object.entries(schema) as Array<
      [keyof T, ResolverFunction]
    >) {
      if (!(key in args)) {
        throw new Error(`Missing required argument: ${String(key)}`)
      }

      try {
        resolved[key] = resolver(args[key]) as T[keyof T]
      } catch (error) {
        throw new Error(
          `Invalid argument '${String(key)}': ${error instanceof Error ? error.message : 'Unknown error'}`,
        )
      }
    }

    return resolved
  }
}

// Specific resolvers for Spherre contract functions
export const SpherreArgsResolvers = {
  // Factory contract functions
  deployAccount: (args: {
    owner: string
    name: string
    description: string
    members: string[]
    threshold: number
  }) => {
    return ContractArgsResolver.resolveArgs(args, {
      owner: (value: unknown) =>
        ContractArgsResolver.resolveAddress(value as string),
      name: (value: unknown) =>
        ContractArgsResolver.resolveByteArray(value as string),
      description: (value: unknown) =>
        ContractArgsResolver.resolveByteArray(value as string),
      members: (value: unknown) =>
        ContractArgsResolver.resolveAddressArray(value as string[]),
      threshold: (value: unknown) =>
        ContractArgsResolver.resolveThreshold(
          value as number,
          args.members.length,
        ),
    })
  },

  isDeployedAccount: (args: { account: string }) => {
    return ContractArgsResolver.resolveArgs(args, {
      account: (value: unknown) =>
        ContractArgsResolver.resolveAddress(value as string),
    })
  },

  // Account contract functions
  proposeMemberAdd: (args: {
    member: string
    permissions: PermissionEnum[]
  }) => {
    return ContractArgsResolver.resolveArgs(args, {
      member: (value: unknown) =>
        ContractArgsResolver.resolveAddress(value as string),
      permissions: (value: unknown) =>
        ContractArgsResolver.resolvePermissionMask(value as PermissionEnum[]),
    })
  },

  proposeMemberRemove: (args: { member_address: string }) => {
    return ContractArgsResolver.resolveArgs(args, {
      member_address: (value: unknown) =>
        ContractArgsResolver.resolveAddress(value as string),
    })
  },

  proposeTokenTransaction: (args: {
    token: string
    amount: U256
    recipient: string
  }) => {
    return ContractArgsResolver.resolveArgs(args, {
      token: (value: unknown) =>
        ContractArgsResolver.resolveAddress(value as string),
      amount: (value: unknown) =>
        ContractArgsResolver.resolveU256(value as U256),
      recipient: (value: unknown) =>
        ContractArgsResolver.resolveAddress(value as string),
    })
  },

  proposeNFTTransaction: (args: {
    nft_contract: string
    token_id: U256
    recipient: string
  }) => {
    return ContractArgsResolver.resolveArgs(args, {
      nft_contract: (value: unknown) =>
        ContractArgsResolver.resolveAddress(value as string),
      token_id: (value: unknown) =>
        ContractArgsResolver.resolveU256(value as U256),
      recipient: (value: unknown) =>
        ContractArgsResolver.resolveAddress(value as string),
    })
  },

  proposeThresholdChange: (args: { new_threshold: number }) => {
    return ContractArgsResolver.resolveArgs(args, {
      new_threshold: (value: unknown) => {
        const thresholdNum = value as number
        if (!Number.isInteger(thresholdNum) || thresholdNum < 1) {
          throw new Error('Threshold must be a positive integer')
        }
        return BigInt(thresholdNum)
      },
    })
  },

  approveTransaction: (args: { transaction_id: U256 }) => {
    return ContractArgsResolver.resolveArgs(args, {
      transaction_id: (value: unknown) =>
        ContractArgsResolver.resolveU256(value as U256),
    })
  },

  rejectTransaction: (args: { transaction_id: U256 }) => {
    return ContractArgsResolver.resolveArgs(args, {
      transaction_id: (value: unknown) =>
        ContractArgsResolver.resolveU256(value as U256),
    })
  },

  executeTransaction: (args: { transaction_id: U256 }) => {
    return ContractArgsResolver.resolveArgs(args, {
      transaction_id: (value: unknown) =>
        ContractArgsResolver.resolveU256(value as U256),
    })
  },

  isMember: (args: { address: string }) => {
    return ContractArgsResolver.resolveArgs(args, {
      address: (value: unknown) =>
        ContractArgsResolver.resolveAddress(value as string),
    })
  },

  getTransaction: (args: { transaction_id: U256 }) => {
    return ContractArgsResolver.resolveArgs(args, {
      transaction_id: (value: unknown) =>
        ContractArgsResolver.resolveU256(value as U256),
    })
  },
}
