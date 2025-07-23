'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import WithdrawalStepOne from './withdraw-step-one'
import WithdrawStepTwo from './withdraw-step-two'
import WithdrawStepper from './withdraw-stepper'
import WithdrawalReviewPage from './WithdrawalReviewPage'
import { useAccount } from '@starknet-react/core'
import {
  AVAILABLE_TOKENS,
  SPHERRE_ACCOUNT_ABI,
  useGetAccountName,
  useScaffoldReadContract,
  useScaffoldWriteContract,
} from '@/lib'
import { useSpherreAccount } from '@/app/context/account-context'
import { useGlobalModal } from '@/app/components/modals/GlobalModalProvider'

export default function WithdrawPage() {
  const { accountAddress: spherreAccountAddress } = useSpherreAccount()
  const { data: spherreAccountName } = useGetAccountName(
    spherreAccountAddress || '0x0',
  )
  const { showSuccess, showError, showProcessing, hideModal } = useGlobalModal()

  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()
  const { address } = useAccount()
  const [isAddressValid, setIsAddressValid] = useState<boolean>(false)
  const [recipientAddress, setRecipientAddress] = useState<string>('')
  const [addressTouched, setAddressTouched] = useState<boolean>(false)
  const [amount, setAmount] = useState<string>('')
  const [selectedToken, setSelectedToken] = useState<string>('STRK')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [availableTokens, setAvailableTokens] = useState<
    {
      symbol: string
      usdValue: number
      icon: string
      address: string
      name: string
      decimals: number
      balance: number
    }[]
  >(
    AVAILABLE_TOKENS.map((token) => ({
      address: token.address,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      balance: 0,
      usdValue: 0,
      icon: token.icon || '/Images/strk.png', // Provide default icon
    })),
  )

  const selectedTokenAddress =
    availableTokens.find((t) => t.symbol === selectedToken)?.address || ''

  const { data } = useScaffoldReadContract({
    contractConfig: {
      address: spherreAccountAddress || '',
      abi: SPHERRE_ACCOUNT_ABI,
    },
    functionName: 'get_token_balance',
    args: {
      token_address: selectedTokenAddress,
    },
    watch: true,
    enabled: !!spherreAccountAddress,
  })

  // Update token balance in UI when contract data changes
  useEffect(() => {
    if (data && selectedToken) {
      setAvailableTokens((prev) => {
        const selectedTokenData = prev.find((t) => t.symbol === selectedToken)
        if (selectedTokenData) {
          const balanceInWei = Number(data)
          const balanceInTokens =
            balanceInWei / Math.pow(10, selectedTokenData.decimals || 18)

          return prev.map((token) =>
            token.symbol === selectedToken
              ? { ...token, balance: balanceInTokens }
              : token,
          )
        }
        return prev
      })
    }
  }, [data, selectedToken])

  const onAddressChange = (isValid: boolean) => {
    setIsAddressValid(isValid)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  // Validation
  const isValidAmount = (amount: string) => {
    const numAmount = parseFloat(amount)
    const selectedTokenData = availableTokens.find(
      (t) => t.symbol === selectedToken,
    )
    return (
      !isNaN(numAmount) &&
      numAmount > 0 &&
      selectedTokenData &&
      numAmount <= selectedTokenData.balance
    )
  }

  const { writeAsync } = useScaffoldWriteContract({
    contractConfig: {
      address: spherreAccountAddress as `0x${string}`,
      abi: SPHERRE_ACCOUNT_ABI,
    },
    functionName: 'propose_token_transaction',
    onSuccess: () => {
      setIsSubmitting(false)
      hideModal()
      showSuccess({
        title: 'Proposal Created!',
        message: 'Token withdrawal proposal created.',
        onViewTransaction: () => {
          router.push('dapp/transactions/')
        },
      })
    },
    onError: (error) => {
      setIsSubmitting(false)
      hideModal()
      showError({
        title: 'Transaction Failed',
        errorText:
          error instanceof Error
            ? `Transaction failed: ${error.message}`
            : 'Transaction failed. Please try again.',
      })
    },
  })

  const handleNext = async () => {
    // Check if wallet is connected first
    if (!address) {
      showError({
        title: 'Wallet Not Connected',
        errorText: 'Connect your wallet to propose a withdrawal.',
      })
      return
    }

    // Navigate to the next step (review)
    if (currentStep === 3) {
      try {
        setIsSubmitting(true)
        showProcessing({
          title: 'Processing Withdrawal',
          subtitle: 'Please wait while we process your withdrawal proposal.',
        })

        // Validate required fields
        if (!selectedTokenAddress) {
          hideModal()
          showError({
            title: 'Token Error',
            errorText: 'Token address not found.',
          })
          setIsSubmitting(false)
          return
        }

        if (!recipientAddress) {
          hideModal()
          showError({
            title: 'Recipient Required',
            errorText: 'Recipient address is required.',
          })
          setIsSubmitting(false)
          return
        }

        if (!amount || parseFloat(amount) <= 0) {
          hideModal()
          showError({
            title: 'Invalid Amount',
            errorText: 'Please enter a valid amount.',
          })
          setIsSubmitting(false)
          return
        }

        // Get the selected token data
        const selectedTokenData = availableTokens.find(
          (t) => t.symbol === selectedToken,
        )

        if (!selectedTokenData) {
          hideModal()
          showError({
            title: 'Token Not Found',
            errorText: 'Selected token not found.',
          })
          setIsSubmitting(false)
          return
        }

        // Validate amount against balance
        if (parseFloat(amount) > selectedTokenData.balance) {
          hideModal()
          showError({
            title: 'Insufficient Balance',
            errorText: 'Not enough tokens to propose this withdrawal.',
          })
          setIsSubmitting(false)
          return
        }

        // Convert amount to wei (U256 format)
        const amountInWei = BigInt(
          parseFloat(amount) * Math.pow(10, selectedTokenData.decimals || 18),
        )

        // Call the contract function with proper arguments
        await writeAsync({
          token: selectedTokenAddress,
          amount: amountInWei,
          recipient: recipientAddress,
        })
      } catch (error) {
        setIsSubmitting(false)
        hideModal()
        showError({
          title: 'Transaction Failed',
          errorText:
            error instanceof Error
              ? error.message
              : 'Transaction failed. Please try again.',
        })
      }
    } else {
      if (isAddressValid || isValidAmount(amount))
        setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep === 1) {
      router.push('/dapp')
    } else {
      // Reset UI state when going back
      setCurrentStep((prev) => prev - 1)
      setIsSubmitting(false)

      // Reset form state based on which step we're going back from
      if (currentStep === 3) {
        // Going back from review step - keep amount and token selection
        // but reset recipient address validation
        setIsAddressValid(false)
        setAddressTouched(false)
      } else if (currentStep === 2) {
        // Going back from token/amount step - reset amount and token
        setAmount('')
        setSelectedToken('STRK')
        setIsAddressValid(false)
        setRecipientAddress('')
        setAddressTouched(false)
      }
    }
  }

  const handleCancel = () => {
    // Show rejection message if user cancels during submission
    if (isSubmitting) {
      hideModal()
      showError({
        title: 'Proposal Cancelled',
        errorText: 'Proposal cancelled by user.',
      })
      setIsSubmitting(false)
    }
    // Navigate back to the dashboard or previous page
    router.push('/dapp')
  }

  const steps = [
    { step: 1, label: 'Recipient' },
    { step: 2, label: 'Token and Amount' },
    { step: 3, label: 'Final Review' },
  ]

  return (
    <div className="min-h-screen bg-[#000] text-white pt-16 pl-6">
      <div className="flex items-center mb-6 md:mb-0">
        <Button
          className={`p-2 rounded-lg transition duration-200 px-[1.25rem] ${
            address
              ? 'bg-gray-800 hover:bg-gray-600'
              : 'bg-gray-600 opacity-50 cursor-not-allowed'
          }`}
          onClick={() => handlePrev()}
          disabled={!address || isSubmitting}
        >
          <ArrowLeft className="h-4 w-4 text-white" />
        </Button>
        <span className=" font-semibold text-white ml-4">Go Back</span>
      </div>

      <WithdrawStepper currentStep={currentStep} steps={steps} />
      <div className="max-w-2xl mx-auto pr-6 md:p-6 space-y-6 flex flex-col  md:items-center w-full">
        {/* Main Content */}
        <div className="flex flex-col h-full w-full md:max-w-lg xl:max-w-2xl">
          <h1 className="text-xl sm:text-3xl font-bold text-center mb-1 sm:mb-2">
            Withdraw to Another Wallet
          </h1>
          <p className="text-ash text-center text-sm sm:text-base mb-6 sm:mb-8">
            {currentStep === 1 &&
              'Please select the account you wish to withdraw from Spherre and choose a recipient.'}
            {currentStep === 2 &&
              'Please select the token and amount you wish to withdraw.'}
            {currentStep === 3 &&
              'Please review your information before withdrawing.'}
          </p>

          {!address && (
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6 text-center">
              <p className="text-yellow-400 font-medium">
                Please connect your wallet to continue with the withdrawal
                process.
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <WithdrawalStepOne
              isAddressValid={isAddressValid}
              onAddressChange={onAddressChange}
              recipientAddress={recipientAddress}
              onChangeRecipientAddress={setRecipientAddress}
              addressTouched={addressTouched}
              onChangeAddressTouched={setAddressTouched}
              spherreAccountAddress={spherreAccountAddress}
              spherreAccountName={spherreAccountName}
            />
          )}
          {currentStep === 2 && (
            <WithdrawStepTwo
              amount={amount}
              onChangeSelectedToken={(e) => setSelectedToken(e.target.value)}
              onChangeAmount={handleAmountChange}
              availableTokens={availableTokens}
              selectedToken={selectedToken}
            />
          )}
          {currentStep === 3 && (
            <WithdrawalReviewPage
              recipientAddress={recipientAddress}
              amount={amount}
              selectedToken={selectedToken}
              availableTokens={availableTokens}
              spherreAccountAddress={spherreAccountAddress}
            />
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <button
              onClick={handleCancel}
              className="py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base bg-[#272729] text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              disabled={
                !address ||
                isSubmitting ||
                (!isAddressValid && currentStep === 1) ||
                (!isValidAmount(amount) && currentStep === 2) ||
                (currentStep === 3 && !isAddressValid)
              }
              className={`py-2 flex items-center justify-center gap-1 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                (isAddressValid && currentStep === 1) ||
                (isValidAmount(amount) && currentStep === 2) ||
                (currentStep === 3 && isAddressValid)
                  ? 'bg-primary hover:bg-purple-900'
                  : 'bg-primary/50 cursor-not-allowed'
              } transition-colors`}
            >
              {currentStep === 3 ? 'Confirm' : 'Next'}
            </button>
          </div>
          {currentStep === 3 && (
            <p className="text-xs sm:text-sm text-gray-500 mb-6 text-left mt-3">
              By clicking Execute you`re withdrawing funds to an internal
              wallet, please review the details before proceeding with the
              transaction.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
