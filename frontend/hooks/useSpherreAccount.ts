import { useAccount } from '@starknet-react/core'
import { useState, useEffect } from 'react'

export const useSpherreAccount = () => {
  const { address: userAddress } = useAccount()
  const [accountAddress, setAccountAddress] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchUserAccount = async () => {
      if (!userAddress) {
        setAccountAddress('')
        return
      }

      setIsLoading(true)
      setError('')

      try {
        // For now, use a hardcoded address. In the future, this should fetch from the API
        // const accounts = await SpherreApi.getAccounts(userAddress)
        // const primaryAccount = accounts.find(account => account.isPrimary) || accounts[0]
        // setAccountAddress(primaryAccount?.address || '')

        // Temporary hardcoded address for development
        setAccountAddress(
          '0x04744C1e1455eA6261390e0f46aBa99803169fAcfF5FAc2Cfb8390bD81A31972',
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch account')
        setAccountAddress('')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAccount()
  }, [userAddress])

  return {
    accountAddress,
    isLoading,
    error,
    userAddress,
  }
}
