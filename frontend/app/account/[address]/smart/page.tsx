'use client'

import { useState, useMemo, useCallback } from 'react'
import SmartLockPlans from '@/components/smart-lock/smart-lock-plans'
import CreateSmartLockPlanModal from '@/app/components/modals/CreateSmartLockPlanModal'
import {
  useSmartTokenLockTransactionList,
  useTransactionList,
  useProposeSmartTokenLockTransaction,
  useAccountPermissions,
} from '@/hooks/useSpherreHooks'
import { useCurrentAccountAddress } from '@/app/context/account-context'
import { TransactionType } from '@/lib/contracts/types'
import { mapTransactionStatus } from '@/lib/utils/transaction-utils'
import type { SmartLockPlan } from '@/types/smart-lock'
import { TokenUtils, AVAILABLE_TOKENS } from '@/lib/utils/token'
import { contractAddressToHex } from '@/lib/utils/transaction-utils'
import ProcessingModal from '../../../components/modals/Loader'
import SuccessModal from '../../../components/modals/SuccessModal'
import { useTokenBalances } from '@/hooks/useTokenBalances'
import {
  recordSmartLockPlanName,
  getSmartLockPlanName,
} from '@/lib/utils/smart-lock-plan-store'

interface SmartLockPlanData {
  name: string
  token: string
  amount: string
  duration: string
  durationType: 'days' | 'weeks' | 'months'
}

type SmartLockTokenOption = {
  symbol: string
  name: string
  address: `0x${string}`
  decimals: number
  icon?: string
  balanceValue: number
  formattedBalance: string
  rawAmount: bigint
}

export default function SmartLock() {
  const accountAddress = useCurrentAccountAddress()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [permissionsError, setPermissionsError] = useState<string | null>(null)
  const [processingTitle, setProcessingTitle] = useState(
    'Processing Transaction!',
  )
  const [processingSubtitle, setProcessingSubtitle] = useState(
    'Please wait while we submit your transaction.',
  )
  const [successTitle, setSuccessTitle] = useState('Transaction Submitted!')
  const [successMessage, setSuccessMessage] = useState(
    'Your transaction has been successfully proposed.',
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    data: baseTransactions,
    isLoading: isBaseTransactionsLoading,
    error: baseTransactionsError,
    refetch: refetchBaseTransactions,
  } = useTransactionList(accountAddress ?? '0x0')

  const {
    data: smartLockTransactions,
    isLoading: isSmartLockLoading,
    error: smartLockError,
    refetch: refetchSmartLockTransactions,
  } = useSmartTokenLockTransactionList(accountAddress ?? '0x0')

  const { hasProposerRole, hasExecutorRole, permissionsLoading, permissions } =
    useAccountPermissions(accountAddress ?? '0x0')

  const { writeAsync: proposeSmartLockTransaction, isLoading: isProposing } =
    useProposeSmartTokenLockTransaction(accountAddress ?? '0x0')

  const convertDurationToSeconds = useCallback(
    (duration: string, durationType: 'days' | 'weeks' | 'months'): bigint => {
      const durationValue = Number.parseInt(duration, 10)
      if (Number.isNaN(durationValue) || durationValue <= 0) {
        throw new Error('Please enter a valid duration.')
      }

      const secondsInDay = 24 * 60 * 60
      let totalSeconds = durationValue * secondsInDay

      if (durationType === 'weeks') {
        totalSeconds *= 7
      } else if (durationType === 'months') {
        totalSeconds *= 30
      }

      return BigInt(totalSeconds)
    },
    [],
  )

  const formatDateString = useCallback((timestamp: bigint): string => {
    const date = new Date(Number(timestamp) * 1000)
    if (Number.isNaN(date.getTime())) return '—'
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })
  }, [])

  const computeUnlockMetadata = useCallback(
    (createdAt: bigint, duration: bigint) => {
      const createdSeconds = Number(createdAt)
      const durationSeconds = Number(duration)

      if (Number.isNaN(createdSeconds) || Number.isNaN(durationSeconds)) {
        return {
          unlockDate: '—',
          isUnlockable: false,
        }
      }

      const unlockTimestamp = (createdSeconds + durationSeconds) * 1000
      const unlockDateValue = new Date(unlockTimestamp)

      return {
        unlockDate: Number.isNaN(unlockDateValue.getTime())
          ? '—'
          : unlockDateValue.toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            }),
        isUnlockable: Date.now() >= unlockTimestamp,
      }
    },
    [],
  )

  const { tokensDisplay, loadingTokenData } = useTokenBalances()

  const smartLockTokenOptions = useMemo<SmartLockTokenOption[]>(() => {
    if (!tokensDisplay.length) {
      return AVAILABLE_TOKENS.map((token) => ({
        symbol: token.symbol,
        name: token.name,
        address: token.address as `0x${string}`,
        icon: token.icon,
        decimals: token.decimals,
        balanceValue: Number.NaN,
        formattedBalance: '0',
        rawAmount: BigInt(0),
      }))
    }

    return tokensDisplay.map((display) => {
      const metadata = AVAILABLE_TOKENS.find(
        (token) =>
          token.address.toLowerCase() ===
          display.contract_address.toLowerCase(),
      ) ?? {
        symbol: display.coin,
        name: display.coin,
        address: display.contract_address as `0x${string}`,
        decimals: display.decimals ?? 18,
      }

      return {
        symbol: metadata.symbol,
        name: metadata.name,
        address: metadata.address as `0x${string}`,
        icon: metadata.icon,
        decimals: metadata.decimals,
        balanceValue: display.balanceValue,
        formattedBalance: display.balance,
        rawAmount: display.rawAmount,
      }
    })
  }, [tokensDisplay])

  const smartLockTokenMapBySymbol = useMemo(() => {
    return new Map<string, SmartLockTokenOption>(
      smartLockTokenOptions.map((token) => [token.symbol, token]),
    )
  }, [smartLockTokenOptions])

  const smartLockTokenMapByAddress = useMemo(() => {
    return new Map<string, SmartLockTokenOption>(
      smartLockTokenOptions.map((token) => [
        token.address.toLowerCase(),
        token,
      ]),
    )
  }, [smartLockTokenOptions])

  const plans = useMemo<SmartLockPlan[]>(() => {
    if (!baseTransactions || !smartLockTransactions) return []

    const defaultImages = [
      '/Smart-Lock-Banner-1.png',
      '/Smart-Lock-Banner-2.png',
      '/Smart-Lock-Banner-3.png',
      '/Smart-Lock-Banner-4.png',
    ]

    let smartLockIndex = 0

    return baseTransactions
      .filter((transaction) => {
        if (
          transaction.tx_type.activeVariant() !==
          TransactionType.SMART_TOKEN_LOCK
        ) {
          return false
        }

        const statusVariant = transaction.tx_status.activeVariant()
        // Only show executed transactions
        return mapTransactionStatus(statusVariant) === 'success'
      })
      .map((transaction) => {
        const smartLockData = smartLockTransactions?.[smartLockIndex]

        if (!smartLockData) {
          return null
        }

        const currentIndex = smartLockIndex
        smartLockIndex += 1

        const normalizedTokenAddress = contractAddressToHex(
          smartLockData.token,
        ).toLowerCase()

        const tokenMeta =
          smartLockTokenMapByAddress.get(normalizedTokenAddress) ??
          AVAILABLE_TOKENS.find(
            (token) => token.address.toLowerCase() === normalizedTokenAddress,
          )

        const tokenInfo = tokenMeta
          ? {
              symbol: tokenMeta.symbol,
              name: tokenMeta.name,
              address: tokenMeta.address,
              decimals: tokenMeta.decimals,
            }
          : {
              symbol: 'TOKEN',
              name: 'Token',
              address: smartLockData.token as `0x${string}`,
              decimals: 18,
            }

        const amountFormatted = TokenUtils.formatTokenAmount(
          smartLockData.amount,
          tokenInfo,
        )

        const { unlockDate, isUnlockable } = computeUnlockMetadata(
          transaction.date_created,
          smartLockData.duration,
        )

        const storedName =
          accountAddress && typeof accountAddress === 'string'
            ? getSmartLockPlanName({
                account: accountAddress,
                token: normalizedTokenAddress,
                amount: smartLockData.amount,
                duration: smartLockData.duration,
              })
            : null

        const planName =
          storedName ??
          (smartLockData.transaction_id
            ? `Smart Lock #${smartLockData.transaction_id.toString()}`
            : `Smart Lock #${transaction.id.toString()}`)

        return {
          id: transaction.id.toString(),
          name: planName,
          token: tokenInfo.symbol,
          dateCreated: formatDateString(transaction.date_created),
          amount: amountFormatted,
          unlockDate,
          isUnlockable,
          category: 'Custom',
          imageUrl:
            defaultImages[currentIndex % defaultImages.length] ??
            defaultImages[0],
        } satisfies SmartLockPlan
      })
      .filter((plan): plan is SmartLockPlan => Boolean(plan))
  }, [
    baseTransactions,
    smartLockTransactions,
    accountAddress,
    computeUnlockMetadata,
    formatDateString,
    smartLockTokenMapByAddress,
  ])

  const handleCreatePlan = useCallback(
    async (planData: SmartLockPlanData) => {
      if (!accountAddress) {
        setErrorMessage('Account address is not available.')
        return
      }

      try {
        setErrorMessage(null)
        setIsModalOpen(false)
        setProcessingTitle('Proposing Smart Lock Transaction!')
        setProcessingSubtitle(
          'Please wait while we submit the smart lock transaction proposal...',
        )
        setIsProcessingModalOpen(true)

        const tokenInfo =
          smartLockTokenMapBySymbol.get(planData.token) ??
          smartLockTokenOptions[0]

        if (!tokenInfo) {
          throw new Error('Unsupported token selected')
        }

        const amountWei = TokenUtils.parseTokenAmount(
          planData.amount,
          tokenInfo.decimals,
        )
        const durationSeconds = convertDurationToSeconds(
          planData.duration,
          planData.durationType,
        )

        await proposeSmartLockTransaction({
          token: tokenInfo.address,
          amount: amountWei,
          duration: durationSeconds,
        })

        recordSmartLockPlanName(
          {
            account: accountAddress,
            token: tokenInfo.address.toLowerCase(),
            amount: amountWei,
            duration: durationSeconds,
          },
          planData.name.trim(),
        )

        setIsProcessingModalOpen(false)
        setSuccessTitle('Smart Lock Transaction Proposed!')
        setSuccessMessage(
          'The smart lock proposal is now pending multisig approvals.',
        )
        setIsSuccessModalOpen(true)

        await Promise.all([
          refetchSmartLockTransactions(),
          refetchBaseTransactions(),
        ])
      } catch (error) {
        console.error('Error proposing smart lock transaction:', error)
        setIsProcessingModalOpen(false)
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to propose smart lock transaction.',
        )
      }
    },
    [
      accountAddress,
      convertDurationToSeconds,
      proposeSmartLockTransaction,
      refetchSmartLockTransactions,
      refetchBaseTransactions,
      smartLockTokenMapBySymbol,
      smartLockTokenOptions,
    ],
  )

  const handleSuccessModalClose = useCallback(() => {
    setIsSuccessModalOpen(false)
  }, [])

  const isLoading =
    isBaseTransactionsLoading ||
    isSmartLockLoading ||
    isProposing ||
    loadingTokenData ||
    permissionsLoading

  const error = baseTransactionsError || smartLockError

  return (
    <section className="space-y-4">
      {errorMessage && (
        <div className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg border border-red-500/40 text-sm">
          {errorMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg border border-red-500/40 text-sm">
          {error.message}
        </div>
      )}

      <SmartLockPlans
        plans={plans}
        isLoading={isLoading}
        onCreateNewPlan={() => {
          if (!hasProposerRole) {
            setPermissionsError(
              'Only members with the Proposer role can create smart lock plans.',
            )
            return
          }
          setPermissionsError(null)
          setIsModalOpen(true)
        }}
      />
      <CreateSmartLockPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePlan}
        availableTokens={smartLockTokenOptions}
      />

      <ProcessingModal
        isOpen={isProcessingModalOpen}
        onClose={() => setIsProcessingModalOpen(false)}
        title={processingTitle}
        subtitle={processingSubtitle}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        title={successTitle}
        message={successMessage}
        additionalContent={
          <p className="text-sm text-theme-secondary">
            This transaction now requires approvals from members with the Voter
            role, and execution by a member with the Executor role.
          </p>
        }
      />
    </section>
  )
}
