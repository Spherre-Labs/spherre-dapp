import { PermissionEnum } from '@/lib/contracts/types'
import type { U256 } from '@/lib/contracts/types'
import { 
  createPermissionMask, 
  extractPermissionsFromMask, 
  getPermissionFelt,
  ALL_PERMISSIONS_MASK 
} from './validation'

export class ContractArgsResolver {
  /**
   * Validates and formats Starknet address
   */
  static resolveAddress(address: string): string {
    if (!address || typeof address !== 'string') {
      throw new Error('Address must be a non-empty string')
    }

    // Remove whitespace and convert to lowercase
    const cleanAddress = address.trim().toLowerCase()

    // Validate hex format
    if (!cleanAddress.startsWith('0x')) {
      throw new Error('Address must start with 0x')
    }

    // Validate hex characters and length
    if (!/^0x[0-9a-f]{1,64}$/i.test(cleanAddress)) {
      throw new Error('Invalid address format')
    }

    // Pad to full length if needed
    const paddedAddress = cleanAddress.padEnd(66, '0')

    return paddedAddress as `0x${string}`
  }

  /**
   * Validates and formats array of addresses
   */
  static resolveAddressArray(addresses: string[]): string[] {
    if (!Array.isArray(addresses)) {
      throw new Error('Addresses must be an array')
    }

    return addresses.map((addr) => this.resolveAddress(addr))
  }

  /**
   * Validates and formats ByteArray for contract calls
   */
  static resolveByteArray(text: string): string[] {
    if (typeof text !== 'string') {
      throw new Error('Text must be a string')
    }

    // Convert string to bytes
    const bytes = new TextEncoder().encode(text)

    // Split into 31-byte chunks (Cairo ByteArray format)
    const chunks: string[] = []
    const chunkSize = 31

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.slice(i, i + chunkSize)
      const hex = '0x' + Array.from(chunk, (b) => b.toString(16).padStart(2, '0')).join('')
      chunks.push(hex)
    }

    // Return in ByteArray format: [num_full_words, ...full_words, pending_word, pending_word_len]
    const numFullWords = Math.floor(bytes.length / chunkSize)
    const remainingBytes = bytes.length % chunkSize

    const result = [numFullWords.toString()]
    result.push(...chunks.slice(0, numFullWords))
    
    if (remainingBytes > 0) {
      result.push(chunks[numFullWords] || '0x0')
    } else {
      result.push('0x0')
    }
    
    result.push(remainingBytes.toString())

    return result
  }

  /**
   * Validates and formats threshold value
   */
  static resolveThreshold(threshold: number, memberCount: number): number {
    if (typeof threshold !== 'number' || !Number.isInteger(threshold)) {
      throw new Error('Threshold must be an integer')
    }

    if (threshold < 1) {
      throw new Error('Threshold must be at least 1')
    }

    if (threshold > memberCount) {
      throw new Error(`Threshold cannot exceed member count (${memberCount})`)
    }

    return threshold
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
   * Validates and formats permission mask from permission names
   */
  static resolvePermissionMask(permissions: ('VOTER' | 'PROPOSER' | 'EXECUTOR')[]): number {
    if (!Array.isArray(permissions)) {
      throw new Error('Permissions must be an array')
    }

    if (permissions.length === 0) {
      throw new Error('At least one permission must be specified')
    }

    // Validate all permissions are valid
    for (const permission of permissions) {
      if (!['VOTER', 'PROPOSER', 'EXECUTOR'].includes(permission)) {
        throw new Error(`Invalid permission: ${permission}`)
      }
    }

    return createPermissionMask(permissions)
  }

  /**
   * Validates and formats permission mask from PermissionEnum array (legacy support)
   */
  static resolvePermissionMaskFromEnum(permissions: PermissionEnum[]): number {
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
   * Generic argument resolver
   */
  static resolveArgs<T extends Record<string, unknown>>(
    args: T,
    resolvers: Record<keyof T, (value: unknown) => unknown>,
  ): Record<string, unknown> {
    const resolved: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(args)) {
      const resolver = resolvers[key as keyof T]
      if (resolver) {
        resolved[key] = resolver(value)
      } else {
        resolved[key] = value
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

  // Account contract functions - Updated to use new permission system
  proposeMemberAdd: (args: {
    member: string
    permissions: number | ('VOTER' | 'PROPOSER' | 'EXECUTOR')[]
  }) => {
    return ContractArgsResolver.resolveArgs(args, {
      member: (value: unknown) =>
        ContractArgsResolver.resolveAddress(value as string),
      permissions: (value: unknown) => {
        // Handle both permission mask (number) and permission array
        if (typeof value === 'number') {
          return value
        }
        if (Array.isArray(value)) {
          return ContractArgsResolver.resolvePermissionMask(value as ('VOTER' | 'PROPOSER' | 'EXECUTOR')[])
        }
        throw new Error('Permissions must be a number (mask) or array of permission names')
      },
    })
  },

  proposeMemberRemove: (args: { member_address: string }) => {
    return ContractArgsResolver.resolveArgs(args, {
      member_address: (value: unknown) =>
        ContractArgsResolver.resolveAddress(value as string),
    })
  },

  proposeEditPermission: (args: {
    member: string
    new_permissions: number | ('VOTER' | 'PROPOSER' | 'EXECUTOR')[]
  }) => {
    return ContractArgsResolver.resolveArgs(args, {
      member: (value: unknown) =>
        ContractArgsResolver.resolveAddress(value as string),
      new_permissions: (value: unknown) => {
        // Handle both permission mask (number) and permission array
        if (typeof value === 'number') {
          return value
        }
        if (Array.isArray(value)) {
          return ContractArgsResolver.resolvePermissionMask(value as ('VOTER' | 'PROPOSER' | 'EXECUTOR')[])
        }
        throw new Error('New permissions must be a number (mask) or array of permission names')
      },
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

  proposeNftTransaction: (args: {
    collection: string
    token_id: U256
    recipient: string
  }) => {
    return ContractArgsResolver.resolveArgs(args, {
      collection: (value: unknown) =>
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
        const threshold = value as number
        if (typeof threshold !== 'number' || !Number.isInteger(threshold)) {
          throw new Error('Threshold must be an integer')
        }
        if (threshold < 1) {
          throw new Error('Threshold must be at least 1')
        }
        return threshold
      },
    })
  },

  // Transaction actions
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
}
