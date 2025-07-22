import { useEffect, useMemo, useState } from 'react'

import { useInterval } from 'usehooks-ts'
import { AbiEntry, AbiEnums, AbiStructs, parseCalldataField } from 'starknet'
import {
  Abi,
  ExtractAbiEvent,
  ExtractAbiEventNames,
} from 'abi-wan-kanabi/kanabi'
import { devnet } from '@starknet-react/chains'
import { useNetwork, useProvider } from '@starknet-react/core'
import { hash, RpcProvider } from 'starknet'
import { events as starknetEvents, CallData } from 'starknet'

const MAX_KEYS_COUNT = 16
/**
 * Reads events from a deployed contract
 * @param config - The config settings
 * @param config.contractName - deployed contract name
 * @param config.eventName - name of the event to listen for
 * @param config.fromBlock - the block number to start reading events from
 * @param config.filters - filters to be applied to the event (parameterName: value)
 * @param config.blockData - if set to true it will return the block data for each event (default: false)
 * @param config.transactionData - if set to true it will return the transaction data for each event (default: false)
 * @param config.receiptData - if set to true it will return the receipt data for each event (default: false)
 * @param config.watch - if set to true, the events will be updated every pollingInterval milliseconds set at scaffoldConfig (default: false)
 * @param config.enabled - if set to false, disable the hook from running (default: true)
 */

type useScaffoldEventHistoryType = {
  contractConfig: ContractConfig
  eventName: ExtractAbiEventNames<Abi>
  fromBlock: bigint
  filters?: Record<string, any>
  blockData?: boolean
  transactionData?: boolean
  receiptData?: boolean
  watch?: boolean
  format?: boolean
  enabled?: boolean
}

export const useScaffoldEventHistory = ({
  contractConfig,
  eventName,
  fromBlock,
  filters,
  blockData,
  transactionData,
  receiptData,
  watch,
  format = true,
  enabled = true,
}: useScaffoldEventHistoryType) => {
  const [events, setEvents] = useState<any[]>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [fromBlockUpdated, setFromBlockUpdated] = useState<bigint>(fromBlock)

  const { provider } = useProvider()
  const { chain: targetNetwork } = useNetwork()

  const publicClient = useMemo(() => {
    return new RpcProvider({
      nodeUrl: process.env.NEXT_PUBLIC_RPC_URL,
    })
  }, [process.env.NEXT_PUBLIC_RPC_URL])

  // Get back event full name
  const matchingAbiEvents = useMemo(() => {
    return (contractConfig.abi as Abi)?.filter(
      (part) =>
        part.type === 'event' &&
        part.name.split('::').slice(-1)[0] === (eventName as string),
    ) as ExtractAbiEvent<Abi, string>[]
  }, [contractConfig])
  // const matchingAbiEvents =

  if (matchingAbiEvents?.length === 0) {
    throw new Error(`Event ${eventName as string} not found in contract ABI`)
  }

  if (matchingAbiEvents?.length > 1) {
    throw new Error(
      `Ambiguous event "${eventName as string}". ABI contains ${matchingAbiEvents.length} events with that name`,
    )
  }

  const eventAbi = matchingAbiEvents?.[0]
  const fullName = eventAbi?.name

  const readEvents = async (fromBlock?: bigint) => {
    if (!enabled) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      if (!contractConfig) {
        throw new Error('Contract not found')
      }

      const event = (contractConfig.abi as Abi).find(
        (part) =>
          part.type === 'event' &&
          part.name.split('::').slice(-1)[0] === eventName,
      ) as ExtractAbiEvent<Abi, string>

      const blockNumber = (await publicClient.getBlockLatestAccepted())
        .block_number

      if (
        (fromBlock && blockNumber >= fromBlock) ||
        blockNumber >= fromBlockUpdated
      ) {
        let keys: string[][] = [[hash.getSelectorFromName(eventName)]]
        if (filters) {
          keys = keys.concat(
            composeEventFilterKeys(filters, event, contractConfig.abi),
          )
        }
        keys = keys.slice(0, MAX_KEYS_COUNT)
        const rawEventResp = await publicClient.getEvents({
          chunk_size: 100,
          keys,
          address: contractConfig?.address,
          from_block: { block_number: Number(fromBlock || fromBlockUpdated) },
          to_block: { block_number: blockNumber },
        })
        if (!rawEventResp) {
          return
        }
        const logs = rawEventResp.events
        setFromBlockUpdated(BigInt(blockNumber + 1))

        const newEvents = []
        for (let i = logs.length - 1; i >= 0; i--) {
          newEvents.push({
            event,
            log: logs[i],
            block:
              blockData && logs[i].block_hash === null
                ? null
                : await publicClient.getBlockWithTxHashes(logs[i].block_hash),
            transaction:
              transactionData && logs[i].transaction_hash !== null
                ? await publicClient.getTransactionByHash(
                    logs[i].transaction_hash,
                  )
                : null,
            receipt:
              receiptData && logs[i].transaction_hash !== null
                ? await publicClient.getTransactionReceipt(
                    logs[i].transaction_hash,
                  )
                : null,
          })
        }
        if (events && typeof fromBlock === 'undefined') {
          setEvents([...newEvents, ...events])
        } else {
          setEvents(newEvents)
        }
        setError(undefined)
      }
    } catch (e: any) {
      console.error(e)
      setEvents(undefined)
      setError(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    readEvents(fromBlock).then()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromBlock, enabled])

  useEffect(() => {
    readEvents().then()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    provider,
    eventName,
    contractConfig,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(filters, replacer),
    blockData,
    transactionData,
    receiptData,
  ])

  useEffect(() => {
    // Reset the internal state when target network or fromBlock changed
    setEvents([])
    setFromBlockUpdated(fromBlock)
    setError(undefined)
  }, [fromBlock, targetNetwork.id])

  useInterval(
    async () => {
      readEvents()
    },
    watch ? (targetNetwork.id !== devnet.id ? 30_000 : 4_000) : null,
  )

  const eventHistoryData = useMemo(() => {
    if (contractConfig) {
      return (events || []).map((event) => {
        const logs = [JSON.parse(JSON.stringify(event.log))]
        const parsed = starknetEvents.parseEvents(
          logs,
          starknetEvents.getAbiEvents(contractConfig.abi),
          CallData.getAbiStruct(contractConfig.abi),
          CallData.getAbiEnum(contractConfig.abi),
        )
        const args = parsed.length ? parsed[0][fullName] : {}
        const { event: rawEvent, ...rest } = event
        return {
          type: rawEvent.members,
          args,
          parsedArgs: format ? parseEventData(args, rawEvent.members) : null,
          ...rest,
        }
      })
    }
    return []
  }, [contractConfig, events, eventName, format])

  return {
    data: eventHistoryData,
    isLoading: isLoading,
    error: error,
  }
}

import { getChecksumAddress } from 'starknet'
import { ContractConfig, spherreConfig } from '@/lib'

export const parseEventData = (
  args: Record<string, any>,
  types: { name: string; type: string; kind: string }[],
) => {
  const convertToHex = (value: bigint): string => {
    return getChecksumAddress(`0x${value.toString(16)}`)
  }

  const result: Record<string, any> = {}

  Object.keys(args).forEach((paramName: string) => {
    const paramValue = args[paramName]
    const paramType = types.find((t) => t.name === paramName)?.type
    if (!paramType) {
      result[paramName] = paramValue
      return
    }

    if (paramType === 'core::starknet::contract_address::ContractAddress') {
      result[paramName] = convertToHex(paramValue)
    } else if (
      paramType ===
      'core::array::Array::<core::starknet::contract_address::ContractAddress>'
    ) {
      result[paramName] = paramValue.map((item: bigint) => convertToHex(item))
    } else if (paramType.startsWith('(') && paramType.endsWith(')')) {
      const innerTypes = paramType.slice(1, -1).split(',')
      const indexesOfAddress = innerTypes
        .map((type, index) =>
          type.trim() === 'core::starknet::contract_address::ContractAddress'
            ? index
            : -1,
        )
        .filter((index) => index !== -1)
      const newTuple: Record<number, any> = {}
      Object.keys(paramValue).forEach((key) => {
        newTuple[Number(key)] = paramValue[key]
      })
      for (const index of indexesOfAddress) {
        newTuple[index] = convertToHex(newTuple[index])
      }
      result[paramName] = newTuple
    } else {
      result[paramName] = paramValue
    }
  })

  return result
}

export function feltToHex(feltBigInt: bigint) {
  return `0x${feltBigInt.toString(16)}`
}

const stringToByteArrayFelt = (str: string): string[] => {
  const bytes = new TextEncoder().encode(str)
  const result = []
  const numFullWords = Math.floor(bytes.length / 31)
  result.push(numFullWords.toString())

  for (let i = 0; i < numFullWords; i++) {
    const chunk = bytes.slice(i * 31, (i + 1) * 31)
    const felt = '0x' + Buffer.from(chunk).toString('hex')
    result.push(felt)
  }

  const remainingBytes = bytes.slice(numFullWords * 31)
  if (remainingBytes.length > 0) {
    const pendingWord = '0x' + Buffer.from(remainingBytes).toString('hex')
    result.push(pendingWord)
  } else {
    result.push('0x0')
  }

  result.push(remainingBytes.length.toString())
  return result
}

export const serializeEventKey = (
  input: any,
  abiEntry: AbiEntry,
  structs: AbiStructs,
  enums: AbiEnums,
): string[] => {
  if (abiEntry.type === 'core::byte_array::ByteArray') {
    return stringToByteArrayFelt(input).map((item) => feltToHex(BigInt(item)))
  }
  const args = [input][Symbol.iterator]()
  const parsed = parseCalldataField(args, abiEntry, structs, enums)
  if (typeof parsed === 'string') {
    return [feltToHex(BigInt(parsed))]
  }
  return parsed.map((item: string) => feltToHex(BigInt(item)))
}

const is2DArray = (arr: any) => {
  return Array.isArray(arr) && arr.every((item) => Array.isArray(item))
}

const isUniformLength = (arr: any[][]) => {
  if (!Array.isArray(arr) || arr.length === 0) return false

  const firstLength = arr[0].length
  return arr.every((subArray) => subArray.length === firstLength)
}

const mergeArrays = (arrays: any[][]) => {
  return arrays[0].map((_, index) => arrays.map((array) => array[index][0]))
}

const certainLengthTypeMap: { [key: string]: string[][] } = {
  'core::starknet::contract_address::ContractAddress': [[]],
  'core::starknet::eth_address::EthAddress': [[]], // Kept for backward compatibility
  'core::starknet::class_hash::ClassHash': [[]],
  'core::starknet::storage_access::StorageAddress': [[]],
  'core::bool': [[]],
  'core::integer::u8': [[]],
  'core::integer::u16': [[]],
  'core::integer::u32': [[]],
  'core::integer::u64': [[]],
  'core::integer::u128': [[]],
  'core::integer::u256': [[], []],
  'core::integer::u512': [[], [], [], []],
  'core::bytes_31::bytes31': [[]],
  'core::felt252': [[]],
}

export const composeEventFilterKeys = (
  input: { [key: string]: any },
  event: ExtractAbiEvent<Abi, string>,
  abi: Abi,
): string[][] => {
  if (!('members' in event)) {
    return []
  }
  const enums = CallData.getAbiEnum(abi)
  const structs = CallData.getAbiStruct(abi)
  const members = event.members as unknown as {
    name: string
    type: string
    kind: 'key' | 'data'
    value: any
  }[]
  let keys: string[][] = []
  const keyMembers = members.filter((member) => member.kind === 'key')
  const clonedKeyMembers = JSON.parse(JSON.stringify(keyMembers))
  for (const member of clonedKeyMembers) {
    if (member.name in input) {
      member.value = input[member.name]
    }
  }
  for (const member of clonedKeyMembers) {
    if (member.value !== undefined) {
      if (
        !member.type.startsWith('core::array::Array::') &&
        Array.isArray(member.value)
      ) {
        keys = keys.concat(
          mergeArrays(
            member.value.map((matchingItem: any) =>
              serializeEventKey(matchingItem, member, structs, enums).map(
                (item) => [item],
              ),
            ),
          ),
        )
      } else if (
        member.type.startsWith('core::array::Array::') &&
        is2DArray(member.value)
      ) {
        if (!isUniformLength(member.value)) {
          break
        }
        keys = keys.concat(
          mergeArrays(
            member.value.map((matchingItem: any) =>
              serializeEventKey(matchingItem, member, structs, enums).map(
                (item) => [item],
              ),
            ),
          ),
        )
      } else {
        const serializedKeys = serializeEventKey(
          member.value,
          member,
          structs,
          enums,
        ).map((item) => [item])
        keys = keys.concat(serializedKeys)
      }
    } else {
      if (member.type in certainLengthTypeMap) {
        keys = keys.concat(certainLengthTypeMap[member.type])
      } else {
        break
      }
    }
  }
  return keys
}

export const replacer = (_key: string, value: unknown) => {
  if (typeof value === 'bigint') return value.toString()
  return value
}
