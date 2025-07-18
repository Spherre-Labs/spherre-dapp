'use client'
import { createContext, useState, ReactNode, useContext } from 'react'
import { SPHERRE_CONTRACTS } from '@/lib'

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
  const [accountAddress, setAccountAddress] = useState<`0x${string}` | null>(
    SPHERRE_CONTRACTS.SPHERRE_ACCOUNT,
  )
  return (
    <SpherreAccountContext.Provider
      value={{
        accountAddress,
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
      'useSpherreAccount must be used within a SpherreAccountProvider',
    )
  }
  return context
}
