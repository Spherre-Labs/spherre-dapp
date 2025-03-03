import Nav from '@/components/onboarding/Nav'
import StepIndicators from '@/components/onboarding/StepIndicators'

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="w-full lg:px-[50px] md:px-6 px-4 md:py-[50px] py-4 overflow-x-hidden">
      <Nav />
      <section className="max-w-2xl mx-auto md:mt-28 mt-20">
        <div className="w-full flex flex-col items-center gap-6">
          {/* Step Indicators */}
          <StepIndicators />

          {children}
        </div>
      </section>
    </main>
  )
}
