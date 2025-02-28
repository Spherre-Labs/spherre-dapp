import Header from '../components/Header';
import SecondStepper from '../components/SecondStepper';
import AddShereMembers from '../components/AddSphereMembers';
import ConfigureThreshold from '../components/ConfigureThreshold';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      {/* Main Content */}
      <div className="flex flex-col items-center pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8">
        {/* Stepper */}
        <SecondStepper />

        {/* Heading and Description */}
        <div className="w-full px-4 sm:w-[456px]">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center">
          Add Members to a Multisig Vault
          </h1>
          <p className="text-gray-400 text-sm sm:text-base text-center mb-6 sm:mb-8 max-w-lg">
          Add your team members & customize security settings to fit your team needs.
          </p>
        </div>

        {/* Sphere Review Card and Members Threshold */}
        <div className="w-full px-4 flex flex-col items-center space-y-4">
          <AddShereMembers />
          <ConfigureThreshold />
        </div>
      </div>
    </div>
  );
}