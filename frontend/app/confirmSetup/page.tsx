import Header from '../components/Header'
import Stepper from '../components/Stepper'
import SphereAccountReview from '../components/SphereAccountReview'
import MembersThreshold from '../components/MembersThreshold'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="flex flex-col items-center px-4 pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8">
        <Stepper />

        <div className="w-full max-w-[456px] text-center">
          <h1 className="font-['Nunito_Sans'] font-bold text-2xl sm:text-3xl md:text-4xl leading-[1.2] tracking-[-0.8px] mb-3 sm:mb-4">
            Confirm and Secure Your Setup
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8 max-w-lg mx-auto">
            Review your vault configuration, approve key settings, and finalize
            your setup.
          </p>
        </div>

        {/* Review & Threshold Sections */}
        <div className="w-full max-w-lg flex flex-col items-center space-y-4">
          <SphereAccountReview />
          <MembersThreshold />
        </div>
      </div>
    </div>
  )
}
