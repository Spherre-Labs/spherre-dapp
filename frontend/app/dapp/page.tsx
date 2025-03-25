'use client'

import { useState, useEffect } from 'react'
import Sidebar from '../dapp/Sidebar'
import Navbar from './Navbar'
import Members from './Members'

export default function Dapp() {
  // State to track sidebar expansion
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [selectedPage, setSelectedPage] = useState('Dashboard')

  // Listen for sidebar expansion state changes
  useEffect(() => {
    const sidebar = document.getElementById('sidebar')

    const handleSidebarHover = () => setSidebarExpanded(true)
    const handleSidebarLeave = () => setSidebarExpanded(false)

    if (sidebar) {
      sidebar.addEventListener('mouseenter', handleSidebarHover)
      sidebar.addEventListener('mouseleave', handleSidebarLeave)
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('mouseenter', handleSidebarHover)
        sidebar.removeEventListener('mouseleave', handleSidebarLeave)
      }
    }
  }, [])

  return (
    <div className="flex h-screen">
      <Sidebar onSelect={setSelectedPage} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-16'
          }`}
      >
        <Navbar title={selectedPage} />
        <main className="flex-1 overflow-auto p-4">
          {/* Dynamically render the selected page */}
          {(() => {
            switch (selectedPage) {
              case 'Dashboard':
                return <div>Dashboard Page</div> // Replace with actual Dashboard component
              case 'Trade':
                return <div>Trade Page</div> // Replace with actual Trade component
              case 'Members':
                return <Members />
              case 'Transactions':
                return <div>Transactions Page</div> // Replace with actual Transactions component
              case 'Stake':
                return <div>Stake Page</div> // Replace with actual Stake component
              case 'Treasury':
                return <div>Treasury Page</div> // Replace with actual Treasury component
              case 'Payments':
                return <div>Payments Page</div> // Replace with actual Payments component
              case 'Apps':
                return <div>Apps Page</div> // Replace with actual Apps component
              case 'Settings':
                return <div>Settings Page</div> // Replace with actual Settings component
              case 'Support':
                return <div>Support Page</div> // Replace with actual Support component
              default:
                return <div>Page Not Found</div>
            }
          })()}
        </main>
      </div>
    </div>
  )
}
