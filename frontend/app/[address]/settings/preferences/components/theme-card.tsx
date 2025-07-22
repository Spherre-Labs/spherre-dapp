'use client'

import type React from 'react'

interface ThemeCardProps {
  title: string
  description: string
  icon: string | React.ReactNode
  isSelected: boolean
  onClick: () => void
  previewContent: React.ReactNode
}

export default function ThemeCard({
  title,
  description,
  isSelected,
  onClick,
  previewContent,
  icon,
}: ThemeCardProps) {
  return (
    <div className="space-y-4">
      <div
        className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg ${
          isSelected
            ? 'border-purple-500 bg-theme-tertiary shadow-purple-500/20 shadow-lg'
            : 'border-theme bg-theme-secondary hover:border-purple-400'
        }`}
        onClick={onClick}
      >
        {/* Preview Area */}
        <div className="p-4 transition-transform duration-200 w-full">
          {previewContent}
        </div>
        {/* Check Icon */}
        {isSelected && (
          <div className="absolute bottom-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      {/* Title and Description */}
      <div className="pb-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg">{icon}</span>
          <h3 className="text-theme font-medium">{title}</h3>
        </div>
        <p className="text-theme-secondary text-sm">{description}</p>
      </div>
    </div>
  )
}
