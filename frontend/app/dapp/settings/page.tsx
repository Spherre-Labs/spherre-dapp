"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to profile settings by default
    router.replace("/dapp/settings/profile")
  }, [router])

  return null
}
