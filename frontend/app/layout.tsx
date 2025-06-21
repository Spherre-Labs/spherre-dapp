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
  title: 'Spherre Multisig',
  description:
    'Spherre is a next-gen platform for secure, collaborative, multi-user crypto wallet and treasury management. Perfect for DAOs, startups, and organizations.',
  icons: {
    icon: '/Images/spherrelogo.png',
  },
  openGraph: {
    title: 'Spherre Multisig',
    description:
      'Collaborate with confidence using Spherre – the modern way to manage crypto wallets with teams, DAOs, and organizations. Secure, scalable, and intuitive.',
    url: 'https://spherre.xyz',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Spherre Platform Preview',
      },
    ],
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Images/spherrelogo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunitoSans.variable} antialiased`}
      >
        <div id="modal-root"></div>
        <StarknetProvider>
          <OnboardingProvider>{children}</OnboardingProvider>
        </StarknetProvider>
      </body>
    </html>
  )
}
