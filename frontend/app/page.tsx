'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Welcome from '../components/welcome'
import { useAuth } from './context/auth-context'

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loading, isAuthenticated, hasAccount, accounts } = useAuth()

  // useEffect(() => {
  //   if (loading) return
  //   if (!isAuthenticated) return

  //   const redirectTarget = searchParams.get('redirect')
  //   if (redirectTarget) {
  //     router.replace(redirectTarget)
  //     return
  //   }

  //   if (hasAccount && accounts.length > 0) {
  //     router.replace(`/account/${accounts[0].address}`)
  //   } else {
  //     router.replace('/create-account/step-1')
  //   }
  // }, [loading, isAuthenticated, hasAccount, accounts, router, searchParams])

  return (
    <div className="w-full">
      <Welcome />
    </div>
  )
}
