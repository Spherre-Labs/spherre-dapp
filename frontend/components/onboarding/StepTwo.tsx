'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { LuTrash } from 'react-icons/lu'
import OnboardingCard from './OnboardingCard'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import * as z from 'zod'

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
        // Remove the custom path: path: ['unique']
      },
    ),
  approvals: z.number().min(1),
})

type StepTwoData = z.infer<typeof stepTwoSchema>

const StepTwo = () => {
  const router = useRouter()

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

  const handleSubmitStepTwo = async (data: StepTwoData) => {
    try {
      console.log({
        spherreMembers: data.members.map((m) => m.address),
        approvals: data.approvals,
      })
      // Necessary submit logic
      router.push('/confirmSetup')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {/* Writeup */}
      <div className="max-w-sm my-12">
        <h1 className="text-center text-white font-[700] text-[40px] leading-[47.42px]">
          Add Members to a Multisig Vault
        </h1>
        <p className="font-[400] text-[16px] leading-[25px] text-center text-[#8E9BAE] lg:px-8 mt-3">
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
                  className="font-[400] text-[14px] leading-[24px] text-white mb-1 block"
                >
                  Member {index + 1}
                </label>

                <div className="relative w-full">
                  <input
                    type="text"
                    id={`members.${index}.address`}
                    className={`w-full border text-white rounded-[7px] placeholder:text-[#8E9BAE] px-4 py-3 bg-transparent outline-none pr-10 ${
                      errors.members?.[index]?.address ||
                      (duplicateAddresses.includes(
                        watch(`members.${index}.address`).trim(),
                      ) &&
                        watch(`members.${index}.address`).trim() !== '')
                        ? 'border-red-500'
                        : 'border-[#292929]'
                    }`}
                    placeholder="Enter team member's address"
                    {...register(`members.${index}.address`)}
                  />
                  {index === 0 ? (
                    <LuTrash
                      onClick={() => setValue(`members.${index}.address`, '')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8E9BAE] cursor-pointer"
                    />
                  ) : (
                    <LuTrash
                      onClick={() => remove(index)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8E9BAE] cursor-pointer"
                    />
                  )}
                </div>
                {errors.members?.[index]?.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.members[index]?.address?.message}
                  </p>
                )}
                {duplicateAddresses.includes(
                  watch(`members.${index}.address`).trim(),
                ) &&
                  watch(`members.${index}.address`).trim() !== '' && (
                    <p className="text-red-500 text-sm mt-1">
                      This address is already added
                    </p>
                  )}
              </div>
            ))}

            <button
              type="button"
              className="w-full h-[50px] flex justify-center items-center bg-[#272729] shadow-[0px_1.08px_2.16px_0px_#1018280A] text-white font-[500] text-base rounded-[7px]"
              onClick={addNewMember}
            >
              <FaPlus className="mr-3" /> Add Member
            </button>
          </div>
        </OnboardingCard>

        <OnboardingCard title="Configure Threshold">
          <div className="w-full flex flex-col gap-6 py-4 md:px-[26px] px-4">
            <p className="text-gray-400 text-sm mt-1">
              Please select the amount of approvals needed to confirm a
              transaction.
            </p>

            <div className="w-full">
              <input
                type="range"
                min="1"
                max={members.length}
                step="1"
                value={approvals}
                onChange={handleApprovalsChange}
                className="flex-grow w-full appearance-none h-2 bg-[#272729] rounded-lg outline-none cursor-pointer"
              />
              <div className="flex items-center justify-between px-1">
                <span className="text-sm text-white">1</span>
                <span className="text-sm text-white">{members.length}</span>
              </div>
              <p className="text-center text-white mt-2">
                {approvals} of {members.length} approvals required
              </p>
            </div>
            <button
              disabled={isSubmitting}
              className="w-full h-[50px] flex justify-center items-center bg-white shadow-[0px_1.08px_2.16px_0px_#1018280A] text-[#101213] font-[500] text-base rounded-[7px]"
            >
              {isSubmitting ? 'Processing...' : 'Continue'}
            </button>

            <style>
              {`
                input[type='range']::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background: white;
                    border-radius: 50%;
                }`}
            </style>
          </div>
        </OnboardingCard>
      </form>
    </>
  )
}

export default StepTwo
