'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { LuTrash } from 'react-icons/lu'
import OnboardingCard from './OnboardingCard'
import { useOnboarding } from '@/context/OnboardingContext'
import { useTheme } from '@/app/context/theme-context-provider'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import * as z from 'zod'
import StepIndicator from './StepIndicators'

const isValidStarknetAddress = (address: string) => {
  const addressRegex = /^0x[0-9a-fA-F]{64}$/
  // Check if the address matches the regex
  return addressRegex.test(address)
}

// Define validation schema for Step 2
const stepTwoSchema = z.object({
  members: z
    .array(
      z.object({
        address: z
          .string()
          .refine((val) => val.trim() !== '' && isValidStarknetAddress(val), {
            message: 'Please enter a valid Starknet wallet address',
          }),
      }),
    )
    .min(1, { message: 'Please add at least one member' })
    .refine(
      (members) => {
        // Extract all non-empty addresses
        const addresses = members
          .map((m) => m.address.trim())
          .filter((addr) => addr !== '')

        // Check if there are any duplicates
        return new Set(addresses).size === addresses.length
      },
      {
        message: 'Each member address must be unique',
      },
    ),
  approvals: z.number().min(1),
})

type StepTwoData = z.infer<typeof stepTwoSchema>

const StepTwo = () => {
  const router = useRouter()
  const { actualTheme } = useTheme()
  const onboarding = useOnboarding()
  if (!onboarding) throw new Error('OnboardingContext is missing')
  const { setMembers, setApprovals } = onboarding

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<StepTwoData>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      members: [{ address: '' }],
      approvals: 1,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  })

  // Watch members to update max approvals
  const members = watch('members')
  const approvals = watch('approvals')

  // Set focus to the first member input on page load
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      setFocus('members.0.address')
    }, 100)

    return () => clearTimeout(focusTimer)
  }, [setFocus])

  // Update approvals if it exceeds members length
  useEffect(() => {
    if (approvals > members.length) {
      setValue('approvals', members.length)
    }
  }, [members, approvals, setValue])

  const addNewMember = () => {
    append({ address: '' })
  }

  const handleApprovalsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValue('approvals', Number(event.target.value))
  }

  // Check for duplicate addresses to highlight them
  const memberAddresses = watch('members')
    .map((m) => m.address.trim())
    .filter((addr) => addr !== '')
  const duplicateAddresses = memberAddresses.filter(
    (addr, index) => memberAddresses.indexOf(addr) !== index,
  )

  const percentage =
    members.length > 1 ? ((approvals - 1) / (members.length - 1)) * 100 : 100

  const handleSubmitStepTwo = async (data: StepTwoData) => {
    setMembers(data.members.map((m) => m.address))
    setApprovals(data.approvals)
    router.push('/create-account/confirm-setup')
  }

  return (
    <OnboardingCard>
      <form
        onSubmit={handleSubmit(handleSubmitStepTwo)}
        className="bg-theme-bg-primary p-6 sm:p-8 rounded-2xl space-y-6 max-w-2xl mx-auto"
      >
        <StepIndicator currentStep={2} totalSteps={3} />

        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-theme">
            Add Members
          </h2>
          <p className="text-theme-secondary text-sm sm:text-base">
            Add wallet addresses of people you want to include in your multisig account
          </p>
        </div>

        {/* Members Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-theme font-medium">
              Members ({members.length})
            </label>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    {...register(`members.${index}.address`)}
                    placeholder={`Member ${index + 1} wallet address`}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors bg-theme-bg-secondary text-theme placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-primary ${
                      duplicateAddresses.includes(watch(`members.${index}.address`)?.trim())
                        ? 'border-red-500 focus:border-red-500'
                        : errors.members?.[index]?.address
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-theme-border focus:border-primary'
                    }`}
                  />
                  {errors.members?.[index]?.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.members[index]?.address?.message}
                    </p>
                  )}
                </div>
                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LuTrash size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addNewMember}
            className="w-full py-3 border-2 border-dashed border-theme-border text-theme-secondary hover:border-primary hover:text-primary transition-colors rounded-lg flex items-center justify-center gap-2"
          >
            <FaPlus size={16} />
            Add Another Member
          </button>

          {errors.members && (
            <p className="text-red-500 text-sm">{errors.members.message}</p>
          )}
        </div>

        {/* Member Permissions Info */}
        <div className="bg-theme-bg-secondary rounded-lg p-4 border border-theme-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-xs">i</span>
            </div>
            <h3 className="font-semibold text-theme">Member Permissions</h3>
          </div>
          <div className="space-y-2 text-sm text-theme-secondary">
            <p>All members will be assigned the following roles by default:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium border bg-[#FF7BE9]/10 text-[#FF7BE9] border-[#FF7BE9]">
                Voter
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium border bg-[#FF8A25]/10 text-[#FF8A25] border-[#FF8A25]">
                Proposer
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium border bg-[#19B360]/10 text-[#19B360] border-[#19B360]">
                Executor
              </span>
            </div>
            <p className="mt-2">
              You can modify individual member roles after account creation through the Members page.
              Role changes will require approval from other members.
            </p>
          </div>
        </div>

        {/* Approvals Section */}
        <div className="space-y-4">
          <label className="text-theme font-medium">
            Required Approvals for Transactions
          </label>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-theme-secondary text-sm">
                {approvals} out of {members.length} members
              </span>
              <span className="text-theme-secondary text-sm">
                {Math.round(percentage)}%
              </span>
            </div>

            <input
              type="range"
              min="1"
              max={members.length}
              value={approvals}
              onChange={handleApprovalsChange}
              className="w-full h-2 bg-theme-bg-secondary rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #A259FF 0%, #A259FF ${percentage}%, #374151 ${percentage}%, #374151 100%)`,
              }}
            />

            <div className="flex justify-between text-xs text-theme-secondary">
              <span>1</span>
              <span>{members.length}</span>
            </div>
          </div>

          {errors.approvals && (
            <p className="text-red-500 text-sm">{errors.approvals.message}</p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 border border-theme-border text-theme rounded-lg hover:bg-theme-bg-secondary transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Continue'}
          </button>
        </div>
      </form>
    </OnboardingCard>
  )
}

export default StepTwo
