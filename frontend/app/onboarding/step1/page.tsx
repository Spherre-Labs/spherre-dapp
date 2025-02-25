import Nav from '@/components/onboarding/Nav'
import StepOne from '@/components/onboarding/StepOne'

export default function UserOnBoarding() {
  return (
    <main className="w-full lg:px-[50px] md:px-6 px-4 md:py-[50px] py-4 overflow-x-hidden">
      <Nav />
      <StepOne />
    </main>
  )
}
