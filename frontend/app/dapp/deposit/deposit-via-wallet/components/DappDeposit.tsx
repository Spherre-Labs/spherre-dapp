'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useAccount } from '@starknet-react/core'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { TOKEN_ADDRESSES } from '@/lib/contracts/token-contracts'
import { getERC20ContractConfig } from '@/lib/contracts/erc20-contracts'
import { useMulticall } from '@/hooks/useMulticall'
import { HiMiniArrowPath, HiMiniCheckCircle } from 'react-icons/hi2'
import { SPHERRE_CONTRACTS } from '@/lib/contracts/spherre-contracts'

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
  // const spherreAccountAddress = SPHERRE_CONTRACTS.SPHERRE_ACCOUNT
  const spherreAccountAddress =
    '0x04744C1e1455eA6261390e0f46aBa99803169fAcfF5FAc2Cfb8390bD81A31972'

  const [selectedToken, setSelectedToken] = useState<string>('STRK')
  const [amount, setAmount] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<
    'none' | 'processing' | 'completed'
  >('none')
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

  // Multicall hook for approve + transfer
  const { writeAsync: executeMulticall, isLoading: isMulticallLoading } =
    useMulticall({
      onSuccess: (result) => {
        console.log('✅ Multicall successful:', result)
        setProcessingStatus('completed')
        setAmount('')
      },
      onError: (error) => {
        console.error('❌ Multicall error:', error)
        setError(error.message)
        setProcessingStatus('none')
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
    setProcessingStatus('none')
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

    setIsProcessing(true)
    setProcessingStatus('processing')
    setError('')

    try {
      const amountInWei = BigInt(
        parseFloat(amount) * Math.pow(10, selectedTokenInfo?.decimals || 18),
      )

      console.log('🔍 Multicall Debug Info:')
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

      // Create multicall with approve + transfer using contract configs
      const tokenContractConfig = getERC20ContractConfig(
        getSelectedTokenAddress(),
      )

      const multicallCalls = [
        {
          contractConfig: tokenContractConfig,
          functionName: 'approve',
          args: {
            spender: spherreAccountAddress,
            amount: amountInWei,
          },
        },
        {
          contractConfig: tokenContractConfig,
          functionName: 'transfer',
          args: {
            recipient: spherreAccountAddress,
            amount: amountInWei,
          },
        },
      ]

      console.log('📋 Multicall calls:', multicallCalls)

      const result = await executeMulticall(multicallCalls)

      console.log('✅ Multicall successful:', result)
      setProcessingStatus('completed')
      setAmount('')
    } catch (err) {
      console.error('❌ Multicall error:', err)

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
      setProcessingStatus('none')
    } finally {
      setIsProcessing(false)
    }
  }

  const isLoading = isMulticallLoading || isProcessing

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
              {token.symbol} - {token.balance.toFixed(4)} available
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

      {/* Status Indicators */}
      <div className="w-full mb-6 space-y-2">
        <div className="flex items-center gap-2">
          {processingStatus === 'completed' ? (
            <HiMiniCheckCircle className="text-green-400" size={20} />
          ) : (
            <div className="w-5 h-5 border-2 border-[#8E9BAE] rounded-full" />
          )}
          <span
            className={`text-sm ${processingStatus === 'completed' ? 'text-green-400' : 'text-[#8E9BAE]'}`}
          >
            {processingStatus === 'completed'
              ? 'Deposit completed'
              : 'Approve and transfer tokens to Spherre Treasury'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        <button
          onClick={handleDeposit}
          disabled={isLoading || !amount || parseFloat(amount) <= 0}
          className="w-full h-[50px] rounded-[7px] bg-[#6F2FCE] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isMulticallLoading || isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <HiMiniArrowPath className="animate-spin" size={20} />
              Processing...
            </div>
          ) : (
            `Deposit ${selectedToken} to Treasury`
          )}
        </button>

        {processingStatus === 'completed' && (
          <div className="w-full p-4 bg-green-900/20 border border-green-500/30 rounded-[7px]">
            <p className="text-green-400 text-sm text-center">
              ✅ Deposit completed successfully! Your tokens have been
              transferred to the Spherre Treasury.
            </p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="w-full mt-6 p-4 bg-[#1C1D1F] rounded-[7px]">
        <p className="text-[14px] text-[#8E9BAE] mb-2">How it works:</p>
        <ul className="text-[12px] text-[#8E9BAE] space-y-1">
          <li>• Select a token with available balance</li>
          <li>• Enter the amount you want to deposit</li>
          <li>• Approve and transfer tokens in a single transaction</li>
          <li>• Tokens will be deposited to the Spherre Treasury</li>
          <li>• This uses multicall to save gas and time</li>
        </ul>
      </div>
    </div>
  )
}

export default DappDeposit
