'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import avatar from '../../public/Images/avatar.png'
import { Copy, LogOut, X, Power } from 'lucide-react'
import { useAccount, useDisconnect, useNetwork } from '@starknet-react/core'
import { useRouter } from 'next/navigation'
import { useWalletAuth } from '@/app/context/wallet-auth-context'

const WalletConnected = ({ address }: { address: string }) => {
  const [panelOpen, setPanelOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { address: walletAddress } = useAccount()
  const { disconnect } = useDisconnect()
  const { chain } = useNetwork()
  const router = useRouter()
  const { logout, isAuthenticated, setIsAuthModalOpen } = useWalletAuth()

  // Close panel on outside click or ESC
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        panelOpen &&
        !(
          event.target instanceof Node &&
          document.getElementById('wallet-panel')?.contains(event.target)
        ) &&
        !(
          event.target instanceof Node &&
          document
            .getElementById('wallet-panel-trigger')
            ?.contains(event.target)
        )
      ) {
        setPanelOpen(false)
      }
    }
    function handleEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') setPanelOpen(false)
    }
    if (panelOpen) {
      document.addEventListener('mousedown', handleClick)
      document.addEventListener('keydown', handleEsc)
    }
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [panelOpen])

  // Only show if connected
  if (!walletAddress && !address) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress || address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  const handleDisconnect = async () => {
    disconnect()
    setPanelOpen(false)
    router.push('/')
  }

  const handleLogout = () => {
    logout()
    setPanelOpen(false)
  }

  return (
    <>
      <button
        id="wallet-panel-trigger"
        type="button"
        className="flex justify-center items-center gap-2 md:w-[188px] md:h-[50px] rounded-[50px] border border-theme-border bg-theme-bg-secondary font-[600] text-base text-theme py-1.5 px-2.5 md:px-0 md:py-0 hover:bg-theme-bg-tertiary transition-colors duration-200"
        onClick={() => setPanelOpen(true)}
      >
        <Image
          src={avatar}
          alt="avatar"
          width={36}
          height={36}
          quality={100}
          priority
        />
        <span className="text-sm md:text-base">
          {(walletAddress || address).slice(0, 6)}...
          {(walletAddress || address).slice(-4)}
        </span>
      </button>
      {panelOpen && (
        <div
          id="wallet-panel"
          className="fixed top-6 right-6 z-50 w-[370px] max-w-full bg-theme-bg-secondary rounded-2xl shadow-xl border border-theme-border p-6 flex flex-col transition-colors duration-300"
        >
          <button
            className="absolute top-4 right-4 p-1 rounded hover:bg-theme-bg-tertiary transition-colors duration-200"
            onClick={() => setPanelOpen(false)}
            aria-label="Close"
          >
            <X className="text-theme-secondary hover:text-theme transition-colors duration-200" />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <Image src={avatar} alt="avatar" width={40} height={40} />
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-theme transition-colors duration-300">
                {(walletAddress || address).slice(0, 6)}...
                {(walletAddress || address).slice(-4)}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-theme-secondary">Network:</span>
                <span className="text-xs text-theme">
                  {chain?.name ?? 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="mb-4">
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded hover:bg-theme-bg-tertiary transition-colors duration-200"
                  aria-label="Copy address"
                >
                  <Copy className="w-5 h-5 text-primary" />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 p-2 rounded bg-theme-bg-tertiary border border-theme-border text-theme-secondary hover:bg-theme-bg-secondary hover:text-theme flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded hover:bg-theme-bg-tertiary transition-colors duration-200"
                  aria-label="Copy address"
                >
                  <Copy className="w-5 h-5 text-primary" />
                </button>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex-1 p-2 rounded bg-primary text-white hover:opacity-90 transition-all duration-200"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          <div className="mt-auto flex justify-between gap-2">
            <button
              onClick={handleDisconnect}
              className="flex-1 p-2 rounded border border-theme-border text-theme-secondary hover:bg-theme-bg-tertiary transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Power className="w-5 h-5" />
              Disconnect Wallet
            </button>
          </div>

          {copied && (
            <div className="absolute top-2 right-16 bg-primary text-white px-2 py-1 rounded shadow-lg">
              Copied!
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default WalletConnected
