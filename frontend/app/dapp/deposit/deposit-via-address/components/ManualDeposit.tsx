'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import { HiMiniArrowPath } from 'react-icons/hi2'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { SPHERRE_CONTRACTS } from '@/lib/contracts/spherre-contracts'

const ManualDeposit = () => {
  const address = SPHERRE_CONTRACTS.SPHERRE

  const [copied, setCopied] = useState(false)
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const [src, setSrc] = useState<string>('')

  const generateQRCode = (address: string) => {
    QRCode.toDataURL(address, {
      width: 250, // Size
      margin: 2, // Less whitespace
      color: {
        dark: '#ffffff',
        light: '#1C1D1F',
      },
      errorCorrectionLevel: 'H',
    }).then(setSrc)
  }

  const downloadQRCode = () => {
    const link = document.createElement('a')
    link.href = src
    link.download = `spherre-${address.slice(0, 5)}-qrcode-.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const { balance, symbol } = useTokenBalance()

  useEffect(() => {
    generateQRCode(address)
  }, [])

  return (
    <div className="flex-col items-start flex justify-center w-full">
      <p className="pb-5 text-[14px] text-[#8E9BAE]">Account</p>
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
            alt="member avatar"
            height={50}
            width={50}
            className="rounded-full"
          />
          <div className="flex justify-between flex-col py-5">
            <p className="font-bold text-white">Backstreet boys</p>
            <p className="font-medium text-[#8E9BAE]">G252...62teyw</p>
          </div>
        </div>

        <div className="flex justify-between flex-col h-full">
          <p className="pt-[8px]">
            <span className="font-medium text-[14px] text-[#8E9BAE]">
              Available Balance:{' '}
            </span>{' '}
            <span className="font-semibold text-[25px] text-white">
              {balance.toFixed(2)}
            </span>{' '}
            <span className="font-normal text-[20px] text-[#8E9BAE]">
              {symbol}
            </span>
          </p>
          <p className="text-right pb-[25px]">
            {' '}
            <span className="font-medium text-[14px] text-[#8E9BAE]">
              Threshold:
            </span>{' '}
            <span className="font-semibold text-[16px] text-white">
              2/3
            </span>{' '}
          </p>
        </div>
      </div>

      <div className="flex flex-col h-[322px] w-full">
        <div className="flex justify-between gap-5">
          <div className="size-[250px] relative overflow-hidden rounded-[10px] bg-gray-100 dark:bg-[#1C1D1F] p-2 shadow-lg transition-colors duration-300">
            {src ? (
              <>
                <Image
                  src={src}
                  alt="qrcode"
                  width={250}
                  height={250}
                  className="w-full h-full object-cover"
                />
                <Image
                  src="/depositAddy.svg"
                  alt="member avatar"
                  height={60}
                  width={60}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100 dark:bg-[#1C1D1F] p-2 transition-colors duration-300"
                />
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <HiMiniArrowPath
                  size={40}
                  className="animate-spin text-gray-600 dark:text-white transition-colors duration-300"
                />
              </div>
            )}
          </div>

          <div className="my-2 max-w-[345px] text-left">
            <p className="text-[16px] text-gray-900 dark:text-white transition-colors duration-300">
              Send funds to this address.
            </p>
            <p className="text-[14px] text-[#8E9BAE]">
              Please ensure the address is correct and made via this address.
              Otherwise, your deposited funds will not be added to your
              available Spherre balance nor will it be refunded
            </p>
            <p className="text-[14px] text-[#8E9BAE] pt-5">Minimum Deposit</p>
            <p className="text-[14px] text-gray-900 dark:text-white pb-5 transition-colors duration-300">
              0.00000001 USDT
            </p>
            <p className="text-[14px] text-[#8E9BAE]">
              Expected Arrival & Duration
            </p>
            <p className="text-[14px] text-gray-900 dark:text-white transition-colors duration-300">
              24 Hours 3 Confirmations
            </p>
          </div>
        </div>

        <div className="h-[48px] bg-[#1C1D1F] px-2 mt-5 rounded-[10px] flex justify-between items-center">
          <span className="text-white text-sm">{address}</span>
          <div className="bg-[#29292A] rounded-[5px] gap-1 w-8 h-8 flex items-center justify-center cursor-pointer">
            <Image
              src="/copy-white.svg"
              alt="copy"
              height={20}
              width={20}
              onClick={() =>
                copyToClipboard('G2520xec7Spherre520bb71f30523bcce4c10ad62teyw')
              }
              className="cursor-pointer"
            />
          </div>{' '}
          {copied && <p className="text-[11px] text-green-400">Copied!</p>}
        </div>
      </div>

      <div className="flex justify-between gap-5 mt-5">
        <button
          onClick={downloadQRCode}
          className="w-[304px] h-[50px] rounded-[7px] bg-gray-200 dark:bg-[#272729] text-gray-900 dark:text-white transition-colors duration-300"
        >
          Save as image
        </button>{' '}
        <button
          onClick={() =>
            copyToClipboard('G2520xec7Spherre520bb71f30523bcce4c10ad62teyw')
          }
          className="w-[304px] h-[50px] rounded-[7px] bg-[#6F2FCE] text-white"
        >
          Copy address
        </button>{' '}
      </div>
    </div>
  )
}

export default ManualDeposit
