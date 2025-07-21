'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useAccount } from '@starknet-react/core'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { TOKEN_ADDRESSES } from '@/lib/contracts/token-contracts'
import { getERC20ContractConfig } from '@/lib/contracts/erc20-contracts'
import { useScaffoldWriteContract } from '@/hooks/useScaffoldWriteContract'
import { HiMiniArrowPath } from 'react-icons/hi2'
import { useSpherreAccount } from '@/app/context/account-context'
import { useGlobalModal } from '../../../../components/modals/useGlobalModal'

interface TokenInfo {
  symbol: string
  name: string
  address: string
  decimals: number
  balance: number
  icon?: string
}

const DappDeposit = () => {
  const { address: userAddress } = useAccount()
  const { accountAddress: spherreAccountAddress } = useSpherreAccount()
  const { showProcessing, showSuccess, showError, hideModal } = useGlobalModal()

  const [selectedToken, setSelectedToken] = useState<string>('STRK')
  const [amount, setAmount] = useState<string>('')
  const [error, setError] = useState<string>('')

  // Get balances for all tokens
  const { balance: strkBalance } = useTokenBalance(
    TOKEN_ADDRESSES.STRK as `0x${string}`,
    userAddress,
  )
  const { balance: ethBalance } = useTokenBalance(
    TOKEN_ADDRESSES.ETH as `0x${string}`,
    userAddress,
  )
  const { balance: usdcBalance } = useTokenBalance(
    TOKEN_ADDRESSES.USDC as `0x${string}`,
    userAddress,
  )

  // Available tokens with balances > 0
  const availableTokens: TokenInfo[] = [
    {
      symbol: 'STRK',
      name: 'StarkNet Token',
      address: TOKEN_ADDRESSES.STRK,
      decimals: 18,
      balance: strkBalance,
      icon: '/Images/starknet.svg',
    },
    {
      symbol: 'ETH',
      name: 'Ether',
      address: TOKEN_ADDRESSES.ETH,
      decimals: 18,
      balance: ethBalance,
      icon: '/Images/eth.svg',
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: TOKEN_ADDRESSES.USDC,
      decimals: 6,
      balance: usdcBalance,
      icon: '/Images/usdc.svg',
    },
  ].filter((token) => token.balance > 0)

  // Get selected token address
  const getSelectedTokenAddress = () => {
    switch (selectedToken) {
      case 'STRK':
        return TOKEN_ADDRESSES.STRK
      case 'ETH':
        return TOKEN_ADDRESSES.ETH
      case 'USDC':
        return TOKEN_ADDRESSES.USDC
      default:
        return TOKEN_ADDRESSES.STRK
    }
  }

  // Transfer hook using useScaffoldWriteContract
  const { writeAsync: transferAsync, isLoading: isTransferLoading } =
    useScaffoldWriteContract({
      contractConfig: getERC20ContractConfig(getSelectedTokenAddress()),
      functionName: 'transfer',
      onSuccess: (result) => {
        console.log('✅ Transfer successful:', result)
        hideModal()
        setAmount('')
      },
      onError: (error) => {
        console.error('❌ Transfer error:', error)
        setError(error.message)
        hideModal()
      },
    })

  const selectedTokenInfo = availableTokens.find(
    (token) => token.symbol === selectedToken,
  )

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
      setError('')
    }
  }

  const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(e.target.value)
    setAmount('')
    setError('')
  }

  const validateAmount = (): boolean => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return false
    }

    if (selectedTokenInfo && parseFloat(amount) > selectedTokenInfo.balance) {
      setError('Insufficient balance')
      return false
    }

    return true
  }

  const handleDeposit = async () => {
    if (!validateAmount()) return

    // Check wallet connection first
    if (!userAddress) {
      setError('Please connect your wallet first')
      return
    }

    setError('')
    showProcessing({
      title: 'Processing Transaction!',
      subtitle: 'Please exercise a little patience as we process your details',
    })

    try {
      const amountInWei = BigInt(
        parseFloat(amount) * Math.pow(10, selectedTokenInfo?.decimals || 18),
      )

      console.log('🔍 Transfer Debug Info:')
      console.log('User Address:', userAddress)
      console.log('Spherre Account Address:', spherreAccountAddress)
      console.log('Token Address:', getSelectedTokenAddress())
      console.log('Amount:', amount)
      console.log('Amount in Wei:', amountInWei.toString())
      console.log('Selected Token Info:', selectedTokenInfo)

      // Check if user has sufficient balance
      if (selectedTokenInfo && parseFloat(amount) > selectedTokenInfo.balance) {
        throw new Error('Insufficient balance for deposit')
      }

      // Execute transfer
      await transferAsync({
        recipient: spherreAccountAddress,
        amount: amountInWei,
      })

      hideModal()
      setAmount('')
      showSuccess({
        title: 'Successful Transaction!',
        message:
          'Deposit completed successfully! Your tokens have been transferred to the Spherre Treasury.',
      })
    } catch (err) {
      hideModal()
      let errorMessage = 'Deposit failed'

      if (err instanceof Error) {
        const msg = err.message.toLowerCase()

        if (
          msg.includes('user rejected') ||
          msg.includes('user denied') ||
          msg.includes('user cancelled')
        ) {
          errorMessage =
            'Transaction was rejected by user. Please check your wallet and try again.'
        } else if (
          msg.includes('insufficient funds') ||
          msg.includes('insufficient balance')
        ) {
          errorMessage = 'Insufficient funds to complete deposit'
        } else if (msg.includes('network') || msg.includes('fetch')) {
          errorMessage =
            'Network error: Please check your connection and try again'
        } else if (msg.includes('nonce')) {
          errorMessage = 'Nonce error: Please try again'
        } else if (msg.includes('contract not found')) {
          errorMessage = 'Contract not found: Please check the token address'
        } else {
          errorMessage = `Deposit failed: ${err.message}`
        }
      }

      setError(errorMessage)
      showError({
        title: 'Deposit Failed',
        errorText: errorMessage,
      })
    }
  }

  const isLoading = isTransferLoading

  // Show error if no wallet connected
  if (!userAddress) {
    return (
      <div className="flex-col items-start flex justify-center w-full">
        <div className="w-full p-6 bg-yellow-900/20 border border-yellow-500/30 rounded-[7px]">
          <p className="text-yellow-400 text-center">
            Please connect your wallet first to deposit tokens.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-col items-start flex justify-center w-full">
      <p className="pb-5 text-[14px] text-[#8E9BAE]">Dapp Deposit</p>

      {/* Account Info */}
      <div className="relative w-full flex px-5 justify-between h-[98px] mb-10 bg-[#0a0a0a] rounded-[10px]">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="10"
            ry="10"
            fill="none"
            stroke="#6F2FCE"
            strokeWidth="1"
            strokeDasharray="7, 10"
          />
        </svg>

        <div className="flex gap-3">
          <Image
            src={'/depositAddy.svg'}
            alt="Spherre account"
            height={50}
            width={50}
            className="rounded-full"
          />
          <div className="flex justify-between flex-col py-5">
            <p className="font-bold text-white">Spherre Treasury</p>
            <p className="font-medium text-[#8E9BAE]">0xcaaf...788</p>
          </div>
        </div>

        <div className="flex justify-between flex-col h-full">
          <p className="pt-[8px]">
            <span className="font-medium text-[14px] text-[#8E9BAE]">
              Your Balance:{' '}
            </span>{' '}
            <span className="font-semibold text-[25px] text-white">
              {selectedTokenInfo?.balance.toFixed(4) || '0.0000'}
            </span>{' '}
            <span className="font-normal text-[20px] text-[#8E9BAE]">
              {selectedToken}
            </span>
          </p>
          <p className="text-right pb-[25px]">
            {' '}
            <span className="font-medium text-[14px] text-[#8E9BAE]">
              Deposit to:
            </span>{' '}
            <span className="font-semibold text-[16px] text-white">
              Treasury
            </span>{' '}
          </p>
        </div>
      </div>

      {/* Token Selection */}
      <div className="w-full mb-6">
        <label className="block text-[14px] text-[#8E9BAE] mb-2">
          Select Token
        </label>
        <select
          value={selectedToken}
          onChange={handleTokenChange}
          className="w-full h-[50px] bg-[#1C1D1F] border border-[#272729] rounded-[7px] px-4 text-white focus:outline-none focus:border-[#6F2FCE] transition-colors duration-200"
          disabled={isLoading}
        >
          {availableTokens.map((token) => (
            <option key={token.symbol} value={token.symbol}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>

      {/* Amount Input */}
      <div className="w-full mb-6">
        <label className="block text-[14px] text-[#8E9BAE] mb-2">
          Amount to Deposit
        </label>
        <div className="relative">
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="w-full h-[50px] bg-[#1C1D1F] border border-[#272729] rounded-[7px] px-4 text-white text-[20px] font-semibold focus:outline-none focus:border-[#6F2FCE] transition-colors duration-200"
            disabled={isLoading}
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#8E9BAE] text-sm">
            {selectedToken}
          </div>
        </div>
        {selectedTokenInfo && (
          <p className="text-[12px] text-[#8E9BAE] mt-1">
            Available: {selectedTokenInfo.balance.toFixed(6)} {selectedToken}
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-[7px]">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        <button
          onClick={handleDeposit}
          disabled={isTransferLoading || !amount || parseFloat(amount) <= 0}
          className="w-full h-[50px] rounded-[7px] bg-[#6F2FCE] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isTransferLoading ? (
            <div className="flex items-center justify-center gap-2">
              <HiMiniArrowPath className="animate-spin" size={20} />
              Processing...
            </div>
          ) : (
            `Deposit ${selectedToken} to Treasury`
          )}
        </button>
      </div>
    </div>
  )
}

export default DappDeposit
