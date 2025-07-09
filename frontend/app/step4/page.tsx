'use client'

import Nav from '@/components/onboarding/Nav'
import ConfirmationFooter from '../../components/ConfirmationFooter'
// import Header from '../components/Header'
import Stepper from '../components/Stepper'
import ReviewAccount from './ReviewAccount'
import { useTheme } from '@/app/context/theme-context-provider'

export default function Page() {
  useTheme()

  return (
    <div className="font-sans w-full min-h-screen flex flex-col items-center  bg-theme gap-5 md:gap-6 p-6 transition-colors duration-300">
      {/* <Header /> */}
      <Nav />
      <Stepper />
      <h1 className="text-center text-theme font-[700] text-[40px] leading-[47.42px] transition-colors duration-300">
        Confirm and Secure Your Setup
      </h1>
      <p className="text-theme-secondary font-medium text-base max-w-[337px] text-center leading-[25px] transition-colors duration-300">
        Review your vault configuration, approve key settings, and finalize your
        setup.
      </p>

      <ReviewAccount />

      <ConfirmationFooter />
    </div>
  )
}
