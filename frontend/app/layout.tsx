// app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Nunito_Sans } from 'next/font/google'
import './globals.css'
import { StarknetProvider } from './components/Providers'
import { OnboardingProvider } from '@/context/OnboardingContext'
import { ThemeProvider } from '@/app/context/theme-context-provider'
import { SpherreAccountProvider } from './context/account-context'
import { AuthProvider } from './context/auth-context'
import { GlobalModalProvider } from './components/modals/GlobalModalProvider'
import { WalletAuthProvider } from './context/wallet-auth-context'
import WalletSignInModal from './components/modals/WalletSignInModal'

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
  robots: 'index, follow',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}
export const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/Images/spherrelogo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunitoSans.variable} antialiased transition-colors duration-300`}
        suppressHydrationWarning
      >
        <div id="modal-root"></div>
        <GlobalModalProvider>
          <ThemeProvider>
            <StarknetProvider>
              <SpherreAccountProvider>
                <AuthProvider>
                  <WalletAuthProvider>
                    <WalletSignInModal />
                    <OnboardingProvider>{children}</OnboardingProvider>
                  </WalletAuthProvider>
                </AuthProvider>
              </SpherreAccountProvider>
            </StarknetProvider>
          </ThemeProvider>
        </GlobalModalProvider>
      </body>
    </html>
  )
}
