import StepIndicators from '../../components/onboarding/StepIndicators'
import SphereAccountReview from '../components/SphereAccountReview'
import MembersThreshold from '../components/MembersThreshold'
import Nav from '@/components/onboarding/Nav'

export default function ConfirmSetup() {
  return (
    <div className="w-full lg:px-[50px] md:px-6 px-4 md:py-[50px] py-4 overflow-x-hidden bg-[#0a0a0a]">
      <Nav />
      <div className="text-white">
        {/* Main Container */}
        <div className="flex flex-col items-center px-4 pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8">
          <div className="max-w-[672px] w-full pt-[1rem]">
            <StepIndicators />

            {/* Heading & Description */}
            <div className="max-w-sm mx-auto my-12 text-center pb-8">
              <h1 className="text-white font-[700] text-[40px] leading-[47.42px] pt-4">
                Confirm and Secure Your Setup
              </h1>
              <p className="font-[400] text-[16px] leading-[25px] text-[#8E9BAE] mt-3">
                Review your vault configuration, approve key settings, and
                finalize your setup.
              </p>
            </div>

            {/* Review & Threshold Sections */}
            <div className="rounded-[10px] bg-[#1C1D1F] w-full overflow-hidden">
              <div className="bg-[#272729] py-[18px] md:px-[26px] px-4 w-full h-[62px]">
                <h4 className="text-white font-[700] text-xl">Review Setup</h4>
              </div>
              <div className="w-full flex flex-col gap-6 py-4 md:px-[26px] px-4">
                <SphereAccountReview />
                <MembersThreshold />
                <button
                  type="button"
                  className="w-full h-[50px] flex justify-center items-center bg-white shadow-[0px_1.08px_2.16px_0px_#1018280A] text-[#101213] font-[500] text-base rounded-[7px]"
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
