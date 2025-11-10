import {
  TransactionDisplayInfo,
  TransactionType,
  ThresholdChangeData,
  TokenTransactionData,
  MemberRemoveData,
  EditPermissionTransaction,
  SmartTokenLockTransaction,
  MemberAddData,
} from '@/lib/contracts/types'
import Image from 'next/image'
import strk from '../../../../../public/Images/strk.png'
import eth from '../../../../../public/Images/eth.png'
import { truncateAddress } from '@/lib/utils/utility'
import {
  extractPermissionsFromMask,
  feltToAddress,
} from '@/lib/utils/validation'
import { formatTokenAmount } from '@/lib/utils/transaction-utils'

const getTokenInfo = (token: string) => {
  const tokenAddress = feltToAddress(token)
  switch (tokenAddress) {
    case '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d':
      return {
        image: strk,
        name: 'STRK',
      }
    case '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7':
      return {
        image: eth,
        name: 'ETH',
      }
    default:
      return null
  }
}

export const transactionDisplayData = (
  transactionInfo: TransactionDisplayInfo,
) => {
  const tokenInfo =
    transactionInfo.transaction.transactionType ===
      TransactionType.TOKEN_SEND ||
    transactionInfo.transaction.transactionType === TransactionType.NFT_SEND ||
    transactionInfo.transaction.transactionType ===
      TransactionType.SMART_TOKEN_LOCK
      ? getTokenInfo(
          feltToAddress(
            (transactionInfo.transaction.data as TokenTransactionData)['token'],
          ),
        )
      : null

  switch (transactionInfo.transaction.transactionType) {
    case TransactionType.TOKEN_SEND || TransactionType.NFT_SEND:
      return (
        <>
          <div className="text-theme-secondary flex items-center transition-colors duration-300 flex-[2] min-w-0">
            <span className="text-sm text-theme-secondary mr-1">Amount:</span>
            <span className="inline-flex items-center">
              {tokenInfo?.image ? (
                <Image
                  src={tokenInfo?.image ?? ''}
                  width={16}
                  height={16}
                  className="sm:w-5 sm:h-5"
                  alt="token"
                />
              ) : null}
              <span className="ml-1 text-theme font-semibold">
                {`${formatTokenAmount((transactionInfo.transaction.data as TokenTransactionData)['amount'])} ${tokenInfo?.name}`}
              </span>
            </span>
          </div>

          <div className="text-theme-secondary flex items-center transition-colors duration-300 flex-[2] min-w-0">
            <span className="text-sm text-theme-secondary mr-1">To:</span>
            <span className="inline-flex items-center">
              <span className="ml-1 text-theme font-semibold">
                {`${truncateAddress(feltToAddress((transactionInfo.transaction.data as TokenTransactionData)['recipient']))}`}
              </span>
            </span>
          </div>
        </>
      )

    case TransactionType.SMART_TOKEN_LOCK:
      return (
        <>
          <div className="text-theme-secondary flex items-center transition-colors duration-300 flex-[2] min-w-0">
            <span className="text-sm text-theme-secondary mr-1">Amount:</span>
            <span className="inline-flex items-center">
              {tokenInfo?.image ? (
                <Image
                  src={tokenInfo?.image ?? ''}
                  width={16}
                  height={16}
                  className="sm:w-5 sm:h-5"
                  alt="token"
                />
              ) : null}
              <span className="ml-1 text-theme font-semibold">
                {`${formatTokenAmount((transactionInfo.transaction.data as SmartTokenLockTransaction)['amount'])} ${tokenInfo?.name}`}
              </span>
            </span>
          </div>
        </>
      )

    case TransactionType.THRESHOLD_CHANGE:
      return (
        <>
          <div className="text-theme-secondary flex items-center transition-colors duration-300 flex-[2] min-w-0">
            <span className="text-sm text-theme-secondary mr-1">
              Old Threshold:
            </span>
            <span className="inline-flex items-center">
              <span className="ml-1 text-theme font-semibold">0</span>
            </span>
          </div>

          <div className="text-theme-secondary flex items-center transition-colors duration-300 flex-[2] min-w-0">
            <span className="text-sm text-theme-secondary mr-1">
              New Threshold:
            </span>
            <span className="inline-flex items-center">
              <span className="ml-1 text-theme font-semibold">
                {`${BigInt((transactionInfo.transaction.data as ThresholdChangeData)['new_threshold'])}`}
              </span>
            </span>
          </div>
        </>
      )

    case TransactionType.MEMBER_ADD:
      return (
        <>
          <div className="text-theme-secondary flex items-center transition-colors duration-300 flex-[2] min-w-0">
            <span className="text-sm text-theme-secondary mr-1"></span>
            <span className="inline-flex items-center">
              <span className="ml-1 text-theme font-semibold">
                {`${truncateAddress(feltToAddress((transactionInfo.transaction.data as MemberAddData)['member']))}`}
              </span>
            </span>
          </div>

          <div className="text-theme-secondary flex flex-col items-center transition-colors duration-300 flex-[2] min-w-0">
            <span className="text-sm text-theme-secondary mr-1">
              Permissions:
            </span>
            <span className="inline-flex items-center">
              <span className="ml-1 text-theme text-[12px] font-semibold">
                {`${extractPermissionsFromMask((transactionInfo.transaction.data as MemberAddData)['permissions']).join(', ')}`}
              </span>
            </span>
          </div>
        </>
      )

    case TransactionType.MEMBER_PERMISSION_EDIT:
      return (
        <>
          <div className="text-theme-secondary flex items-center transition-colors duration-300 flex-[2] min-w-0">
            <span className="text-sm text-theme-secondary mr-1"></span>
            <span className="inline-flex items-center">
              <span className="ml-1 text-theme font-semibold">
                {`${truncateAddress(feltToAddress((transactionInfo.transaction.data as EditPermissionTransaction)['member']))}`}
              </span>
            </span>
          </div>

          <div className="text-theme-secondary flex items-center transition-colors duration-300 flex-[2] min-w-0">
            <span className="text-sm text-theme-secondary mr-1"></span>
            <span className="inline-flex items-center">
              <span className="ml-1 text-theme font-semibold">
                {`${extractPermissionsFromMask((transactionInfo.transaction.data as EditPermissionTransaction)['new_permissions'])}`}
              </span>
            </span>
          </div>
        </>
      )

    case TransactionType.MEMBER_REMOVE:
      return (
        <div className="text-theme-secondary flex items-center transition-colors duration-300 flex-[2] min-w-0 col-span-2">
          <span className="text-sm text-theme-secondary mr-1"></span>
          <span className="inline-flex items-center">
            <span className="ml-1 text-theme font-semibold">
              {`${truncateAddress(feltToAddress((transactionInfo.transaction.data as MemberRemoveData)['member_address']))}`}
            </span>
          </span>
        </div>
      )

    default:
      return null
  }
}
