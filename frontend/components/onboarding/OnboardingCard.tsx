interface OnboardingCardProps {
  title: string
  children: React.ReactNode
}

export default function OnboardingCard({
  title,
  children,
}: OnboardingCardProps) {
  return (
    <div className="rounded-[10px] bg-[#1C1D1F] w-full overflow-hidden">
      <div className="bg-[#272729] py-[18px] md:px-[26px] px-4 w-full h-[62px]">
        <h4 className="text-white font-[700] text-xl">{title}</h4>
      </div>
      {children}
    </div>
  )
}




