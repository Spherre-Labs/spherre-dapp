// Define the mapping between routes and page names
import { StaticImageData } from 'next/image'

export const routeToPageMap = (address: string) => ({
  [`/account/${address}/`]: 'Dashboard',
  [`/account/${address}/trade`]: 'Trade',
  [`/account/${address}/members`]: 'Members',
  [`/account/${address}/transactions`]: 'Transactions',
  [`/account/${address}/stake`]: 'Stake',
  [`/account/${address}/smart-will`]: 'Smart Will',
  [`/account/${address}/treasury`]: 'Treasury',
  [`/account/${address}/payments`]: 'Payments',
  [`/account/${address}/apps`]: 'Apps',
  [`/account/${address}/settings`]: 'Settings',
  [`/account/${address}/support`]: 'Support',
  [`/account/${address}/smart`]: 'Smart Lock',
})

export type PageName = keyof typeof routeToPageMap

// Function to get the page name from the current path
export const getSelectedPage = (pathname: string, address: string): string => {
  // Find the matching route
  const route = Object.keys(routeToPageMap(address)).find(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )

  // Return the page name or default to Dashboard
  return route
    ? routeToPageMap(address)[route as keyof typeof routeToPageMap]
    : 'Dashboard'
}

export interface NavItem {
  name: string
  route?: string
  icon: StaticImageData
  comingSoon?: boolean
  notification?: number
}
