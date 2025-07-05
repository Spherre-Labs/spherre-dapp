'use client'

import Image from 'next/image'
import { useTheme } from '@/app/context/theme-context-provider'

const group = '/Images/group.svg'
const bookNum = '/Images/book-num.svg'

const ConfirmationFooter = () => {
  const { actualTheme } = useTheme()

  return (
    <div className="w-full max-w-[628px] min-w-[300px] px-[26px] py-[28px] bg-theme-bg-secondary border border-theme-border md:h-[283px] rounded-[10px] flex flex-col items-start justify-center gap-7 transition-colors duration-300">
      <div className="w-full flex items-center justify-between gap-5">
        <div className="basis-1/2 bg-theme-bg-tertiary border border-theme-border rounded-[10px] w-[130px] md:max-w-[281px] h-[139px] flex flex-row items-center justify-between gap-3 py-[33px] px-[14px] md:px-[26px] transition-colors duration-300">
          <div className="h-[90px] flex flex-col justify-between items-start">
            <Image src={group} alt="logo" height={26} width={26} />
            <small className="text-theme-secondary font-semibold text-xs md:text-base transition-colors duration-300">
              Members
            </small>
          </div>

          <h1 className="font-bold text-2xl md:text-[40px] text-theme transition-colors duration-300">
            3
          </h1>
        </div>

        <div className="basis-1/2 bg-theme-bg-tertiary border border-theme-border rounded-[10px] w-[130px] md:max-w-[281px] h-[139px] flex flex-row items-center justify-between md:gap-3 py-[33px] px-[14px] md:px-[26px] transition-colors duration-300">
          <div className="h-[90px] flex flex-col justify-between items-start">
            <Image src={bookNum} alt="logo" height={26} width={26} />
            <small className="text-theme-secondary font-semibold text-xs md:text-base transition-colors duration-300">
              Threshold
            </small>
          </div>

          <h1 className="font-bold text-2xl md:text-[40px] text-theme transition-colors duration-300">
            1/2
          </h1>
        </div>
      </div>

      <div className="w-full flex items-center justify-between gap-5">
        <button className="basis-1/2 bg-theme-bg-tertiary border border-theme-border rounded-[7px] max-w-[281px] h-[50px] flex items-center justify-center text-theme text-center text-base font-medium hover:bg-theme-bg-secondary transition-colors duration-200">
          {' '}
          Back{' '}
        </button>

        <button
          className={`basis-1/2 rounded-[7px] max-w-[281px] h-[50px] flex items-center justify-center text-center text-base font-medium transition-all duration-200 ${
            actualTheme === 'dark'
              ? 'bg-white text-black hover:bg-gray-200'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  )
}

export default ConfirmationFooter
