import AccountSelector from '@/components/withdrawal/account-selector'
import AddressInput from '@/components/withdrawal/address-input'
import { sliceWalletAddress } from '@/components/utils'

interface IWithdrawStepOne {
  isAddressValid: boolean
  onAddressChange: (isValid: boolean) => void
  recipientAddress: string
  onChangeRecipientAddress: (address: string) => void
  addressTouched: boolean
  onChangeAddressTouched: (touched: boolean) => void
  spherreAccountAddress: `0x${string}` | null
  spherreAccountName: string
}

export default function WithdrawalStepOne({
  isAddressValid,
  onAddressChange,
  recipientAddress,
  onChangeRecipientAddress,
  addressTouched,
  onChangeAddressTouched,
  spherreAccountAddress,
  spherreAccountName,
}: IWithdrawStepOne) {
  // Dummy data for the account
  const accountData = {
    name: spherreAccountName || 'Spherre Account',
    address: sliceWalletAddress(spherreAccountAddress),
    balance: '$0.00',
    avatar: '/placeholder.svg?height=40&width=40',
  }

  return (
    <>
      {/* From Account Selector */}
      <div className="mb-6">
        <p className="text-gray-400 mb-2">From:</p>
        <AccountSelector account={accountData} />
        <div className="flex items-center text-ash text-sm mt-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Payments are processed within 24 hours
        </div>
      </div>
      {/* To Address Input */}
      <div className="mb-8">
        <p className="text-gray-400 mb-2">To:</p>
        <AddressInput
          value={recipientAddress}
          onChange={(value) => onChangeRecipientAddress(value)}
          onValidityChange={(isValid) => onAddressChange(isValid)}
          onBlur={() => onChangeAddressTouched(true)}
          showError={
            addressTouched && !isAddressValid && recipientAddress !== ''
          }
        />
      </div>
    </>
  )
}
