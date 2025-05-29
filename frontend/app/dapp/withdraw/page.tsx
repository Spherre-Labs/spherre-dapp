'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import WithdrawalStepOne from './withdraw-step-one'
import WithdrawStepTwo from './withdraw-step-two'
import WithdrawStepper from './withdraw-stepper'
import WithdrawalReviewPage from './step3/page'

export interface Token {
  symbol: string
  balance: number
  icon?: string
  usdValue?: number
}

export default function WithdrawPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()
  const [isAddressValid, setIsAddressValid] = useState<boolean>(false)
  const [recipientAddress, setRecipientAddress] = useState<string>('')
  const [addressTouched, setAddressTouched] = useState<boolean>(false)
  const [amount, setAmount] = useState<string>('')
  const [selectedToken, setSelectedToken] = useState<string>('STRK')
  const [availableTokens] = useState<Token[]>([
    {
      symbol: 'STRK',
      balance: 10.0,
      icon: '/Images/starknet.svg',
      usdValue: 0.15,
    },
    {
      symbol: 'ETH',
      balance: 0.0,
      usdValue: 0,
    },
  ])

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

  const handleNext = () => {
    // Store the withdrawal details and navigate to the next step

    // Navigate to the next step (review)
    if (currentStep === 3) {
      router.push('/dapp')
    } else {
      if (isAddressValid || isValidAmount(amount))
        setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep === 1) {
      router.push('/dapp')
    }
    setCurrentStep((prev) => (prev <= 1 ? 1 : prev - 1))
  }

  const handleCancel = () => {
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
          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-600 transition duration-200 px-[1.25rem]"
          onClick={() => handlePrev()}
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

          {currentStep === 1 && (
            <WithdrawalStepOne
              isAddressValid={isAddressValid}
              onAddressChange={onAddressChange}
              recipientAddress={recipientAddress}
              onChangeRecipientAddress={setRecipientAddress}
              addressTouched={addressTouched}
              onChangeAddressTouched={setAddressTouched}
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
          {currentStep === 3 && <WithdrawalReviewPage />}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <button
              onClick={handleCancel}
              className="py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base bg-[#272729] text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              disabled={
                (!isAddressValid && currentStep === 1) ||
                (!isValidAmount(amount) && currentStep === 2) ||
                (currentStep === 3 && !isAddressValid)
              }
              className={`py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                (isAddressValid && currentStep === 1) ||
                (isValidAmount(amount) && currentStep === 2) ||
                (currentStep === 3 && isAddressValid)
                  ? 'bg-primary hover:bg-purple-900'
                  : 'bg-primary/50 cursor-not-allowed'
              } transition-colors`}
            >
              {currentStep === 3 ? 'Execute' : 'Next'}
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
