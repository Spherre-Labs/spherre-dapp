import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import avatar from '../../public/Images/avatar.png'
import { Copy, LogOut, X } from 'lucide-react'
import { useAccount, useDisconnect } from '@starknet-react/core'
import { useRouter } from 'next/navigation'

const WalletConnected = ({ address }: { address: string }) => {
  const [panelOpen, setPanelOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { disconnect } = useDisconnect()
  const { address: walletAddress } = useAccount()
  const router = useRouter()
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
    await disconnect()
    setPanelOpen(false)
    router.push('/') // Route to connect wallet page (home)
  }

  return (
    <>
      <button
        id="wallet-panel-trigger"
        type="button"
        className="flex justify-center items-center gap-2 md:w-[188px] md:h-[50px] rounded-[50px] border-[1px] border-white bg-[#101213] font-[600] text-base text-white py-1.5 px-2.5 md:px-0 md:py-0"
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
          className="fixed top-6 right-6 z-50 w-[370px] max-w-full bg-[#18181b] rounded-2xl shadow-xl border border-[#292929] p-6 flex flex-col"
        >
          <button
            className="absolute top-4 right-4"
            onClick={() => setPanelOpen(false)}
            aria-label="Close"
          >
            <X className="text-ash" />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <Image src={avatar} alt="avatar" width={40} height={40} />
            <span className="text-lg font-semibold text-white">
              {(walletAddress || address).slice(0, 6)}...
              {(walletAddress || address).slice(-4)}
            </span>
          </div>
          <div className="flex gap-2 mb-6">
            <button
              onClick={handleCopy}
              className="p-2 rounded hover:bg-zinc-800 transition-colors"
              aria-label="Copy address"
            >
              <Copy className="w-5 h-5 text-purple-500" />
            </button>
            <button
              onClick={handleDisconnect}
              className="p-2 rounded bg-zinc-800 text-ash flex items-center gap-1"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
          <div className="text-4xl font-bold text-white mb-2">${balance}</div>
          <div className="mb-4">
            <span className="text-white font-semibold">Activity</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-700 text-xs text-white">
              0
            </span>
          </div>
          <div className="flex flex-col items-center justify-center h-40">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
              <rect width="24" height="24" rx="12" fill="#292929" />
              <path
                d="M8 17V15.5C8 14.1193 9.11929 13 10.5 13H13.5C14.8807 13 16 14.1193 16 15.5V17"
                stroke="#A78BFA"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9" r="2" stroke="#A78BFA" strokeWidth="1.5" />
            </svg>
            <p className="text-ash text-center mt-2">
              Transactions you send from the app will appear here.
            </p>
          </div>
          <button className="w-full mt-4 bg-[#6F2FCE] text-white py-2 rounded-lg font-semibold">
            Create a position
          </button>
          {copied && (
            <div className="absolute top-2 right-16 bg-purple-600 text-white px-2 py-1 rounded">
              Copied!
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default WalletConnected
