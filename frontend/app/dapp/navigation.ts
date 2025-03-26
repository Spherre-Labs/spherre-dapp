// Define the mapping between routes and page names
import {StaticImageData} from "next/image";

export const routeToPageMap = {
  '/dapp/': 'Dashboard',
  '/dapp/trade': 'Trade',
  '/dapp/members': 'Members',
  '/dapp/transactions': 'Transactions',
  '/dapp/stake': 'Stake',
  '/dapp/treasury': 'Treasury',
  '/dapp/payments': 'Payments',
  '/dapp/apps': 'Apps',
  '/dapp/settings': 'Settings',
  '/dapp/support': 'Support',
};

export type PageName = keyof typeof routeToPageMap;

// Function to get the page name from the current path
export const getSelectedPage = (pathname: string): string => {
  // Find the matching route
  const route = Object.keys(routeToPageMap).find(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Return the page name or default to Dashboard
  return route ? routeToPageMap[route as keyof typeof routeToPageMap] : 'Dashboard';
};

// Function to check if a route is active
export const isActiveRoute = (pathname: string, route: string): boolean => {
  if (route === '/dapp/') {
    // Special case for dashboard to avoid matching all routes
    return pathname === '/dapp/' || pathname === '/dapp';
  }
  return pathname === route || pathname.startsWith(`${route}/`);
};

export interface NavItem {
  name: string
  route?: string
  icon: StaticImageData
  comingSoon?: boolean
  notification?: number
}
