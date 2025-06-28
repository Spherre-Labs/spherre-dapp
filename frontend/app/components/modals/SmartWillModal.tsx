'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'

interface SmartWillModalProps {
  setIsModalOpen: (isOpen: boolean) => void
}

export default function SmartWillModal({
  setIsModalOpen,
}: SmartWillModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [setIsModalOpen])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative bg-[#1C1D1F] border border-[#292929] rounded-lg shadow-lg w-full max-w-xl px-4 sm:px-6 md:px-8 py-8">
        <button
          className="absolute top-4 right-4 z-10 p-1 rounded-full bg-gray-800/50 hover:bg-gray-800/70"
          onClick={() => setIsModalOpen(false)}
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-[#8E9BAE]" />
        </button>

        <div className="relative w-full max-w-md h-[160px] mx-auto">
          <Image
            src="/left-purple-file.svg"
            alt="Left Purple File"
            width={70}
            height={70}
            className="absolute left-0 top-[100%] -translate-y-1/2"
          />
          <Image
            src="/left-white-paper.svg"
            alt="Left White Paper"
            width={70}
            height={70}
            className="absolute left-[10%] top-[50%] -translate-y-1/2"
          />
          <Image
            src="/top-left-paper.svg"
            alt="Top Left Paper"
            width={70}
            height={70}
            className="absolute left-[28%] top-0"
          />
          <Image
            src="/top-right-paper.svg"
            alt="Top Right Paper"
            width={70}
            height={70}
            className="absolute right-[28%] top-0"
          />
          <Image
            src="/right-white-paper.svg"
            alt="Right White Paper"
            width={70}
            height={70}
            className="absolute right-[10%] top-[50%] -translate-y-1/2"
          />
          <Image
            src="/right-purple-file.svg"
            alt="Right Purple File"
            width={70}
            height={70}
            className="absolute right-0 top-[100%] -translate-y-1/2"
          />
          <Image
            src="/spherre-logo-rounded.svg"
            alt="Spherre Logo"
            width={100}
            height={100}
            className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 z-10"
          />
        </div>

        <div className="mt-16 text-center">
          <h2
            id="modal-title"
            className="text-xl sm:text-2xl font-bold text-white mb-2"
          >
            SmartWill
          </h2>
          <p className="max-sm:text-xs text-sm text-gray-400 mb-4">
            Welcome to Spherre’s smartwill feature which is a feature that
            allows you to automatically transfer permissions from a primary
            wallet to a backup wallet in case of loss, compromise, or long
            inactivity. When a wallet is added as a primary member of the
            multisig account, you can also assign a backup wallet. Once the
            backup wallet is added, a 30-day countdown starts. If you do not
            manually reset the countdown before it ends, the system will
            automatically transfer all permissions from the primary to the
            backup wallet. After this automatic transfer, the primary wallet
            becomes disabled. You will receive reminders starting 5 days before
            the countdown ends to reset the timer if they are still active. The
            change can be reversed through a multisig transaction, meaning other
            members must approve the reversal.
          </p>
          <button
            className="bg-[#6F2FCE] hover:bg-[#5B28B8] w-full text-white px-6 py-2 rounded-md font-medium transition-all duration-200"
            onClick={() => setIsModalOpen(false)}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}
