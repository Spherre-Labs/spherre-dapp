'use client'

import type React from 'react'
import { sepolia } from '@starknet-react/chains'
import {
  StarknetConfig,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
  jsonRpcProvider,
} from '@starknet-react/core'

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos()],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: 'onlyIfNoConnectors',
    // Randomize the order of the connectors.
    order: 'random',
  })

  // FIXED: Force Sepolia testnet only since that's where your contracts are deployed
  function rpcProvider() {
    return jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === sepolia.id) {
          return {
            nodeUrl: process.env.NEXT_PUBLIC_RPC_URL,
          }
        }
        // Don't provide mainnet RPC to force Sepolia usage
        return null
      },
    })
  }

  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={rpcProvider()}
      connectors={connectors}
      explorer={voyager}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  )
}
