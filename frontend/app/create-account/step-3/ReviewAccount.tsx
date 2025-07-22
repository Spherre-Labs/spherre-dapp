'use client'

import Image from 'next/image'
import { useTheme } from '@/app/context/theme-context-provider'

const SphereLogo = '/Images/spherre-vector.svg'
const InfoLogo = '/Images/info-icon.svg'

const ReviewAccount = () => {
  useTheme()

  return (
    <div className="w-full max-w-[628px] bg-theme-bg-secondary border border-theme-border min-w-[300] md:h-[326px] rounded-[10px] flex flex-col items-start justify-start transition-colors duration-300">
      <div className="w-full bg-theme-bg-tertiary border-b border-theme-border py-[18px] px-[26px] transition-colors duration-300">
        <h2 className="text-theme font-bold text-lg md:text-xl leading-[27.28px] transition-colors duration-300">
          Review your Spherre Account
        </h2>
      </div>

      <section className="w-full h-full py-[24px] px-[26px] flex flex-col items-start gap-5">
        <div className="w-full flex items-center justify-start flex-row gap-4">
          <span className="w-10 h-10 bg-theme-bg-tertiary border border-theme-border rounded-full flex items-center justify-center transition-colors duration-300">
            <Image src={SphereLogo} alt="logo" height={19.5} width={19.5} />
          </span>

          <h1 className="font-bold text-2xl md:text-[32px] text-theme transition-colors duration-300">
            Backstage Boys{' '}
          </h1>
        </div>

        <div className="flex items-center gap-[44px] my-3">
          <div className="w-full flex items-center gap-[10px]">
            <p className="font-normal text-sm md:text-base text-theme-secondary transition-colors duration-300">
              Deploy Fee
            </p>
            <Image src={InfoLogo} alt="logo" height={20} width={20} />
          </div>
          <h1 className="text-theme font-bold text-xl md:text-[32px] whitespace-nowrap transition-colors duration-300">
            ~0.0530 SOL
          </h1>
        </div>

        <div className="flex items-start gap-[5px] p-0">
          <Image
            src={InfoLogo}
            alt="logo"
            height={20}
            width={20}
            className="mt-[4px]"
          />
          <p className="text-sm font-normal text-theme-secondary transition-colors duration-300">
            This info section should explain why there is a ~0.0530 SOL deploy
            fee. Please the information should be quite detailed{' '}
          </p>
        </div>
      </section>
    </div>
  )
}

export default ReviewAccount
