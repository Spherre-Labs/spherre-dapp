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

  const [value, setValue, removeValue] = useLocalStorage<`0x${string}` | null>(
    'SpherreAccountAddress',
    null,
  )
  // TODO: Create a functionality to check if the provided accountAddress
  // is a valid spherre account address.
  const setAccountAddress = (address: `0x${string}` | null) => {
    if (address && !isValidStarknetAddress(address)) {
      console.error('Invalid Starknet address provided:', address)
      return
    }
    _setAccountAddress(address)
    setValue(address)
  }
  useEffect(() => {
    if (value) {
      if (isValidStarknetAddress(value)) {
        _setAccountAddress(value)
      } else {
        console.error('Invalid address in local storage:', value)
        removeValue()
      }
    }
  }, [])
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
  useEffect(()=>{
    if (params.address) {
      context.setAccountAddress(params.address as `0x${string}`)
    }
  },[params.address])
  
  return context
}
