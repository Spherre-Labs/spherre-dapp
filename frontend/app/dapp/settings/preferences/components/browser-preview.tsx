'use client'

interface BrowserPreviewProps {
  theme: 'dark' | 'light' | 'system'
}

export default function BrowserPreview({ theme }: BrowserPreviewProps) {
  const isDark = theme === 'dark' || (theme === 'system' && true)
  const isLight = theme === 'light'

  return (
    <div
      className={`rounded-lg overflow-hidden ${isDark ? 'bg-gray-900' : isLight ? 'bg-white' : 'bg-gray-800'}`}
    >
      {/* Browser Header */}
      <div
        className={`flex items-center px-3 py-2 ${isDark ? 'bg-gray-800' : isLight ? 'bg-gray-100' : 'bg-gray-700'}`}
      >
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
        <div
          className={`flex-1 mx-3 px-2 py-1 rounded text-xs ${
            isDark
              ? 'bg-gray-700 text-gray-300'
              : isLight
                ? 'bg-white text-gray-600'
                : 'bg-gray-600 text-gray-300'
          }`}
        >
          🔒 spherre.com
        </div>
      </div>

      {/* Browser Content */}
      <div
        className={`p-3 h-32 ${isDark ? 'bg-gray-900' : isLight ? 'bg-white' : 'bg-gray-800'}`}
      >
        <div
          className={`w-8 h-8 rounded mb-2 ${
            theme === 'dark'
              ? 'bg-purple-500'
              : theme === 'light'
                ? 'bg-purple-500'
                : 'bg-green-500'
          }`}
        ></div>

        {isLight ? (
          <div className="space-y-1">
            <div className="h-2 bg-gray-300 rounded w-3/4"></div>
            <div className="h-2 bg-gray-300 rounded w-1/2"></div>
            <div className="h-2 bg-gray-300 rounded w-2/3"></div>
          </div>
        ) : (
          <div className="space-y-1">
            <div
              className={`h-2 rounded w-3/4 ${isDark ? 'bg-gray-700' : 'bg-gray-600'}`}
            ></div>
            <div
              className={`h-2 rounded w-1/2 ${isDark ? 'bg-gray-700' : 'bg-gray-600'}`}
            ></div>
            <div
              className={`h-2 rounded w-2/3 ${isDark ? 'bg-gray-700' : 'bg-gray-600'}`}
            ></div>
          </div>
        )}
      </div>
    </div>
  )
}
