'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

// Define validation schema for Step 1
const stepOneSchema = z.object({
  accountName: z
    .string()
    .min(2, { message: 'Account Name must be at least 2 characters' })
    .max(100, { message: 'Account name must be less than 100 characters' }),
  desc: z
    .string()
    .max(500, { message: 'Description must be less than 500 characters' }),
})

type StepOneData = z.infer<typeof stepOneSchema>

const StepOne = () => {
  const router = useRouter()
  const [charCount, setCharCount] = React.useState(0)

  // Initialize react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StepOneData>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      accountName: '',
      desc: '',
    },
  })

  // Watch the description field for changes
  const description = watch('desc')
  React.useEffect(() => {
    setCharCount(description?.length || 0)
  }, [description])

  /**
   * Handles form submission for Step 1 of the onboarding process.
   * Checks if both the account name and description inputs are not empty.
   * If not, it throws an error.
   * If valid, logs the inputs to console and navigates to Step 2.
   * If an error occurs during navigation, it's logged to console.
   */
  const handleSubmitStepOne = async (data: StepOneData) => {
    try {
      console.log(data)
      // Necessary submit logic
      router.push('/onboarding/step2')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      {/* Writeup */}
      <div >
        <h1 className="text-center text-white font-[700] text-[40px] leading-[47.42px]">
          Secure Your Digital Assets Seamlessly
        </h1>
        <p className="text-[16px] leading-[25px] text-center text-[#8E9BAE] mx-auto w-[337px] mt-3">
          Name your Spherre account, Spherre ensures seamless integration,
          giving you full control over your digital assets.
        </p>
      </div>

      {/* form */}
      <div className="rounded-[10px] bg-[#1C1D1F] w-full overflow-hidden mt-4">
        <div className="bg-[#272729] py-[18px] md:px-[26px] px-4 w-full h-[62px]">
          <h4 className="text-white font-[700] text-xl">Create Account</h4>
        </div>

        {/* Inputs */}
        <form
          onSubmit={handleSubmit(handleSubmitStepOne)}
          className="w-full flex flex-col gap-6 py-4 md:px-[26px] px-4"
        >
          {/* Account name */}
          <div className="w-full">
            <label
              htmlFor="accountName"
              className="font-[400] text-[14px]leading-[24px] text-white mb-1 block"
            >
              Spherre Account Name
            </label>
            <input
              type="text"
              id="accountName"
              className={`w-full rounded-[7px] placeholder:text-[#8E9BAE] text-white px-4 py-3 bg-transparent outline-none border ${errors.accountName ? 'border-red-500' : 'border-[#292929]'
                }`}
              placeholder="Enter a team name"
              {...register('accountName')}
            />
            {errors.accountName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.accountName.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="w-full">
            <label
              htmlFor="description"
              className="font-[400] text-[14px]leading-[24px] text-white mb-1 block pb-2"
            >
              Spherre Description
            </label>
            <textarea
              id="desc"
              className={`w-full h-[100px] text-white border rounded-[7px] placeholder:text-[#8E9BAE] px-4 py-3 bg-transparent outline-none resize-y shadow-[0px_1.08px_2.16px_0px_#1018280A] ${
                charCount > 500 ? 'border-red-500' : errors.desc ? 'border-red-500' : 'border-[#292929]'
              }`}
              placeholder="Write here..."
              {...register('desc')}
            ></textarea>
            <div className='flex justify-between items-center gap-1'>
              {errors.desc && (
                <p className="text-red-500 text-sm mt-1">{errors.desc.message}</p>
              )}
              <p className={`text-xs mt-1 ${charCount > 500 ? 'text-red-500' : 'text-[#8E9BAE]'}`}>
                {charCount} of 500 characters
              </p>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[50px] flex justify-center items-center bg-white shadow-[0px_1.08px_2.16px_0px_#1018280A] text-[#101213] font-[500] text-base rounded-[7px]"
          >
            {isSubmitting ? 'Processing...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default StepOne
