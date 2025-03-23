"use client";
import React, { useState } from 'react';
import TokenVaults from './TokenVaults';
import NFTVaults from './NFTVaults';

import './dashboard.css';

const Dashboard = () => {
    const [view, setView] = useState('tokens'); 

    const handleViewChange = (newView: string) => {
        setView(newView);
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={() => handleViewChange('tokens')}>Token Vaults</button>
            <button onClick={() => handleViewChange('nfts')}>NFT Vaults</button>

            <div className="transition-container">
                {view === 'tokens' ? <TokenVaults /> : <NFTVaults />}
            </div>
        </div>
    );
};

export default Dashboard;
