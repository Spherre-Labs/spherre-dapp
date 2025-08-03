'use client'

import React, { useMemo } from 'react'
import { useState } from 'react'
import { Edit3, HelpCircle, Loader, X } from 'lucide-react'
import Image from 'next/image'
import profile from '../../../../public/member2.svg'
import edit from '../../../../public/Images/edit.png'
import threshold_img from '../../../../public/Images/threshold.png'
import group from '../../../../public/Images/group-profile.png'
import starkneticon from '../../../../public/Images/starknet-icon.png'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/app/context/theme-context-provider'
import { routes } from '@/lib/utils/routes'
import { useSpherreAccount } from '@/app/context/account-context'
import { useGetThreshold, useProposeThresholdChange } from '@/lib'
import { useGlobalModal } from '@/app/components/modals/GlobalModalProvider'
import { useGetAccountName } from '@/lib'
import { truncateAddress } from '@/lib/utils/utility'
import { useTokenBalances } from '@/hooks/useTokenBalances'

export default function MultisigWalletUI() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [threshold, setThreshold] = useState(1)
  const totalMembers = 3
  const router = useRouter()
  const { actualTheme } = useTheme()
  const { accountAddress } = useSpherreAccount()
  const { data: accountName } = useGetAccountName(accountAddress || '0x0')
  const { totalValue } = useTokenBalances()
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleThresholdChange = (value: number) => {
    setThreshold(value)
  }

  const {
    data: contractTheshold,
    error: thresholdError,
    isLoading: readThresholdLoading,
  } = useGetThreshold(accountAddress || '0x0')
  const {
    writeAsync: proposeThreshold,
    error: propsalError,
    isLoading: writeThresholdLoading,
  } = useProposeThresholdChange(accountAddress || '0x0')
  const { showSuccess, showProcessing, hideModal, showError } = useGlobalModal()

  const isValidThreshold = useMemo(() => {
    return threshold >= 1 && threshold <= Number(contractTheshold?.[1])
  }, [threshold, contractTheshold])

  const validationError = useMemo(() => {
    if (threshold < 1) return 'Threshold must be at least 1'
    if (threshold > Number(contractTheshold?.[1]))
      return `Threshold cannot exceed ${contractTheshold?.[1]} members`

    return null
  }, [threshold, contractTheshold])

  const handleProposeThresholdChange = async () => {
    if (!accountAddress || !isValidThreshold) return

    try {
      showProcessing({
        title: 'Submitting Proposal',
        subtitle: `Submitting proposal for threshold change to ${threshold}`,
      })

      const { transaction_hash } = await proposeThreshold({
        new_threshold: threshold,
      })
      showSuccess({
        title: 'Successful Proposal',
        message: `Threshold Proposal change to ${threshold} submitted successfully`,
        viewLabel: 'View on Explorer',
        onViewTransaction: () => {
          window.open(
            `https://sepolia.voyager.online/tx/${transaction_hash}`,
            '_blank',
          )
          hideModal()
        },
      })

      closeModal()
    } catch {
      showError({
        title: 'Proposal submission failed',
        errorText: propsalError?.message || `Failed to submit proposal`,
      })
    }
  }

  return (
    <div className="text-theme p-2 sm:p-6 bg-theme transition-colors duration-300">
      <div className="mx-auto">
        {/* Header */}
        <h1 className="text-xl sm:text-2xl font-semibold text-theme-secondary mb-4 sm:mb-8">
          All Multisig Wallets
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Main Wallet Card */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl px-3 sm:px-6 py-6 sm:py-14 relative overflow-hidden bg-wallet">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-8 relative z-10 gap-3 sm:gap-0">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <Image
                      src={profile}
                      width={50}
                      height={50}
                      alt="profile"
                      className="border-2 rounded-full sm:w-[70px] sm:h-[70px]"
                    />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-xl font-semibold text-white">
                      {accountName}
                    </h2>
                    <p className="text-emerald-100 text-xs sm:text-sm">
                      {accountAddress ? truncateAddress(accountAddress) : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-white rounded-lg px-2 sm:px-3 py-1 sm:py-2 cursor-pointer mt-2 sm:mt-0">
                  <Image
                    src={starkneticon}
                    width={20}
                    height={20}
                    alt="profile"
                  />
                  <span className="text-black text-xs sm:text-sm font-medium">
                    STRK
                  </span>
                  <svg
                    className="w-4 h-4 ml-1 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Date and Balance */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between relative z-10 gap-3 sm:gap-0">
                <div>
                  <p className="text-emerald-100 text-xs sm:text-sm mb-1 sm:mb-2">
                    Date created:{' '}
                    <span className="text-white font-semibold">
                      March 12, 2025, 10:20 AM
                    </span>
                  </p>
                  <button className="bg-white backdrop-blur-sm text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-100 transition-all text-xs sm:text-base">
                    <Image src={edit} width={16} height={16} alt="edit" />
                    <span className="text-black font-semibold">
                      Manage Account
                    </span>
                  </button>
                </div>

                <div className="text-right mt-2 sm:mt-0">
                  <p className="text-emerald-100 text-xs sm:text-sm mb-1">
                    Available Balance
                  </p>
                  <p className="text-white text-3xl sm:text-5xl font-bold">
                    $ {totalValue}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Create Multisig Card */}
          <div className="bg-theme-bg-secondary border border-theme-border rounded-2xl p-3 sm:p-6 relative overflow-hidden mt-4 sm:mt-0 transition-colors duration-300">
            <div className="relative z-10">
              <h3 className="text-base sm:text-xl font-semibold text-theme mb-2 sm:mb-4">
                Create a multisig Account
              </h3>
              <div className="bg-coin h-[60px] sm:h-[108px] w-full"></div>
              <p className="text-theme-secondary text-xs sm:text-sm my-2 sm:my-3 leading-relaxed">
                Secure Your Digital Assets Seamlessly. Add Members to your new
                Multisig Vault.
              </p>
              <button
                onClick={() => router.push('/create-account')}
                className="w-full bg-theme-bg-tertiary hover:bg-theme-bg-tertiary/80 text-theme py-2 sm:py-3 rounded-lg font-medium transition-all text-xs sm:text-base border border-theme-border"
              >
                Create Now
              </button>
            </div>
          </div>
        </div>

        {/* More Details Section */}
        <div className="mt-4 sm:mt-8">
          <h3 className="text-base sm:text-xl font-medium text-theme-secondary mb-3 sm:mb-6">
            More Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            {/* Members Card */}
            <div className="bg-theme-bg-secondary border border-theme-border rounded-xl p-3 sm:p-6 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Image src={group} width={30} height={30} alt="group" />
                  <div>
                    <p className="text-theme-secondary text-xs sm:text-sm">
                      Members
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-5xl font-bold text-theme">
                    {readThresholdLoading ? (
                      <Loader />
                    ) : thresholdError ? (
                      thresholdError.message
                    ) : (
                      contractTheshold?.[1]
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push(routes(accountAddress).members)}
                className="w-full bg-theme-bg-tertiary hover:bg-theme-bg-tertiary/80 text-theme py-2 sm:py-3 rounded-lg font-medium transition-all text-xs sm:text-base border border-theme-border"
              >
                Manage Members
              </button>
            </div>

            {/* Threshold Card */}
            <div className="bg-theme-bg-secondary border border-theme-border rounded-xl p-3 sm:p-6 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Image
                    src={threshold_img}
                    width={30}
                    height={30}
                    alt="threshold"
                  />
                  <div className="flex items-center space-x-2">
                    <p className="text-theme-secondary text-xs sm:text-sm">
                      Threshold
                    </p>
                    <HelpCircle className="w-4 h-4 text-theme-muted" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-5xl font-bold text-theme">
                    {readThresholdLoading ? (
                      <Loader />
                    ) : thresholdError ? (
                      thresholdError.message
                    ) : (
                      contractTheshold?.[0]
                    )}
                    /{contractTheshold?.[1]}
                  </p>
                </div>
              </div>

              <button
                onClick={openModal}
                className="w-full bg-theme-bg-tertiary hover:bg-theme-bg-tertiary/80 text-theme py-2 sm:py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 text-xs sm:text-base border border-theme-border"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Threshold</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-theme-bg-secondary border border-theme-border rounded-2xl p-4 sm:p-8 mx-2 sm:mx-4 relative w-full max-w-[95vw] sm:max-w-lg transition-colors duration-300">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-theme-muted hover:text-theme transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8">
              <h2 className="text-lg sm:text-2xl font-bold text-theme mb-2">
                Edit Threshold
              </h2>
              <p className="text-theme-secondary text-xs sm:text-sm leading-relaxed">
                Please select the amount of approvals needed to confirm a
                transaction.
              </p>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-12 mb-6 sm:mb-8">
              {/* Members */}
              <div className="bg-theme-bg-tertiary border border-theme-border rounded-xl p-3 sm:p-6 text-center flex items-center justify-between transition-colors duration-300">
                <div className="flex flex-col items-start gap-8">
                  <Image src={group} width={30} height={30} alt="group" />
                  <div className="text-theme-secondary text-xs sm:text-sm">
                    Members
                  </div>
                </div>
                <div className="text-4xl font-bold text-theme mb-2">
                  {contractTheshold?.[1]}
                </div>
              </div>

              {/* Threshold */}
              <div className="bg-theme-bg-tertiary border border-theme-border gap-12 rounded-xl p-3 sm:p-6 text-center flex items-center justify-between transition-colors duration-300">
                <div className="flex flex-col items-start gap-8">
                  <Image src={group} width={30} height={30} alt="group" />
                  <div className="text-theme-secondary text-xs sm:text-sm">
                    Threshol
                  </div>
                </div>
                <div className="text-4xl font-bold text-theme mb-2">
                  {contractTheshold?.[0]}/{contractTheshold?.[1]}
                </div>
                <div className="flex flex-col items-start gap-8"></div>
              </div>
            </div>

            {/* Slider */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max={totalMembers}
                  value={threshold}
                  onChange={(e) =>
                    handleThresholdChange(parseInt(e.target.value))
                  }
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-theme-secondary text-xs sm:text-sm mt-2">
                  {Array.from({ length: totalMembers }, (_, i) => (
                    <span key={i + 1}>{i + 1}</span>
                  ))}
                </div>
              </div>
            </div>

            {validationError && (
              <div className="text-red-400 text-lg">{validationError}</div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                onClick={closeModal}
                className="w-full sm:flex-1 bg-theme-bg-tertiary border border-theme-border text-theme py-2 sm:py-3 rounded-lg font-medium hover:bg-theme-bg-tertiary/80 transition-all text-xs sm:text-base"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleProposeThresholdChange()
                  console.log('New threshold:', threshold)
                  closeModal()
                }}
                className="w-full sm:flex-1 bg-primary text-white py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 transition-all text-xs sm:text-base"
                disabled={writeThresholdLoading || !isValidThreshold}
              >
                {writeThresholdLoading
                  ? 'Proposing Transaction'
                  : 'Propose Transaction'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: ${actualTheme === 'dark' ? 'white' : '#374151'};
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: ${actualTheme === 'dark' ? 'white' : '#374151'};
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider {
          background: linear-gradient(
            to right,
            ${actualTheme === 'dark' ? 'white' : '#6366f1'} 0%,
            ${actualTheme === 'dark' ? 'white' : '#6366f1'}
              ${(threshold - 1) * (100 / (totalMembers - 1))}%,
            ${actualTheme === 'dark' ? '#374151' : '#cbd5e1'}
              ${(threshold - 1) * (100 / (totalMembers - 1))}%,
            ${actualTheme === 'dark' ? '#374151' : '#cbd5e1'} 100%
          );
        }
      `}</style>
    </div>
  )
}
