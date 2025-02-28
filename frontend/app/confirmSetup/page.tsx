import Header from '../components/Header';
import Stepper from '../components/Stepper';
import SphereAccountReview from '../components/SphereAccountReview';
import MembersThreshold from '../components/MembersThreshold';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-col items-center pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8">
        {/* Stepper */}
        <Stepper />

        {/* Heading and Description */}
        <div className="w-full px-4 sm:w-[456px]">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center">
            Confirm and Secure Your Setup
          </h1>
          <p className="text-gray-400 text-sm sm:text-base text-center mb-6 sm:mb-8 max-w-lg">
            Review your vault configuration, approve key settings, and finalize your setup.
          </p>
        </div>

        {/* Sphere Review Card and Members Threshold */}
        <div className="w-full px-4 flex flex-col items-center space-y-4">
          <SphereAccountReview />
          <MembersThreshold />
        </div>
      </div>
    </div>
  );
}