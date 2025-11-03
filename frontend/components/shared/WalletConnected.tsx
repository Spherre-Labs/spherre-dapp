'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import avatar from '../../public/Images/avatar.png'
import { Copy, LogOut, X } from 'lucide-react'
import { useAccount } from '@starknet-react/core'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/app/context/theme-context-provider'
import { useWalletAuth } from '@/app/context/wallet-auth-context'

const WalletConnected = ({ address }: { address: string }) => {
  const { actualTheme } = useTheme()
  const [panelOpen, setPanelOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { address: walletAddress } = useAccount()
  const router = useRouter()
  const { logout } = useWalletAuth()
  // Dummy balance for now
  const balance = '0.00'

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
    // Use the auth context logout to clear all auth state
    logout()
    setPanelOpen(false)
    router.push('/') // Route to connect wallet page (home)
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
            <span className="text-lg font-semibold text-theme transition-colors duration-300">
              {(walletAddress || address).slice(0, 6)}...
              {(walletAddress || address).slice(-4)}
            </span>
          </div>
          <div className="flex gap-2 mb-6">
            <button
              onClick={handleCopy}
              className="p-2 rounded hover:bg-theme-bg-tertiary transition-colors duration-200"
              aria-label="Copy address"
            >
              <Copy className="w-5 h-5 text-primary" />
            </button>
            <button
              onClick={handleDisconnect}
              className="p-2 rounded bg-theme-bg-tertiary border border-theme-border text-theme-secondary hover:bg-theme-bg-secondary hover:text-theme flex items-center gap-1 transition-colors duration-200"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
          <div className="text-4xl font-bold text-theme mb-2 transition-colors duration-300">
            ${balance}
          </div>
          <div className="mb-4">
            <span className="text-theme font-semibold transition-colors duration-300">
              Activity
            </span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-xs text-white">
              0
            </span>
          </div>
          <div className="flex flex-col items-center justify-center h-40">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
              <rect
                width="24"
                height="24"
                rx="12"
                fill={actualTheme === 'dark' ? '#292929' : '#e2e8f0'}
              />
              <path
                d="M8 17V15.5C8 14.1193 9.11929 13 10.5 13H13.5C14.8807 13 16 14.1193 16 15.5V17"
                stroke="#A78BFA"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9" r="2" stroke="#A78BFA" strokeWidth="1.5" />
            </svg>
            <p className="text-theme-secondary text-center mt-2 transition-colors duration-300">
              Transactions you send from the app will appear here.
            </p>
          </div>
          <button className="w-full mt-4 bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-all duration-200">
            Create a position
          </button>
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
