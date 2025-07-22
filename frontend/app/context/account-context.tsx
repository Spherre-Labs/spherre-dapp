'use client'
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react'
import { isValidStarknetAddress, SPHERRE_CONTRACTS } from '@/lib'
import { validateAndParseAddress } from 'starknet'
import { useParams } from 'next/navigation'
import { useLocalStorage } from 'usehooks-ts'

export const SpherreAccountContext = createContext<{
  accountAddress: `0x${string}` | null
  setAccountAddress: (address: `0x${string}` | null) => void
}>({
  accountAddress: null,
  setAccountAddress: () => {},
})

type SpherreAccountProviderProps = {
  children: ReactNode
}

export const SpherreAccountProvider = ({
  children,
}: SpherreAccountProviderProps) => {
  // Declaring the default spherre account address for the main time
  const [accountAddress, _setAccountAddress] = useState<`0x${string}` | null>(
    SPHERRE_CONTRACTS.SPHERRE_ACCOUNT,
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const value = window.localStorage.getItem('SpherreAccountAddress')
      if (value && isValidStarknetAddress(value)) {
        _setAccountAddress(value as `0x${string}`)
      } else if (value) {
        console.error('Invalid address in local storage:', value)
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('SpherreAccountAddress')
        }
      }
    }
  }, [])

  const setAccountAddress = (address: `0x${string}` | null) => {
    if (address && !isValidStarknetAddress(address)) {
      console.error('Invalid Starknet address provided:', address)
      return
    }
    _setAccountAddress(address)
    if (typeof window !== 'undefined') {
      if (address) {
        window.localStorage.setItem('SpherreAccountAddress', address)
      } else {
        window.localStorage.removeItem('SpherreAccountAddress')
      }
    }
  }
  return (
    <SpherreAccountContext.Provider
      value={{
        accountAddress: accountAddress
          ? (validateAndParseAddress(accountAddress) as `0x${string}`)
          : null,
        setAccountAddress,
      }}
    >
      {children}
    </SpherreAccountContext.Provider>
  )
}

export const useSpherreAccount = () => {
  const context = useContext(SpherreAccountContext)
  const params = useParams()
  if (!context) {
    throw new Error(
      'useSpherreAccount must be used within a SpherreAccountProvider',
    )
  }
  // Remove direct setAccountAddress call from render phase
  // Instead, use a useEffect in the component that uses this hook, or provide a custom hook for this logic
  return { ...context, params }
}
