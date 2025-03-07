import Nav from '@/components/onboarding/Nav'
import ConfirmationFooter from '../../components/ConfirmationFooter'
// import Header from '../components/Header'
import Stepper from '../components/Stepper'
import ReviewAccount from './ReviewAccount'

export default function Page() {
  return (
    <div className="font-sans w-full min-h-screen flex flex-col items-center justify-center bg-[#101213]  gap-5 md:gap-6 p-6 ">
      {/* <Header /> */}
      <Nav />
      <Stepper />
      <h1 className="text-center text-white font-[700] text-[40px] leading-[47.42px]">
        Confirm and Secure Your Setup
      </h1>
      <p className="text-[#8E9BAE] font-medium text-base max-w-[337px] text-center leading-[25px] ">
        Review your vault configuration, approve key settings, and finalize your
        setup.
      </p>

      <ReviewAccount />

      <ConfirmationFooter />
    </div>
  )
}
