'use client'

import { usePathname } from 'next/navigation'

export default function StepIndicators() {
  const pathname = usePathname()

  const isStep2 = pathname.includes('step2')
  const isStep3 = pathname.includes('step3')

  return (
    <div className="w-full flex justify-between items-center md:px-8 relative">
      {/* Horizontal Lines */}
      <div
        className={`${isStep2 || isStep3 ? 'bg-[#6F2FCE]' : 'bg-[#8E9BAE]'} absolute top-[22.5px] md:left-[18%] left-[23%] w-[15%] md:w-[25%] h-[1px]`}
      ></div>
      <div
        className={`${isStep3 ? 'bg-[#6F2FCE]' : 'bg-[#8E9BAE]'} absolute top-[22.5px] md:right-[18%] right-[23%] w-[15%] md:w-[25%] h-[1px]`}
      ></div>

      {/* Step 1 */}
      <div className="flex flex-col items-center gap-8 relative">
        <div className="bg-[#6F2FCE] text-white flex justify-center items-center w-[45px] h-[45px] rounded-full  font-[700] text-lg z-10">
          1
        </div>
        <h4 className="text-white text-sm text-center font-[400]">
          Account Details
        </h4>
      </div>

      {/* Step 2 */}
      <div className="flex flex-col items-center gap-8 relative">
        <div
          className={`${isStep2 || isStep3 ? 'bg-[#6F2FCE] text-white ' : 'bg-[#1C1D1F] text-[#8E9BAE]'} flex justify-center items-center w-[45px] h-[45px] rounded-full  font-[700] text-lg z-10`}
        >
          2
        </div>
        <h4
          className={`${isStep2 || isStep3 ? 'text-white ' : 'text-[#8E9BAE]'} text-sm text-center font-[400]`}
        >
          Members & Threshold
        </h4>
      </div>

      {/* Step 3 */}
      <div className="flex flex-col items-center gap-8 relative">
        <div
          className={`${isStep3 ? 'bg-[#6F2FCE] text-white ' : 'bg-[#1C1D1F] text-[#8E9BAE]'} flex justify-center items-center w-[45px] h-[45px] rounded-full bg-[#1C1D1F] text-[#8E9BAE] font-[700] text-lg z-10`}
        >
          3
        </div>
        <h4
          className={`${isStep3 ? 'text-white ' : 'text-[#8E9BAE]'} text-sm text-center font-[400]`}
        >
          Confirm & Setup
        </h4>
      </div>
    </div>
  )
}
