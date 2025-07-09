'use client'
import StepIndicators from '../../components/onboarding/StepIndicators'
import SphereAccountReview from '../components/SphereAccountReview'
import MembersThreshold from '../components/MembersThreshold'
import Nav from '@/components/onboarding/Nav'
import { useRouter } from 'next/navigation'

export default function ConfirmSetup() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/dapp')
  }

  return (
    <div className="w-full lg:px-[50px] md:px-6 px-4 md:py-[50px] py-4 overflow-x-hidden bg-theme transition-colors duration-300 text-theme">
      <Nav />
      <div className="text-theme">
        {/* Main Container */}
        <div className="flex flex-col items-center px-4 pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8">
          <div className="max-w-[672px] w-full pt-[1rem]">
            <StepIndicators currentStep={3} />

            {/* Heading & Description */}
            <div className="max-w-sm mx-auto my-12 text-center pb-8">
              <h1 className="text-theme font-[700] text-[40px] leading-[47.42px] pt-4 transition-colors duration-300">
                Confirm and Secure Your Setup
              </h1>
              <p className="font-[400] text-[16px] leading-[25px] text-theme-secondary mt-3 transition-colors duration-300">
                Review your vault configuration, approve key settings, and
                finalize your setup.
              </p>
            </div>

            {/* Review & Threshold Sections */}
            <div className="rounded-[10px] bg-theme-bg-secondary w-full overflow-hidden border border-theme-border transition-colors duration-300">
              <div className="bg-theme-bg-tertiary py-[18px] md:px-[26px] px-4 w-full h-[62px] transition-colors duration-300">
                <h4 className="text-theme font-[700] text-xl transition-colors duration-300">
                  Review Setup
                </h4>
              </div>
              <div className="w-full flex flex-col gap-6 py-4 md:px-[26px] px-4">
                <SphereAccountReview />
                <MembersThreshold />
                <button
                  type="button"
                  onClick={handleClick}
                  className="w-full h-[50px] flex justify-center items-center bg-purple-700 dark:bg-white shadow-[0px_1.08px_2.16px_0px_#1018280A] text-[#101213] font-[500] text-base rounded-[7px] hover:bg-gray-50 dark:hover:bg-gray-100 transition-colors duration-300"
                >
                  Confirm Setup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
