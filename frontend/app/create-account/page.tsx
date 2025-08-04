'use client'

import { useSpherreAccount } from '@/app/context/account-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  // Get the current address from the hook
  const { accountAddress } = useSpherreAccount()
  const router = useRouter()

  useEffect(() => {
    if (accountAddress) {
      router.push('/create-account/step-1')
    }
  }, [accountAddress, router])

  return null
}