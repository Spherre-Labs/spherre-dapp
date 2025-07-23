'use client'

import { useState, useEffect } from 'react'
import { X, ChevronDown, Calendar } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from '@/app/context/theme-context-provider'

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
  useTheme() // Initialize theme context
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
        className="relative bg-theme-bg-secondary border border-theme-border rounded-2xl shadow-xl w-full max-w-md md:max-w-xl transition-colors duration-300"
        onClick={handleModalContentClick}
      >
        {/* Header */}
        <div className="flex flex-col items-end justify-between p-6 pb-[30px]">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-theme-bg-tertiary hover:bg-theme-bg-secondary transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-theme-secondary" />
          </button>
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-theme transition-colors duration-300">
              Create Smart Lock Plan
            </h2>
            <p className="text-sm md:text-base text-theme-secondary mt-1 transition-colors duration-300">
              Simply input the correct information to create a new smart lock
              plan.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
          {/* Name of Plan */}
          <div>
            <label className="block text-sm font-medium text-theme mb-2 transition-colors duration-300">
              Name of Plan
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter name for this smart lock"
              className={`w-full bg-theme-bg-tertiary text-theme rounded-lg px-4 py-3 placeholder:text-theme-secondary focus:outline-none focus:ring-2 focus:ring-primary border transition-colors duration-300 ${
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
            <label className="block text-sm font-medium text-theme mb-2 transition-colors duration-300">
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
                className="token-dropdown-button w-full bg-theme-bg-tertiary text-theme rounded-lg px-4 py-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary hover:bg-theme-bg-secondary transition-colors duration-300"
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
                  className={`w-4 h-4 text-theme-secondary transition-transform ${showTokenDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {showTokenDropdown && (
                <div className="token-dropdown absolute top-full left-0 right-0 mt-1 bg-theme-bg-tertiary border border-theme-border rounded-lg shadow-lg z-10 transition-colors duration-300">
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
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-theme-bg-secondary text-left transition-colors"
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
                        <div className="text-theme font-medium transition-colors duration-300">
                          {token.symbol}
                        </div>
                        <div className="text-theme-secondary text-xs transition-colors duration-300">
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
            <label className="block text-sm font-medium text-theme mb-2 transition-colors duration-300">
              Enter Amount
            </label>
            <input
              type="text"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
              placeholder="Enter amount to lock"
              className={`w-full bg-theme-bg-tertiary text-theme rounded-lg px-4 py-3 placeholder:text-theme-secondary focus:outline-none focus:ring-2 focus:ring-primary border transition-colors duration-300 ${
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
            <label className="block text-sm font-medium text-theme mb-2 transition-colors duration-300">
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
                className="duration-dropdown-button w-full bg-theme-bg-tertiary text-theme rounded-lg px-4 py-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary hover:bg-theme-bg-secondary transition-colors duration-300"
                disabled={isSubmitting}
              >
                <span>{selectedDurationPreset}</span>
                <Calendar
                  className={`w-4 h-4 text-theme-secondary transition-transform ${showDurationDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {showDurationDropdown && (
                <div className="duration-dropdown absolute top-full left-0 right-0 mt-1 bg-theme-bg-tertiary border border-theme-border rounded-lg shadow-lg z-10 transition-colors duration-300">
                  {DURATION_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDurationSelect(preset)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-theme-bg-secondary text-theme transition-colors"
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
                  className={`w-full bg-theme-bg-tertiary text-theme rounded-lg px-4 py-3 placeholder:text-theme-secondary focus:outline-none focus:ring-2 focus:ring-primary border transition-colors duration-300 ${
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
              className="flex-1 bg-theme-bg-tertiary text-theme py-3 rounded-lg font-medium hover:bg-theme-bg-secondary transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Propose Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
