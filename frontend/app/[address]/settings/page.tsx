import { useSpherreAccount } from '@/app/context/account-context';
import { redirect } from 'next/navigation'

export default function Page() {
  // Get the current address from the hook
  const {accountAddress} = useSpherreAccount();
  redirect(`/${accountAddress}/settings/profile`)
  return null
}
