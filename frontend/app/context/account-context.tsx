'use client'
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react'
import { isValidStarknetAddress } from '@/lib'
import { validateAndParseAddress } from 'starknet'
import { useParams } from 'next/navigation'

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
    null,
  )
  const params = useParams()
  // Load from localStorage after mount, but don't block rendering
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const value = window.localStorage.getItem('SpherreAccountAddress')
      if (params?.address && typeof params.address === 'string') {
        _setAccountAddress(params.address as `0x${string}`)
      } else if (value && isValidStarknetAddress(value)) {
        _setAccountAddress(value as `0x${string}`)
      } else if (value) {
        console.error('Invalid address in local storage:', value)
        window.localStorage.removeItem('SpherreAccountAddress')
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
  if (!context) {
    throw new Error(
      'useSpherreAccount must be used within SpherreAccountProvider',
    )
  }
  return context
}

// Using the current address from the URL as the account address
export const useCurrentAccountAddress = () => {
  const params = useParams()
  const { accountAddress } = useSpherreAccount()

  if (params?.address && typeof params.address === 'string') {
    return params.address as `0x${string}`
  }

  return accountAddress
}
