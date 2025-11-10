'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react'
import { useAccount } from '@starknet-react/core'
import type { TypedData } from 'starknet'
import { authApi, AuthSessionResponse, AccountSummary } from '@/lib/api/auth'
import { apiClient } from '@/lib/api/client'
import { useSpherreAccount } from './account-context'

interface AuthState {
  isAuthenticated: boolean
  member: string | null
  hasAccount: boolean
  accounts: AccountSummary[]
  loading: boolean
}

interface AuthContextValue extends AuthState {
  setSession: (session: AuthSessionResponse | null) => void
  refreshSession: () => Promise<void>
  clearSession: () => Promise<void>
  authenticateWithWallet: () => Promise<AuthSessionResponse | null>
  isAuthenticating: boolean
  authError: string | null
}

const defaultState: AuthState = {
  isAuthenticated: false,
  member: null,
  hasAccount: false,
  accounts: [],
  loading: true,
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(defaultState)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const { setAccountAddress } = useSpherreAccount()
  const { account, address } = useAccount()

  const applySession = useCallback(
    (session: AuthSessionResponse | null) => {
      if (session) {
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          member: session.member,
          hasAccount: session.has_account,
          accounts: session.accounts ?? [],
          loading: false,
        }))
        setAuthError(null)
        if (session.token) {
          apiClient.setAuthToken(session.token)
        }
        const defaultAccount = session.accounts?.[0]?.address ?? null
        setAccountAddress(defaultAccount as `0x${string}` | null)
      } else {
        setState({
          ...defaultState,
          loading: false,
        })
        apiClient.clearAuthToken()
        setAccountAddress(null)
        setAuthError(null)
      }
    },
    [setAccountAddress],
  )

  const refreshSession = useCallback(async () => {
    try {
      const session = await authApi.getSession()
      applySession(session)
    } catch (error) {
      console.warn('Unable to refresh session', error)
      applySession(null)
    }
  }, [applySession])

  const clearSession = useCallback(async () => {
    try {
      await authApi.signOut()
    } catch (error) {
      console.warn('Failed to sign out', error)
    } finally {
      applySession(null)
    }
  }, [applySession])

  const resolvePublicKey = useCallback(async () => {
    if (!account) return null

    const withPublicKey = account as unknown as { publicKey?: string }
    if (withPublicKey.publicKey) {
      return withPublicKey.publicKey
    }

    const withGetPublicKey = account as unknown as {
      getPublicKey?: () => Promise<string>
    }
    if (typeof withGetPublicKey.getPublicKey === 'function') {
      try {
        const key = await withGetPublicKey.getPublicKey()
        if (key) {
          return key
        }
      } catch (error) {
        console.warn(
          'Unable to resolve wallet public key via getPublicKey',
          error,
        )
      }
    }

    if (account.signer && 'getPubKey' in account.signer) {
      try {
        const key = await (
          account.signer as {
            getPubKey: () => Promise<string>
          }
        ).getPubKey()
        if (key) {
          return key
        }
      } catch (error) {
        console.warn(
          'Unable to resolve wallet public key via signer.getPubKey',
          error,
        )
      }
    }

    return null
  }, [account])

  const normalizeHexString = (value: string) => {
    if (!value) return value
    return value.startsWith('0x')
      ? value.toLowerCase()
      : `0x${BigInt(value).toString(16)}`
  }

  const authenticateWithWallet = useCallback(async () => {
    if (!account || !address) {
      return null
    }
    if (isAuthenticating) {
      return null
    }

    setIsAuthenticating(true)
    setAuthError(null)
    try {
      let typedData
      try {
        typedData = await authApi.getLoginTypedData()
      } catch (error) {
        console.warn('Unable to retrieve login typed data', error)
        setAuthError(
          'Authentication service is unavailable. Please confirm the backend is running and try again.',
        )
        return null
      }

      if (!typedData) {
        return null
      }

      const formattedTypedData = typedData as unknown as TypedData
      const signature = await account.signMessage(formattedTypedData)
      const publicKey = await resolvePublicKey()

      if (!publicKey) {
        setAuthError('Unable to retrieve wallet public key from connector.')
        return null
      }

      let session: AuthSessionResponse | null = null
      try {
        session = await authApi.signIn({
          signatures: signature.map((sig) => sig.toString()),
          public_key: normalizeHexString(publicKey),
          wallet_address: normalizeHexString(address),
        })
      } catch (error) {
        console.warn('Wallet authentication failed', error)
        setAuthError(
          'Unable to authenticate with the backend. Please confirm the backend is running and try again.',
        )
        return null
      }

      if (!session) {
        return null
      }

      applySession(session)
      return session
    } catch (error) {
      console.warn('Wallet authentication aborted', error)
      if (error instanceof Error) {
        setAuthError(error.message)
      } else {
        setAuthError('Wallet authentication failed. Please try again.')
      }
      return null
    } finally {
      setIsAuthenticating(false)
    }
  }, [account, address, applySession, isAuthenticating, resolvePublicKey])

  useEffect(() => {
    // refreshSession()
  }, [refreshSession])

  useEffect(() => {
    // Reset auto-auth attempt tracker when wallet address changes or disconnects
  }, [address])

  useEffect(() => {
    if (!account || !address) return
    if (state.loading) return
    if (state.isAuthenticated) return

    // authenticateWithWallet()
  }, [
    account,
    address,
    state.loading,
    state.isAuthenticated,
    authenticateWithWallet,
  ])

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      setSession: applySession,
      refreshSession,
      clearSession,
      authenticateWithWallet,
      isAuthenticating,
      authError,
    }),
    [
      state,
      applySession,
      refreshSession,
      clearSession,
      authenticateWithWallet,
      isAuthenticating,
      authError,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
