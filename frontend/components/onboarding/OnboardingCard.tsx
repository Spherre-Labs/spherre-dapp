import React from 'react'
import { useTheme } from '@/app/context/theme-context-provider'

interface OnboardingCardProps {
  title: string
  children: React.ReactNode
}

export default function OnboardingCard({
  title,
  children,
}: OnboardingCardProps) {
  useTheme()
  return (
    <div className="rounded-[10px] bg-theme-bg-secondary border border-theme-border w-full overflow-hidden transition-colors duration-300">
      <div className="bg-theme-bg-tertiary border-b border-theme-border py-4 sm:py-[18px] px-4 sm:px-[26px] w-full h-[50px] sm:h-[62px] flex items-center transition-colors duration-300">
        <h4 className="text-theme font-[700] text-lg sm:text-xl transition-colors duration-300">
          {title}
        </h4>
      </div>
      {children}
    </div>
  )
}
