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
    router.push('/create-account/confirmSetup')
  }

  return (
    <>
      {/* Writeup */}
      <StepIndicator currentStep={2} />
      <div className="max-w-sm my-1 ">
        
        <h1 className="text-center text-theme font-[700] text-2xl sm:text-3xl lg:text-[40px] leading-tight sm:leading-[47.42px] transition-colors duration-300">
          Add Members to a Multisig Vault
        </h1>
        
        <p className="text-sm sm:text-base leading-[25px] text-center text-theme-secondary lg:px-8 mt-3 transition-colors duration-300">
          Add your team members & customize security settings to fit your
          team&apos;s needs.
        </p>
      </div>

      {/* form */}
      <form
        onSubmit={handleSubmit(handleSubmitStepTwo)}
        className="w-full space-y-4"
      >
        <OnboardingCard title="Add Spherre Members">
          {/* Inputs */}
          <div className="w-full flex flex-col gap-6 py-4 md:px-[26px] px-4">
            {/* Display array-level error if any */}
            {errors.members?.root && (
              <p className="text-red-500 text-sm">
                {errors.members.root.message}
              </p>
            )}

            {/* Display uniqueness error if any */}
            {errors.members?.message && (
              <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded">
                {errors.members.message}
              </p>
            )}

            {/* Members inputs */}
            {fields.map((field: { id: string }, index: number) => (
              <div key={field.id} className="w-full">
                <label
                  htmlFor={`members.${index}.address`}
                  className="font-[400] text-xs sm:text-[14px] leading-[24px] text-theme mb-1 block transition-colors duration-300"
                >
                  Member {index + 1}
                </label>

                <div className="relative w-full">
                  <input
                    type="text"
                    id={`members.${index}.address`}
                    className={`w-full text-theme rounded-[7px] placeholder:text-theme-muted px-3 sm:px-4 py-2 sm:py-3 bg-theme-bg-secondary outline-none pr-10 text-sm sm:text-base transition-colors duration-300 ${
                      errors.members?.[index]?.address ||
                      (duplicateAddresses.includes(
                        watch(`members.${index}.address`).trim(),
                      ) &&
                        watch(`members.${index}.address`).trim() !== '')
                        ? 'border border-red-500'
                        : 'border border-theme-border focus:border-primary'
                    }`}
                    placeholder="Enter team member's address"
                    {...register(`members.${index}.address`)}
                  />
                  {index === 0 ? (
                    <LuTrash
                      onClick={() => setValue(`members.${index}.address`, '')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-theme-muted cursor-pointer hover:text-theme transition-colors duration-200"
                    />
                  ) : (
                    <LuTrash
                      onClick={() => remove(index)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-theme-muted cursor-pointer hover:text-theme transition-colors duration-200"
                    />
                  )}
                </div>
                {errors.members?.[index]?.address && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.members[index]?.address?.message}
                  </p>
                )}
                {duplicateAddresses.includes(
                  watch(`members.${index}.address`).trim(),
                ) &&
                  watch(`members.${index}.address`).trim() !== '' && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      This address is already added
                    </p>
                  )}
              </div>
            ))}

            <button
              type="button"
              className="w-full h-[45px] sm:h-[50px] flex justify-center items-center bg-theme-bg-tertiary shadow-[0px_1.08px_2.16px_0px_#1018280A] text-theme font-[500] text-sm sm:text-base rounded-[7px] border border-theme-border hover:bg-theme-bg-secondary transition-all duration-200"
              onClick={addNewMember}
            >
              <FaPlus className="mr-3" /> Add Member
            </button>
          </div>
        </OnboardingCard>

        <OnboardingCard title="Configure Threshold">
          <div className="w-full flex flex-col gap-6 py-4 md:px-[26px] px-4">
            <p className="text-theme-secondary text-xs sm:text-sm mt-1 transition-colors duration-300">
              Please select the amount of approvals needed to confirm a
              transaction.
            </p>

            <div className="w-full">
              <input
                type="range"
                min={1}
                max={members.length}
                step={1}
                value={approvals}
                onChange={handleApprovalsChange}
                className="w-full appearance-none h-2 bg-theme-bg-tertiary rounded-lg outline-none cursor-pointer transition-all"
                style={{
                  background: `linear-gradient(to right, #6f2fcd 0%, #6f2fcd ${percentage}%, var(--theme-bg-tertiary) ${percentage}%, var(--theme-bg-tertiary) 100%)`,
                }}
              />
              <div className="flex items-center justify-between px-1">
                <span className="text-xs sm:text-sm text-theme transition-colors duration-300">
                  1
                </span>
                <span className="text-xs sm:text-sm text-theme transition-colors duration-300">
                  {members.length}
                </span>
              </div>
              <p className="text-center text-theme mt-2 text-sm sm:text-base transition-colors duration-300">
                {approvals} of {members.length} approvals required
              </p>
            </div>
            <button
              disabled={isSubmitting}
              className={`w-full h-[45px] sm:h-[50px] flex justify-center items-center shadow-[0px_1.08px_2.16px_0px_#1018280A] font-[500] text-sm sm:text-base rounded-[7px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                actualTheme === 'dark'
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Continue'}
            </button>

            <style jsx>{`
              input[type='range']::-webkit-slider-thumb {
                appearance: none;
                margin-top: -6px;
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
                border: 3px solid #6f2fcd;
              }

              input[type='range']::-moz-range-thumb {
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
                border: 3px solid #6f2fcd;
              }

              input[type='range']::-ms-thumb {
                margin-top: 0;
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
                border: 3px solid #6f2fcd;
              }

              input[type='range']::-webkit-slider-runnable-track {
                height: 8px;
                border-radius: 4px;
                border: none;
              }

              input[type='range']::-moz-range-track {
                height: 8px;
                border-radius: 4px;
                border: none;
              }

              input[type='range']::-ms-track {
                height: 8px;
                border-radius: 4px;
                border: none;
                background: transparent;
                color: transparent;
              }

              input[type='range']::-ms-fill-lower {
                background: #6f2fcd;
                border-radius: 4px;
              }

              input[type='range']::-ms-fill-upper {
                background: var(--theme-bg-tertiary);
                border-radius: 4px;
              }
            `}</style>
          </div>
        </OnboardingCard>
      </form>
    </>
  )
}

export default StepTwo
