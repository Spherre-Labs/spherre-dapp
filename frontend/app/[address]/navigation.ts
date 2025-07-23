// Define the mapping between routes and page names
import { StaticImageData } from 'next/image'

export const routeToPageMap = (address: string) => ({
  [`/${address}/`]: 'Dashboard',
  [`/${address}/trade`]: 'Trade',
  [`/${address}/members`]: 'Members',
  [`/${address}/transactions`]: 'Transactions',
  [`/${address}/stake`]: 'Stake',
  [`/${address}/smart-will`]: 'Smart Will',
  [`/${address}/treasury`]: 'Treasury',
  [`/${address}/payments`]: 'Payments',
  [`/${address}/apps`]: 'Apps',
  [`/${address}/settings`]: 'Settings',
  [`/${address}/support`]: 'Support',
  [`/${address}/smart`]: 'Smart Lock',
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
