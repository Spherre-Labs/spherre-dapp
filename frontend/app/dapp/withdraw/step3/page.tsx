'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import WithdrawalSteps from '@/components/withdrawal/withdrawal-steps'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Usdt from '@/public/Images/usdt.png'
import Backstage from '@/public/Images/backstageboys.png'
import Arrow from '@/public/Images/Arrow.png'

export default function WithdrawalReviewPage() {
  const router = useRouter()
  const [note, setNote] = useState<string>('')

  // Dummy data for the transaction
  const transactionData = {
    amount: '245.6783447',
    recipientAddress: 'TY4g...Him',
    recipientFullAddress: 'USDT0x05hgfst...62teyw',
    fromAccount: {
      name: 'Backstage Boys',
      address: 'G252JGH5hgfst...62teyw',
      avatar: Backstage,
    },
    toAccount: {
      name: 'USDT Chain',
      avatar: Usdt,
    },
    fee: '$0.0',
    total: '$245.6783447'
  }

  const handleGoBack = () => {
    // Go back to the amount selection page (step 2)
    router.push('/dapp/withdraw')
  }

  const handleCancel = () => {
    router.push('/dapp')
  }

  const handleExecute = () => {
    // In a real app, you would submit the transaction here
    console.log('Executing withdrawal with note:', note)
    
    // Navigate to dashboard after completion
    router.push('/dapp')
  }

  return (
    <div className="  min-h-screen w-full font-sans bg-black text-white p-4 sm:p-6 flex items-center justify-center relative">
      {/* Go Back Button */}
      <button
        onClick={handleGoBack}
        className="flex items-center gap-2 sm:gap-3 text-white group absolute top-4 sm:top-10 left-4 sm:left-10 text-sm sm:text-base font-bold transition-colors"
      >
        <ArrowLeft className="p-1 sm:p-2 bg-[#29292A] w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:ml-1 sm:group-hover:ml-2 duration-300 rounded-md" />
        <span className="inline">Go Back</span>
      </button>

      <div className='mt-[7em]'>
        <WithdrawalSteps currentStep={3} />

        
        <div className="flex flex-col pt-32 sm:pt-40 h-full w-full max-w-xs sm:max-w-sm md:max-w-lg xl:max-w-2xl mt-[-10%]">
          <h1 className="text-xl sm:text-3xl font-bold text-center mb-1 sm:mb-2">
            Withdraw to Another Wallet
          </h1>
          <p className="text-gray-400 text-center text-sm sm:text-base mb-6 sm:mb-8">
            Please review your information before withdrawing
          </p>

          
          <div className=" text-center">
            <div className="flex items-center justify-center gap-1 mb-6">
              <span className="text-gray-400 text-lg font-bold">Send</span>
              <span className="text-xl font-bold">{transactionData.amount}</span>
              <span className="text-gray-400 text-lg font-bold">to</span>
              <span className="text-xl font-bold">{transactionData.recipientAddress}</span>
            </div>

            
            <div className="flex items-center justify-center mb-10">
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2">
                  <Image 
                    src={transactionData.fromAccount.avatar}
                    alt={transactionData.fromAccount.name}
                    width={80}
                    height={80}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-3">From</p>
                <p className="font-semibold">{transactionData.fromAccount.name}</p>
                <p className="text-sm text-gray-500 bg-gray-100 bg-opacity-15 p-2 rounded-md mt-3 ">{transactionData.fromAccount.address}</p>
              </div>

              
              <div className="mx-6 sm:mx-10 mb-[4em]">
                <Image
                    src={Arrow}
                    alt="Arrow"
                    width={200}
                    height={24}
                    className=" "
                />
              </div>

              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2">
                  <Image 
                    src={transactionData.toAccount.avatar}
                    alt={transactionData.toAccount.name}
                    width={80}
                    height={80}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-3">To</p>
                <p className="font-semibold">{transactionData.toAccount.name}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 bg-opacity-15 p-2 rounded-md mt-3">
                  <span className='text-white text-sm'>{transactionData.recipientFullAddress}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17M13 3H21V11M11 13L20.2929 3.70711" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            
            <div className=" rounded-lg p-5 mb-6">
              <h3 className="font-semibold text-lg text-left mb-4">Order Summary</h3>
              
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Amount</span>
                <span>{transactionData.amount}</span>
              </div>
              
              
              <div className="flex justify-between items-center mb-2 ">
                <span className="text-gray-400">Transaction Fee</span>
                <span className='text-lg font-bold'>{transactionData.fee}</span>
              </div>

              
              
              <div className="flex justify-between items-center">
                <span className="text-white">Transaction Fee</span>
                <span className=" text-lg font-bold">{transactionData.total}</span>
              </div>
            </div>

            
            <div className="mb-6">
              <p className="text-left text-gray-400 mb-2">Note</p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write a note here..."
                className="w-full p-4 bg-transparent border border-gray-700 rounded-lg text-white resize-none focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                rows={3}
              />
            </div>

            

          </div>

          
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <button
              onClick={handleCancel}
              className="py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base bg-[#272729] text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExecute}
              className="py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base bg-primary hover:bg-purple-900 text-white rounded-lg transition-colors"
            >
              Execute
            </button>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 text-left mt-3">
              By clicking Execute you`re withdrawing funds to an internal wallet, please review the details before 
              proceeding with the transaction.
            </p>
        </div>
      </div>
    </div>
  )
}