'use client'
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react'
import { useAccount, useDisconnect } from '@starknet-react/core'
import { apiClient } from '@/lib/api/client'

export interface WalletAuthContextType {
  isAuthenticated: boolean
  isAuthModalOpen: boolean
  setIsAuthModalOpen: (open: boolean) => void
  authenticate: () => void
  logout: () => void
  needsAuthentication: boolean
}

const WalletAuthContext = createContext<WalletAuthContextType | undefined>(
  undefined,
)

type WalletAuthProviderProps = {
  children: ReactNode
}

export const WalletAuthProvider = ({ children }: WalletAuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  // Load authentication state from localStorage and restore JWT token
  useEffect(() => {
    if (typeof window !== 'undefined' && address) {
      const authToken = localStorage.getItem('auth_token')
      const memberAddress = localStorage.getItem('member_address')

      // Check if user has valid token
      const isAuth = authToken && memberAddress

      if (isAuth) {
        // Restore the auth token in API client
        apiClient.setAuthToken(authToken)
        setIsAuthenticated(true)
        setHasCheckedAuth(true)
      } else {
        setIsAuthenticated(false)
        setHasCheckedAuth(true)

        // If wallet is connected but not authenticated, show modal
        // Small delay to ensure smooth transition after wallet connect modal closes
        setTimeout(() => {
          setIsAuthModalOpen(true)
        }, 500)
      }
    } else if (!address) {
      // Reset auth state if wallet disconnects
      setIsAuthenticated(false)
      setHasCheckedAuth(false)
      setIsAuthModalOpen(false)
    }
  }, [address])

  const authenticate = () => {
    setIsAuthenticated(true)
    setIsAuthModalOpen(false)
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      // Clear all auth tokens
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('member_address')
      apiClient.clearAuthToken()
    }
    setIsAuthenticated(false)
    disconnect()
  }

  const needsAuthentication = Boolean(
    address && !isAuthenticated && hasCheckedAuth,
  )

  return (
    <WalletAuthContext.Provider
      value={{
        isAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authenticate,
        logout,
        needsAuthentication,
      }}
    >
      {children}
    </WalletAuthContext.Provider>
  )
}

export const useWalletAuth = () => {
  const context = useContext(WalletAuthContext)
  if (!context) {
    throw new Error('useWalletAuth must be used within WalletAuthProvider')
  }
  return context
}
