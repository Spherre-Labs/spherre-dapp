'use client'

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  // Determine which steps are active based on the currentStep
  const isStep2 = currentStep >= 2;
  const isStep3 = currentStep >= 3;

  return (
    <div className="w-full flex justify-between items-center md:px-8 relative">
      {/* Horizontal Lines Container - Step 1 to 2 */}
      <div className="absolute top-[22.5px] md:left-[18%] left-[23%] w-[15%] md:w-[25%] h-[1px] bg-[#8E9BAE] overflow-hidden">
        {/* Animated overlay for the first line */}
        <div 
          className={`absolute top-0 left-0 h-full bg-[#6F2FCE] transition-all duration-500 ease-in-out ${isStep2 || isStep3 ? 'w-full' : 'w-0'}`}
        ></div>
      </div>

      {/* Horizontal Lines Container - Step 2 to 3 */}
      <div className="absolute top-[22.5px] md:right-[18%] right-[23%] w-[15%] md:w-[25%] h-[1px] bg-[#8E9BAE] overflow-hidden">
        {/* Animated overlay for the second line */}
        <div 
          className={`absolute top-0 left-0 h-full bg-[#6F2FCE] transition-all duration-500 ease-in-out ${isStep3 ? 'w-full' : 'w-0'}`}
        ></div>
      </div>
      
      {/* Step 1 */}
      <div className="flex flex-col items-center gap-8 relative">
        <div className="bg-[#6F2FCE] text-white flex justify-center items-center w-[45px] h-[45px] rounded-full font-[700] text-lg z-10 transition-colors duration-300">
          1
        </div>
        <h4 className="text-white text-sm text-center font-[400]">
          Account Details
        </h4>
      </div>
      
      {/* Step 2 */}
      <div className="flex flex-col items-center gap-8 relative">
        <div
          className={`${isStep2 || isStep3 ? 'bg-[#6F2FCE] text-white ' : 'bg-[#1C1D1F] text-[#8E9BAE]'} flex justify-center items-center w-[45px] h-[45px] rounded-full font-[700] text-lg z-10 transition-colors duration-300`}
        >
          2
        </div>
        <h4
          className={`${isStep2 || isStep3 ? 'text-white ' : 'text-[#8E9BAE]'} text-sm text-center font-[400] transition-colors duration-300`}
        >
          Members & Threshold
        </h4>
      </div>
      
      {/* Step 3 */}
      <div className="flex flex-col items-center gap-8 relative">
        <div
          className={`${isStep3 ? 'bg-[#6F2FCE] text-white ' : 'bg-[#1C1D1F] text-[#8E9BAE]'} flex justify-center items-center w-[45px] h-[45px] rounded-full font-[700] text-lg z-10 transition-colors duration-300`}
        >
          3
        </div>
        <h4
          className={`${isStep3 ? 'text-white ' : 'text-[#8E9BAE]'} text-sm text-center font-[400] transition-colors duration-300`}
        >
          Confirm & Setup
        </h4>
      </div>

      <style jsx>{`
        @keyframes slide-right {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}