'use client'

import { useState, useEffect } from 'react'
import { X, ChevronDown, Calendar } from 'lucide-react'
import Image from 'next/image'

interface CreateSmartLockPlanModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (planData: SmartLockPlanData) => Promise<void>
}

interface SmartLockPlanData {
  name: string
  token: string
  amount: string
  duration: string
  durationType: 'days' | 'weeks' | 'months'
}

interface Token {
  symbol: string
  name: string
  icon: string
  address: string
}

const AVAILABLE_TOKENS: Token[] = [
  {
    symbol: 'USDT',
    name: 'Tether USD',
    icon: '/Images/usdt.png',
    address: '0x...',
  },
  {
    symbol: 'STRK',
    name: 'Starknet Token',
    icon: '/Images/strk.png',
    address: '0x...',
  },
]

const DURATION_PRESETS = [
  { label: '1 Day', value: '1', type: 'days' as const },
  { label: '5 Days', value: '5', type: 'days' as const },
  { label: '1 Week', value: '1', type: 'weeks' as const },
  { label: '2 Weeks', value: '2', type: 'weeks' as const },
  { label: '1 Month', value: '1', type: 'months' as const },
  { label: '3 Months', value: '3', type: 'months' as const },
  { label: 'Custom', value: 'custom', type: 'days' as const },
]

export default function CreateSmartLockPlanModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateSmartLockPlanModalProps) {
  const [formData, setFormData] = useState<SmartLockPlanData>({
    name: '',
    token: 'USDT',
    amount: '',
    duration: '5',
    durationType: 'days',
  })
  const [errors, setErrors] = useState<Partial<SmartLockPlanData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTokenDropdown, setShowTokenDropdown] = useState(false)
  const [showDurationDropdown, setShowDurationDropdown] = useState(false)
  const [customDuration, setCustomDuration] = useState('')
  const [selectedDurationPreset, setSelectedDurationPreset] = useState('5 Days')

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (
        !target.closest('.token-dropdown') &&
        !target.closest('.token-dropdown-button')
      ) {
        setShowTokenDropdown(false)
      }
      if (
        !target.closest('.duration-dropdown') &&
        !target.closest('.duration-dropdown-button')
      ) {
        setShowDurationDropdown(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isSubmitting) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen) return null

  const selectedToken = AVAILABLE_TOKENS.find(
    (token) => token.symbol === formData.token,
  )

  const validateForm = (): boolean => {
    const newErrors: Partial<SmartLockPlanData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Plan name is required'
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }

    if (selectedDurationPreset === 'Custom' && !customDuration.trim()) {
      newErrors.duration = 'Custom duration is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const finalDuration =
        selectedDurationPreset === 'Custom' ? customDuration : formData.duration
      await onSubmit({
        ...formData,
        duration: finalDuration,
      })
      onClose()
      // Reset form
      setFormData({
        name: '',
        token: 'USDT',
        amount: '',
        duration: '5',
        durationType: 'days',
      })
      setCustomDuration('')
      setSelectedDurationPreset('5 Days')
    } catch (error) {
      console.error('Error creating smart lock plan:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDurationSelect = (preset: (typeof DURATION_PRESETS)[0]) => {
    setSelectedDurationPreset(preset.label)
    if (preset.value !== 'custom') {
      setFormData((prev) => ({
        ...prev,
        duration: preset.value,
        durationType: preset.type,
      }))
    }
    setShowDurationDropdown(false)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose()
    }
  }

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm m-0"
      onClick={handleBackdropClick}
    >
      <div
        className="relative bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-xl w-full max-w-md md:max-w-xl"
        onClick={handleModalContentClick}
      >
        {/* Header */}
        <div className="flex flex-col items-end justify-between p-6 pb-[30px]">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Create Smart Lock Plan
            </h2>
            <p className="text-sm md:text-base text-gray-400 mt-1">
              Simply input the correct information to create a new smart lock
              plan.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
          {/* Name of Plan */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Name of Plan
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter name for this smart lock"
              className={`w-full bg-[#2C2C2E] text-white rounded-lg px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6F2FCE] border ${
                errors.name ? 'border-red-500' : 'border-transparent'
              }`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Select Token */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Select Token
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowTokenDropdown(!showTokenDropdown)
                  setShowDurationDropdown(false)
                }}
                className="token-dropdown-button w-full bg-[#2C2C2E] text-white rounded-lg px-4 py-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#6F2FCE] hover:bg-[#3C3C3E] transition-colors"
                disabled={isSubmitting}
              >
                <div className="flex items-center gap-3">
                  {selectedToken && (
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src={selectedToken.icon || '/placeholder.svg'}
                        alt={selectedToken.symbol}
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <span>{selectedToken?.symbol || 'Select Token'}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${showTokenDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {showTokenDropdown && (
                <div className="token-dropdown absolute top-full left-0 right-0 mt-1 bg-[#2C2C2E] border border-[#3C3C3E] rounded-lg shadow-lg z-10">
                  {AVAILABLE_TOKENS.map((token) => (
                    <button
                      key={token.symbol}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFormData((prev) => ({
                          ...prev,
                          token: token.symbol,
                        }))
                        setShowTokenDropdown(false)
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#3C3C3E] text-left transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <Image
                          src={token.icon || '/placeholder.svg'}
                          alt={token.symbol}
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {token.symbol}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {token.name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enter Amount */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Enter Amount
            </label>
            <input
              type="text"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
              placeholder="Enter amount to lock"
              className={`w-full bg-[#2C2C2E] text-white rounded-lg px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6F2FCE] border ${
                errors.amount ? 'border-red-500' : 'border-transparent'
              }`}
              disabled={isSubmitting}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Duration
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDurationDropdown(!showDurationDropdown)
                  setShowTokenDropdown(false)
                }}
                className="duration-dropdown-button w-full bg-[#2C2C2E] text-white rounded-lg px-4 py-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#6F2FCE] hover:bg-[#3C3C3E] transition-colors"
                disabled={isSubmitting}
              >
                <span>{selectedDurationPreset}</span>
                <Calendar
                  className={`w-4 h-4 text-gray-400 transition-transform ${showDurationDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {showDurationDropdown && (
                <div className="duration-dropdown absolute top-full left-0 right-0 mt-1 bg-[#2C2C2E] border border-[#3C3C3E] rounded-lg shadow-lg z-10">
                  {DURATION_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDurationSelect(preset)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-[#3C3C3E] text-white transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedDurationPreset === 'Custom' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  placeholder="Enter custom duration (e.g., 10 days)"
                  className={`w-full bg-[#2C2C2E] text-white rounded-lg px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6F2FCE] border ${
                    errors.duration ? 'border-red-500' : 'border-transparent'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.duration && (
                  <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 text-sm md:text-base">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#2C2C2E] text-white py-3 rounded-lg font-medium hover:bg-[#3C3C3E] transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#6F2FCE] text-white py-3 rounded-lg font-medium hover:bg-[#5B28B8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Propose Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
