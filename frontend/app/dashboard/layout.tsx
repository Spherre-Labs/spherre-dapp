import { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#101213]">
      <main className="overflow-x-hidden overflow-y-auto p-6">{children}</main>
    </div>
  )
}
