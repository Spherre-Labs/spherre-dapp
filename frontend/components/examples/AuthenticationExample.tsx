'use client'
import React from 'react'
import { useWalletAuth } from '@/app/context/wallet-auth-context'
import { useAccount } from '@starknet-react/core'
import ProtectedContent, {
  useRequireAuth,
} from '@/components/shared/ProtectedContent'
import { useTheme } from '@/app/context/theme-context-provider'
import { Lock, CheckCircle2, Settings, Shield } from 'lucide-react'

/**
 * AuthenticationExample Component
 *
 * This component demonstrates various ways to use the wallet authentication system:
 * 1. Checking authentication status
 * 2. Protecting sensitive content
 * 3. Requiring authentication before actions
 * 4. Displaying authentication state
 */
const AuthenticationExample = () => {
  const { isAuthenticated, needsAuthentication, setIsAuthModalOpen } =
    useWalletAuth()
  const { address } = useAccount()
  const { actualTheme } = useTheme()
  const { requireAuth } = useRequireAuth()

  const handleSensitiveAction = () => {
    if (!requireAuth()) {
      console.log('Authentication required - modal opened')
      return
    }

    // Proceed with sensitive action
    console.log('Executing sensitive action...')
    alert('Action executed! (This would be a real transaction in production)')
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1
          className={`text-3xl font-bold mb-2 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Wallet Authentication Example
        </h1>
        <p
          className={`text-sm ${
            actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Demonstrating the automatic wallet sign-in system
        </p>
      </div>

      {/* Status Card */}
      <div
        className={`p-6 rounded-lg border ${
          actualTheme === 'dark'
            ? 'bg-gray-900 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          <Shield className="w-6 h-6" />
          Authentication Status
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span
              className={
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }
            >
              Wallet Connected:
            </span>
            <span
              className={`font-medium flex items-center gap-2 ${
                address ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {address ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Yes
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  No
                </>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span
              className={
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }
            >
              Authenticated:
            </span>
            <span
              className={`font-medium flex items-center gap-2 ${
                isAuthenticated ? 'text-green-500' : 'text-yellow-500'
              }`}
            >
              {isAuthenticated ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Yes
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  No
                </>
              )}
            </span>
          </div>

          {address && (
            <div className="pt-3 border-t border-gray-700/50">
              <span
                className={`text-sm ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Wallet Address:
              </span>
              <div
                className={`mt-1 p-2 rounded bg-gray-800 font-mono text-sm ${
                  actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {address.slice(0, 10)}...{address.slice(-8)}
              </div>
            </div>
          )}
        </div>

        {needsAuthentication && (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Authenticate Now
          </button>
        )}
      </div>

      {/* Example 1: Protected Content */}
      <div
        className={`p-6 rounded-lg border ${
          actualTheme === 'dark'
            ? 'bg-gray-900 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Example 1: Protected Content
        </h2>

        <ProtectedContent fallbackMessage="This content contains sensitive account information. Please sign in to view.">
          <div
            className={`p-4 rounded-lg ${
              actualTheme === 'dark'
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-green-50 border border-green-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h3
                  className={`font-semibold mb-2 ${
                    actualTheme === 'dark' ? 'text-green-400' : 'text-green-700'
                  }`}
                >
                  🎉 Authenticated Content Visible
                </h3>
                <p
                  className={`text-sm ${
                    actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  This is sensitive information that only authenticated users
                  can see. You could display account balances, private settings,
                  or transaction history here.
                </p>
              </div>
            </div>
          </div>
        </ProtectedContent>
      </div>

      {/* Example 2: Conditional Action */}
      <div
        className={`p-6 rounded-lg border ${
          actualTheme === 'dark'
            ? 'bg-gray-900 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Example 2: Require Authentication for Action
        </h2>

        <p
          className={`text-sm mb-4 ${
            actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          This button requires authentication before executing sensitive
          operations. If you&apos;re not authenticated, clicking it will open
          the sign-in modal.
        </p>

        <button
          onClick={handleSensitiveAction}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            actualTheme === 'dark'
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          <Settings className="w-5 h-5" />
          Execute Sensitive Action
        </button>
      </div>

      {/* Example 3: Manual Check */}
      <div
        className={`p-6 rounded-lg border ${
          actualTheme === 'dark'
            ? 'bg-gray-900 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Example 3: Manual Authentication Check
        </h2>

        {isAuthenticated ? (
          <div
            className={`p-4 rounded-lg ${
              actualTheme === 'dark'
                ? 'bg-blue-500/10 border border-blue-500/30'
                : 'bg-blue-50 border border-blue-200'
            }`}
          >
            <p
              className={`text-sm ${
                actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-700'
              }`}
            >
              ✅ You are authenticated! You have full access to all features.
            </p>
          </div>
        ) : (
          <div
            className={`p-4 rounded-lg ${
              actualTheme === 'dark'
                ? 'bg-yellow-500/10 border border-yellow-500/30'
                : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            <p
              className={`text-sm ${
                actualTheme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
              }`}
            >
              ⚠️ Authentication required. Some features may be limited until you
              sign in.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthenticationExample
