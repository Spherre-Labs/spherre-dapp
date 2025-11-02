import Nav from '@/components/onboarding/Nav'

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="w-full overflow-x-hidden h-screen bg-theme">
      <div className="container-large px-4 sm:px-6 lg:px-8 py-4 md:py-[50px]">
        <Nav />
        <section className="max-w-2xl mx-auto md:mt-10 mt-10">
          <div className="w-full flex flex-col items-center gap-6">
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}
