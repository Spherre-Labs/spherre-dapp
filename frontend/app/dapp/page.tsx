"use client"

import { useState, useEffect } from 'react';
import Sidebar from '../dapp/Sidebar';
import Navbar from './Navbar';

export default function Dapp() {
    // State to track sidebar expansion
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    // Listen for sidebar expansion state changes
    useEffect(() => {
        const sidebar = document.getElementById('sidebar');
        
        const handleSidebarHover = () => setSidebarExpanded(true);
        const handleSidebarLeave = () => setSidebarExpanded(false);

        if (sidebar) {
            sidebar.addEventListener('mouseenter', handleSidebarHover);
            sidebar.addEventListener('mouseleave', handleSidebarLeave);
        }

        return () => {
            if (sidebar) {
                sidebar.removeEventListener('mouseenter', handleSidebarHover);
                sidebar.removeEventListener('mouseleave', handleSidebarLeave);
            }
        };
    }, []);

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div 
                className={`flex-1 flex flex-col transition-all duration-300 ${
                    sidebarExpanded ? 'ml-64' : 'ml-16'
                }`}
            >
                <Navbar title={'Dashboard'} />
                <main className="flex-1 overflow-auto p-4">
                    {/* Your page content goes here */}
                </main>
            </div>
        </div>
    );
}