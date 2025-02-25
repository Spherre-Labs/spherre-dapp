import ConfirmationFooter from '../../components/ConfirmationFooter'
import ReviewAccount from './ReviewAccount'

export default function Page() {
  return (
    <div className="font-sans w-full min-h-screen flex flex-col items-center justify-center bg-[#101213]  gap-5 md:gap-6 p-6  ">
      <h1 className="font-bold  text-[30px] md:text-[40px] text-center max-w-[456px] leading-[37px] md:leading-[47.42px] text-white ">
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
