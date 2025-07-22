"use client"
import React, { useState } from 'react'
import TreasuryHeader from './components/treasury-header'
import TreasuryStatscard from './components/treasury-statscard'
import TreasuryPortfoliochat from './components/treasury-portfoliochat'
import TreasuryTable from './components/treasury-table' 

const TreasuryPage = () => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('1Y');
  
  const toggleBalance = () => setIsBalanceVisible(!isBalanceVisible);
  const tokenHoldings = [
  { symbol: 'STRK', price: '$0.46', balance: '5', value: '$460.43', percentage: 100, logo: '/starknet.png' },
  { symbol: 'STRK', price: '$0.46', balance: '2', value: '$700.20', percentage: 25, logo: '/starknet.png' },
  { symbol: 'ETH', price: '$1,800.00', balance: '0.23', value: '$414.00', percentage: 15, logo: '/Eth.png' },
];

  const portfolioData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Tokens',
        data: [8, 7, 6, 10, 5, 4, 4, 3, 3, 4, 4, 3],
        backgroundColor: '#8b5cf6',
        borderRadius: 4,
        barThickness: 16,
      },
      {
        label: 'NFTs',
        data: [4, 5, 3, 6, 5, 4, 3, 3, 3, 4, 5, 2],
        backgroundColor: '#ec4899',
        borderRadius: 4,
        barThickness: 16,
      }
    ],
  };
  return (
    <div className="p-4 bg-theme-bg-secondary rounded-lg">
       <TreasuryHeader
         balance="250.35"
         isBalanceVisible={isBalanceVisible}
         toggleBalance={toggleBalance}
       />
       <TreasuryStatscard
          totalTokens={5}
          totalStakes={0}
          totalNFTs={12}
       />

       <TreasuryPortfoliochat
        data={portfolioData}
        onPeriodChange={setSelectedPeriod}
       />

       <TreasuryTable
        tokens={tokenHoldings}
       />
    </div>
  )
}

export default TreasuryPage
