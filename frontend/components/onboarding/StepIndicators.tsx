'use client'
import { useTheme } from '@/app/context/theme-context-provider'

interface StepIndicatorProps {
  currentStep: number
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  useTheme()
  const isStep2 = currentStep >= 2
  const isStep3 = currentStep >= 3

  return (
    <div className="w-full flex justify-between items-center md:px-8 relative">
      <div className="absolute top-[22.5px] md:left-[18%] left-[23%] w-[15%] md:w-[25%] h-[1px] bg-theme-border overflow-hidden transition-colors duration-300">
        <div
          className={`absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-in-out ${isStep2 || isStep3 ? 'w-full' : 'w-0'}`}
        ></div>
      </div>
      <div className="absolute top-[22.5px] md:right-[18%] right-[23%] w-[15%] md:w-[25%] h-[1px] bg-theme-border overflow-hidden transition-colors duration-300">
        <div
          className={`absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-in-out ${isStep3 ? 'w-full' : 'w-0'}`}
        ></div>
      </div>
      <div className="flex flex-col items-center gap-8 relative">
        <div className="bg-primary text-white flex justify-center items-center w-[45px] h-[45px] rounded-full font-[700] text-lg z-10 transition-colors duration-300">
          1
        </div>
        <h4 className="text-theme text-sm text-center font-[400] transition-colors duration-300">
          Account Details
        </h4>
      </div>
      <div className="flex flex-col items-center gap-8 relative">
        <div
          className={`${isStep2 || isStep3 ? 'bg-primary text-white' : 'bg-theme-bg-secondary text-theme-muted'} flex justify-center items-center w-[45px] h-[45px] rounded-full font-[700] text-lg z-10 transition-colors duration-300 border border-theme-border`}
        >
          2
        </div>
        <h4
          className={`${isStep2 || isStep3 ? 'text-theme' : 'text-theme-muted'} text-sm text-center font-[400] transition-colors duration-300`}
        >
          Members & Threshold
        </h4>
      </div>
      <div className="flex flex-col items-center gap-8 relative">
        <div
          className={`${isStep3 ? 'bg-primary text-white' : 'bg-theme-bg-secondary text-theme-muted'} flex justify-center items-center w-[45px] h-[45px] rounded-full font-[700] text-lg z-10 transition-colors duration-300 border border-theme-border`}
        >
          3
        </div>
        <h4
          className={`${isStep3 ? 'text-theme' : 'text-theme-muted'} text-sm text-center font-[400] transition-colors duration-300`}
        >
          Confirm & Setup
        </h4>
      </div>

      <style jsx>{`
        @keyframes slide-right {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
