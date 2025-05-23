// "use client"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Nunito_Sans } from 'next/font/google'
import './globals.css'
import { StarknetProvider } from './components/Providers'
import { OnboardingProvider } from '@/context/OnboardingContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Spherre',
  description: 'The Future of Secure, Collaborative Crypto Management!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunitoSans.variable} antialiased`}
      >
        {/* Modal root for portal rendering */}
        <div id="modal-root"></div>
        <StarknetProvider>
          <OnboardingProvider>{children}</OnboardingProvider>
        </StarknetProvider>
      </body>
    </html>
  )
}
