'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  isVisible: boolean
  onClose: () => void
}

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
          type === 'success'
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white'
        }`}
      >
        <span className="text-lg">{type === 'success' ? '✅' : '❌'}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  )
}
