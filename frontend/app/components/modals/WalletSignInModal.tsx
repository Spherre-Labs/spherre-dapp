'use client'
import React, { useState } from 'react'
import { useAccount } from '@starknet-react/core'
import { useWalletAuth } from '@/app/context/wallet-auth-context'
import { SpherreApi } from '@/lib/api/spherre-api'
import { apiClient } from '@/lib/api/client'
import { X, Loader2, Shield, CheckCircle2 } from 'lucide-react'

const WalletSignInModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authenticate } = useWalletAuth()
  const { address, account } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleClose = () => {
    if (!isLoading) {
      setIsAuthModalOpen(false)
      setError(null)
    }
  }

  const handleSignIn = async () => {
    if (!account || !address) {
      setError('Wallet not connected')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Get the public key from the account
      // @ts-expect-error - Accessing signer from account

      // Create typed data matching backend's expected format
      const typedDataMessage = {
        domain: {
          name: 'Spherre',
          version: '1',
          chainId: 'SN_SEPOLIA',
        },
        types: {
          StarkNetDomain: [
            { name: 'name', type: 'felt' },
            { name: 'chainId', type: 'felt' },
            { name: 'version', type: 'felt' },
          ],
          Message: [{ name: 'agreement', type: 'felt' }],
        },
        primaryType: 'Message',
        message: {
          agreement: 'i agree to signin to spherre',
        },
      }

      // Request signature from wallet
      const signature = await account.signMessage(typedDataMessage)

      if (!signature) {
        throw new Error('Invalid signature format')
      }

      const publicKey = await account.signer.getPubKey()

      if (!publicKey) {
        throw new Error('Could not retrieve public key from wallet')
      }

      const mainSignatures = [signature[-2], signature[-1]]

      // Convert signature to numbers for backend
      const signatures = mainSignatures.map((sig: string | bigint) =>
        typeof sig === 'string' ? parseInt(sig, 16) : Number(sig),
      )
      console.log('Signature length: ', signature.length)
      console.log('Signature', signatures)
      console.log('Public Key', publicKey)
      // Send to backend for authentication
      const response = await SpherreApi.signIn({
        signatures,
        public_key: publicKey,
      })

      // Store JWT tokens
      if (response.token) {
        apiClient.setAuthToken(response.token)

        // Store tokens in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.token)
          localStorage.setItem('refresh_token', response.refresh_token)
          localStorage.setItem('member_address', response.member)
        }
      }

      // Show success state
      setSuccess(true)

      // Wait a moment to show success message
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mark as authenticated
      authenticate()
    } catch (err) {
      console.error('Sign-in error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      if (
        errorMessage.includes('User rejected') ||
        errorMessage.includes('rejected')
      ) {
        setError('Signature request was rejected. Please try again.')
      } else if (errorMessage.includes('Invalid signatures')) {
        setError('Signature verification failed. Please try again.')
      } else {
        setError(errorMessage || 'Failed to sign in. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 rounded-2xl shadow-lg bg-theme-bg-secondary transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-theme-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-theme transition-colors duration-300">
              Sign In with Wallet
            </h2>
          </div>
          {!isLoading && (
            <button
              onClick={handleClose}
              className="bg-theme-bg-tertiary rounded-full p-2 hover:bg-theme-bg-secondary focus:outline-none transition-colors duration-300"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-theme-secondary" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info Box */}
          <div className="p-4 rounded-lg border bg-primary/10 border-primary/30">
            <p className="text-sm leading-relaxed text-theme-secondary transition-colors duration-300">
              To access your personalized settings and sensitive information,
              please verify your wallet ownership by signing a message. This
              action is free and does not perform any blockchain transactions.
            </p>
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-theme-secondary transition-colors duration-300">
              Wallet Address
            </label>
            <div className="p-3 rounded-lg font-mono text-sm break-all bg-theme-bg-tertiary text-theme transition-colors duration-300">
              {address
                ? `${address.slice(0, 10)}...${address.slice(-8)}`
                : 'Not connected'}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-400">
                Wallet verified successfully!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg font-medium transition-colors bg-theme-bg-tertiary text-theme hover:bg-theme-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSignIn}
              disabled={isLoading || success}
              className="flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Verified</span>
                </>
              ) : (
                <span>Sign Message</span>
              )}
            </button>
          </div>

          {/* Security Note */}
          <div className="pt-4 border-t border-theme-border">
            <p className="text-xs text-center text-theme-secondary transition-colors duration-300">
              🔒 This signature is secure and does not access your funds
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletSignInModal
