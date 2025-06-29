import type { ContractConfig } from "./types"

// Contract addresses - CONFIRMED TO EXIST ON SEPOLIA
export const SPHERRE_CONTRACTS = {
  SPHERRE_ACCOUNT: "0x03f3b1fef05ff4a85e8d00dbcd265ae1a654e2bcce6d8ad576387bc68f204a6d",
  SPHERRE: "0x072e1387bbd6cdd783696ddee58b9bb69b5004ae333a48e1ae187d58a8e03974",
} as const

// Real SpherreAccount ABI
export const SPHERRE_ACCOUNT_ABI = [
  {
    type: "impl",
    name: "AccountImpl",
    interface_name: "spherre::interfaces::iaccount::IAccount",
  },
  {
    type: "struct",
    name: "core::byte_array::ByteArray",
    members: [
      {
        name: "data",
        type: "core::array::Array::<core::bytes_31::bytes31>",
      },
      {
        name: "pending_word",
        type: "core::felt252",
      },
      {
        name: "pending_word_len",
        type: "core::integer::u32",
      },
    ],
  },
  {
    type: "struct",
    name: "spherre::types::AccountDetails",
    members: [
      {
        name: "name",
        type: "core::byte_array::ByteArray",
      },
      {
        name: "description",
        type: "core::byte_array::ByteArray",
      },
    ],
  },
  {
    type: "interface",
    name: "spherre::interfaces::iaccount::IAccount",
    items: [
      {
        type: "function",
        name: "get_name",
        inputs: [],
        outputs: [
          {
            type: "core::byte_array::ByteArray",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_description",
        inputs: [],
        outputs: [
          {
            type: "core::byte_array::ByteArray",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_account_details",
        inputs: [],
        outputs: [
          {
            type: "spherre::types::AccountDetails",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_deployer",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "pause",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "unpause",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  // Account Data Interface
  {
    type: "interface",
    name: "spherre::interfaces::iaccount_data::IAccountData",
    items: [
      {
        type: "function",
        name: "get_account_members",
        inputs: [],
        outputs: [
          {
            type: "core::array::Array::<core::starknet::contract_address::ContractAddress>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_members_count",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u64",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_threshold",
        inputs: [],
        outputs: [
          {
            type: "(core::integer::u64, core::integer::u64)",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_transaction",
        inputs: [
          {
            name: "transaction_id",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "spherre::types::Transaction",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "is_member",
        inputs: [
          {
            name: "address",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "approve_transaction",
        inputs: [
          {
            name: "tx_id",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "reject_transaction",
        inputs: [
          {
            name: "tx_id",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  // Member Add Transaction Interface
  {
    type: "interface",
    name: "spherre::interfaces::imember_add_tx::IMemberAddTransaction",
    items: [
      {
        type: "function",
        name: "propose_member_add_transaction",
        inputs: [
          {
            name: "member",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "permissions",
            type: "core::integer::u8",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "execute_member_add_transaction",
        inputs: [
          {
            name: "transaction_id",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  // Member Remove Transaction Interface
  {
    type: "interface",
    name: "spherre::interfaces::imember_remove_tx::IMemberRemoveTransaction",
    items: [
      {
        type: "function",
        name: "propose_remove_member_transaction",
        inputs: [
          {
            name: "member_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "execute_remove_member_transaction",
        inputs: [
          {
            name: "transaction_id",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  // Token Transaction Interface
  {
    type: "interface",
    name: "spherre::interfaces::itoken_tx::ITokenTransaction",
    items: [
      {
        type: "function",
        name: "propose_token_transaction",
        inputs: [
          {
            name: "token",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
          {
            name: "recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "execute_token_transaction",
        inputs: [
          {
            name: "id",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  // Threshold Change Interface
  {
    type: "interface",
    name: "spherre::interfaces::ichange_threshold_tx::IChangeThresholdTransaction",
    items: [
      {
        type: "function",
        name: "propose_threshold_change_transaction",
        inputs: [
          {
            name: "new_threshold",
            type: "core::integer::u64",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "execute_threshold_change_transaction",
        inputs: [
          {
            name: "id",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
] as const

// Real Spherre Factory ABI
export const SPHERRE_ABI = [
  {
    type: "impl",
    name: "SpherreImpl",
    interface_name: "spherre::interfaces::ispherre::ISpherre",
  },
  {
    type: "interface",
    name: "spherre::interfaces::ispherre::ISpherre",
    items: [
      {
        type: "function",
        name: "deploy_account",
        inputs: [
          {
            name: "owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "name",
            type: "core::byte_array::ByteArray",
          },
          {
            name: "description",
            type: "core::byte_array::ByteArray",
          },
          {
            name: "members",
            type: "core::array::Array::<core::starknet::contract_address::ContractAddress>",
          },
          {
            name: "threshold",
            type: "core::integer::u64",
          },
        ],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "is_deployed_account",
        inputs: [
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_account_class_hash",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::class_hash::ClassHash",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "has_staff_role",
        inputs: [
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "has_superadmin_role",
        inputs: [
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "pause",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "unpause",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
] as const

// Contract configurations
export const spherreAccountConfig: ContractConfig = {
  address: SPHERRE_CONTRACTS.SPHERRE_ACCOUNT,
  abi: SPHERRE_ACCOUNT_ABI,
}

export const spherreConfig: ContractConfig = {
  address: SPHERRE_CONTRACTS.SPHERRE,
  abi: SPHERRE_ABI,
}
