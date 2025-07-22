'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useOnboarding } from '@/context/OnboardingContext'
import { useTheme } from '@/app/context/theme-context-provider'
import StepIndicator from './StepIndicators'

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
  const { actualTheme } = useTheme()
  const [charCount, setCharCount] = React.useState(0)
  const onboarding = useOnboarding()
  if (!onboarding) throw new Error('OnboardingContext is missing')
  const { setAccountName, setDescription } = onboarding

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
      setAccountName(data.accountName)
      setDescription(data.desc)
      // Necessary submit logic
      router.push('/create-account/step-2')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="">
      {/* Writeup */}
      <StepIndicator currentStep={1} />
      <div>
        <h1 className="text-center text-theme font-[700] text-2xl sm:text-3xl lg:text-[40px] leading-tight sm:leading-[47.42px] px-4 transition-colors duration-300">
          Secure Your Digital Assets Seamlessly
        </h1>

        <p className="text-sm sm:text-base leading-[25px] text-center text-theme-secondary mx-auto w-full max-w-[337px] mt-3 px-4 transition-colors duration-300">
          Name your Spherre account, Spherre ensures seamless integration,
          giving you full control over your digital assets.
        </p>
      </div>

      {/* form */}
      <div className="rounded-[10px] bg-theme-bg-secondary border border-theme-border w-full overflow-hidden mt-4 mx-4 transition-colors duration-300">
        <div className="bg-theme-bg-tertiary border-b border-theme-border py-4 sm:py-[18px] px-4 sm:px-[26px] w-full h-[50px] sm:h-[62px] flex items-center transition-colors duration-300">
          <h4 className="text-theme font-[700] text-lg sm:text-xl transition-colors duration-300">
            Create Account
          </h4>
        </div>

        {/* Inputs */}
        <form
          onSubmit={handleSubmit(handleSubmitStepOne)}
          className="w-full flex flex-col gap-4 sm:gap-6 py-4 px-4 sm:px-[26px]"
        >
          {/* Account name */}
          <div className="w-full">
            <label
              htmlFor="accountName"
              className="font-[400] text-xs sm:text-[14px] leading-[24px] text-theme mb-1 block transition-colors duration-300"
            >
              Spherre Account Name
            </label>
            <input
              type="text"
              id="accountName"
              className={`w-full rounded-[7px] placeholder:text-theme-muted text-theme px-3 sm:px-4 py-2 sm:py-3 bg-theme-bg-secondary outline-none border text-sm sm:text-base transition-colors duration-300 ${
                errors.accountName
                  ? 'border-red-500'
                  : 'border-theme-border focus:border-primary'
              }`}
              placeholder="Enter a team name"
              {...register('accountName')}
            />
            {errors.accountName && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.accountName.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="w-full">
            <label
              htmlFor="description"
              className="font-[400] text-xs sm:text-[14px] leading-[24px] text-theme mb-1 block pb-2 transition-colors duration-300"
            >
              Spherre Description
            </label>
            <textarea
              id="desc"
              className={`w-full h-[80px] sm:h-[100px] text-theme border rounded-[7px] placeholder:text-theme-muted px-3 sm:px-4 py-2 sm:py-3 bg-theme-bg-secondary outline-none resize-y shadow-[0px_1.08px_2.16px_0px_#1018280A] text-sm sm:text-base transition-colors duration-300 ${
                charCount > 500
                  ? 'border-red-500'
                  : errors.desc
                    ? 'border-red-500'
                    : 'border-theme-border focus:border-primary'
              }`}
              placeholder="Write here..."
              {...register('desc')}
            ></textarea>
            <div className="flex justify-between items-center gap-1">
              {errors.desc && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.desc.message}
                </p>
              )}
              <p
                className={`text-xs mt-1 transition-colors duration-300 ${charCount > 500 ? 'text-red-500' : 'text-theme-secondary'}`}
              >
                {charCount} of 500 characters
              </p>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-[45px] sm:h-[50px] flex justify-center items-center shadow-[0px_1.08px_2.16px_0px_#1018280A] font-[500] text-sm sm:text-base rounded-[7px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              actualTheme === 'dark'
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default StepOne
