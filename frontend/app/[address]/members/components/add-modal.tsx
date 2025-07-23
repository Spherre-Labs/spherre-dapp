import React, { useState } from 'react'
import { isValidStarknetAddress } from '@/lib/utils/validation'
import ProcessingModal from '../../../components/modals/Loader'
import SuccessModal from '../../../components/modals/SuccessModal'
import ErrorModal from '../../../components/modals/ErrorModal'

const roles = ['Voter', 'Proposer', 'Executor']

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onPropose: (wallet: string, selectedRoles: string[]) => void
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onPropose,
}) => {
  const [wallet, setWallet] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([
    'Voter',
    'Proposer',
    'Executor',
  ]) // All roles by default
  const [walletError, setWalletError] = useState('')

  // Modal states
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    )
  }

  const validateWallet = (address: string): boolean => {
    if (!address.trim()) {
      setWalletError('Wallet address is required')
      return false
    }

    if (!isValidStarknetAddress(address.trim())) {
      setWalletError('Invalid StarkNet wallet address format')
      return false
    }

    setWalletError('')
    return true
  }

  const handleSubmit = () => {
    if (!validateWallet(wallet) || selectedRoles.length === 0) {
      if (selectedRoles.length === 0) {
        setWalletError('Please select at least one role')
      }
      return
    }

    // Close the add modal and start processing
    onClose()
    setIsProcessingModalOpen(true)

    // Simulate processing delay and success after 5 seconds
    setTimeout(() => {
      setIsProcessingModalOpen(false)
      setIsSuccessModalOpen(true)
      // Call the original onPropose to maintain functionality
      onPropose(wallet.trim(), selectedRoles)
      // Reset form
      setWallet('')
      setSelectedRoles(['Voter', 'Proposer', 'Executor'])
      setWalletError('')
    }, 5000)
  }

  const handleProcessingCancel = () => {
    setIsProcessingModalOpen(false)
    setIsErrorModalOpen(true)
  }

  const handleModalClose = () => {
    setWallet('')
    setSelectedRoles(['Voter', 'Proposer', 'Executor'])
    setWalletError('')
    onClose()
  }

  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setWallet(value)
    // Clear error when user starts typing
    if (walletError) {
      setWalletError('')
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-theme-bg-secondary border border-theme-border rounded-xl p-4 sm:p-8 w-full max-w-[95vw] sm:max-w-[500px] md:max-w-[600px] relative shadow-lg transition-colors duration-300">
            {/* Close button */}
            <button
              className="absolute top-5 right-5 text-theme-secondary text-2xl font-bold hover:text-theme transition-colors duration-200"
              onClick={handleModalClose}
              aria-label="Close"
            >
              ×
            </button>

            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-theme mb-2">
                Add Member
              </h2>
              <p className="text-sm sm:text-base text-theme-secondary">
                Add a new member to your Spherre account
              </p>
            </div>

            {/* Wallet Address Input */}
            <div className="mb-4">
              <label className="block text-theme mb-3">Wallet Address</label>
              <input
                className={`w-full p-3 rounded bg-theme-bg-tertiary text-theme placeholder-theme-muted outline-none border ${
                  walletError ? 'border-red-500' : 'border-theme-border'
                } ${
                  walletError ? 'focus:border-red-500' : 'focus:border-primary'
                } transition-colors duration-200`}
                placeholder="Enter wallet address (0x...)"
                value={wallet}
                onChange={handleWalletChange}
              />
              {walletError && (
                <p className="text-red-500 text-sm mt-1 mb-4">{walletError}</p>
              )}
              {!walletError && <div className="mb-6" />}

              {/* Assign Roles */}
              <div className="mb-8">
                <label className="block text-theme mb-4">Assign Roles</label>
                <div className="flex flex-wrap items-center gap-3">
                  {roles.map((role) => {
                    const isSelected = selectedRoles.includes(role)
                    let borderColor = ''
                    let bgColor = ''
                    let textColor = ''

                    if (isSelected) {
                      if (role === 'Voter') {
                        borderColor = 'border-[#FF7BE9]'
                        bgColor = 'bg-[#FF7BE9]/10'
                        textColor = 'text-[#FF7BE9]'
                      } else if (role === 'Executor') {
                        borderColor = 'border-[#19B360]'
                        bgColor = 'bg-[#19B360]/10'
                        textColor = 'text-[#19B360]'
                      } else if (role === 'Proposer') {
                        borderColor = 'border-[#FF8A25]'
                        bgColor = 'bg-[#FF8A25]/10'
                        textColor = 'text-[#FF8A25]'
                      }
                    } else {
                      borderColor = 'border-theme-border'
                      bgColor = 'bg-transparent'
                      textColor = 'text-theme-secondary'
                    }

                    return (
                      <button
                        key={role}
                        onClick={() => toggleRole(role)}
                        className={`px-4 py-2 rounded-lg border transition-all duration-200 ${borderColor} ${bgColor} ${textColor} hover:opacity-80`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              isSelected ? borderColor : 'border-theme-border'
                            }`}
                          >
                            {isSelected && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <span>{role}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 sm:gap-4">
                <button
                  className="flex-1 py-3 rounded-lg bg-theme-bg-tertiary text-theme border border-theme-border hover:bg-theme-bg-secondary transition-colors font-medium"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
                <button
                  className={`flex-1 py-3 rounded-lg transition-colors font-medium ${
                    wallet.trim() && selectedRoles.length > 0
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-theme-bg-tertiary text-theme-secondary cursor-not-allowed'
                  }`}
                  onClick={handleSubmit}
                  disabled={!wallet.trim() || selectedRoles.length === 0}
                >
                  Propose Addition
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing Modal */}
      <ProcessingModal
        isOpen={isProcessingModalOpen}
        onClose={handleProcessingCancel}
        title="Processing Member Addition!"
        subtitle="Please wait while we process the member addition proposal..."
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onViewTransaction={() => {
          setIsSuccessModalOpen(false)
          // Navigate to transactions page if needed
        }}
        title="Member Addition Proposed!"
        message="The member addition proposal has been successfully created and sent to other members for approval."
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Transaction Failed"
        errorText="The member addition proposal was cancelled or failed to process."
      />
    </>
  )
}

export default AddMemberModal
