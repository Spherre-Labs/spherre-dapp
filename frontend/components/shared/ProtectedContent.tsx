'use client'
import React from 'react'
import { useWalletAuth } from '@/app/context/wallet-auth-context'
import { Lock } from 'lucide-react'

interface ProtectedContentProps {
  children: React.ReactNode
  fallbackMessage?: string
}

/**
 * ProtectedContent component
 *
 * Wraps sensitive content that should only be visible to authenticated users.
 * If the user is not authenticated, it shows a message prompting them to sign in.
 *
 * Usage:
 * <ProtectedContent>
 *   <YourSensitiveComponent />
 * </ProtectedContent>
 */
const ProtectedContent: React.FC<ProtectedContentProps> = ({
  children,
  fallbackMessage = 'Please sign in with your wallet to view this content',
}) => {
  const { isAuthenticated, setIsAuthModalOpen } = useWalletAuth()

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg border bg-theme-bg-tertiary border-theme-border transition-colors duration-300">
      <div className="p-4 rounded-full mb-4 bg-yellow-500/20">
        <Lock className="w-8 h-8 text-yellow-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-theme transition-colors duration-300">
        Authentication Required
      </h3>
      <p className="text-sm text-center mb-4 text-theme-secondary transition-colors duration-300">
        {fallbackMessage}
      </p>
      <button
        onClick={() => setIsAuthModalOpen(true)}
        className="px-6 py-2 rounded-lg font-medium transition-colors bg-primary text-white hover:bg-primary/90"
      >
        Sign In Now
      </button>
    </div>
  )
}

export default ProtectedContent

/**
 * useRequireAuth hook
 *
 * A hook to check authentication status and access authentication functions.
 *
 * Usage:
 * const { isAuthenticated, requireAuth } = useRequireAuth()
 *
 * if (!isAuthenticated) {
 *   return <div>Please authenticate first</div>
 * }
 */
export const useRequireAuth = () => {
  const { isAuthenticated, setIsAuthModalOpen } = useWalletAuth()

  const requireAuth = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true)
      return false
    }
    return true
  }

  return {
    isAuthenticated,
    requireAuth,
  }
}
