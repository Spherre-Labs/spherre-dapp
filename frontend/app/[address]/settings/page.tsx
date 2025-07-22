import { redirect } from 'next/navigation'

export default function Page() {
  redirect('/dapp/settings/profile')
  return null
}
