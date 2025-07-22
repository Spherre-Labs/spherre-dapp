'use client'
import StepIndicators from '../../../components/onboarding/StepIndicators'
import SphereAccountReview from '../../components/SphereAccountReview'
import MembersThreshold from '../../components/MembersThreshold'
import { useRouter } from 'next/navigation'
import { useMulticall } from '@/hooks/useMulticall'
import { spherreConfig, useGetDeploymentFee, useGetFeesTokenAddress, useScaffoldWriteContract } from '@/lib'
import { useAccount, useConnect } from '@starknet-react/core'
import { InvokeFunctionResponse, RpcProvider } from 'starknet'
import { useGlobalModal } from '@/app/components/modals/GlobalModalProvider'
import { useOnboarding } from '@/context/OnboardingContext'
import { ERC20_ABI } from '@/lib/contracts/erc20-contracts'
import { use, useContext, useEffect } from 'react'
import { SpherreAccountContext } from '@/app/context/account-context'
import { routes } from '@/app/[address]/layout'
import { useScaffoldEventHistory } from '@/hooks/useScaffoldEventHistory'
import { set } from 'zod'

export default function ConfirmSetup() {
  const router = useRouter()
  const {showProcessing, showError, showSuccess, hideModal} = useGlobalModal();

  const {data: fee} = useGetDeploymentFee(`0x11`);
  const feeToken = useGetFeesTokenAddress();
  const onboarding = useOnboarding();
  const {setAccountAddress} = useContext(SpherreAccountContext);

  const provider = new RpcProvider({
    nodeUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://free-rpc.nethermind.io/sepolia-juno'
  });

  const {writeAsync, data, isLoading, isSuccess, error} = useScaffoldWriteContract({
    contractConfig: spherreConfig,
    functionName: 'deploy_account',
    onSuccess: (data) =>{
      onSuccessfulAccountCreation(data)
    },
    onError: (err) =>{
      hideModal();
      showError({
        title: 'Transaction Failed',
        errorText: err instanceof Error ? err.message : 'Something went wrong.',
      })
    }
  });
  const {account, address} = useAccount()


  const {data: eventData} = useScaffoldEventHistory({
    contractConfig: spherreConfig,
    eventName: 'AccountDeployed',
    fromBlock: BigInt(0),
    watch: true,
  });


  const fetchEventData = () =>{
    console.log("Fetching event data...");
    console.log(eventData)
    console.log("Address",address)
    for (const event of eventData) {
      console.log(event.parsedArgs.owner)
        if (event.parsedArgs.owner.toLowerCase() == address) {
          const accountAddress = event.parsedArgs.account_address as `0x${string}`;
          setAccountAddress(accountAddress);
          console.log("Account retrieved from event:", accountAddress)
          hideModal();
          router.push(routes(accountAddress).dashboard);
          return;
        }
    }
    
  }


  const onSuccessfulAccountCreation = (data: InvokeFunctionResponse ) => {
      console.log("Account created successfully", data);
      showProcessing({
        title: 'Account Created Successfully',
        subtitle: 'Please wait while we fetch your account information.',
      })
  }
  const handleClick = async () => {
    if (!account){
      console.error("Connect your wallet");
      alert("Connect your wallet")
      return
    }
    if(!onboarding?.accountName){
      showError({
        title: 'Invalid Account name',
        errorText: 'Enter the account name properly',
      })
      return
    }
    if(!onboarding?.members || onboarding?.members.length === 0){
      showError({
        title: 'Invalid Members',
        errorText: 'Enter the members properly',
      })
      return
    }
    if(!onboarding?.approvals){
      showError({
        title: 'Invalid Threshold',
        errorText: 'Enter the threshold properly',
      })
      return
    }
    showProcessing({
      title: 'Creating Account',
      subtitle: 'Please wait while we create your account.',
    })
    await writeAsync(
       {
          owner: address,
          name: onboarding.accountName,
          description: onboarding.description ?? " ",
          members: onboarding.members,
          threshold: onboarding.approvals
      }
    )
  }

  useEffect(() => {
    fetchEventData();
  }
,[eventData])

  return (

      <div className="text-theme">
        {/* Main Container */}
         <StepIndicators currentStep={3} />
        <div className="flex flex-col items-center px-4  pb-6 sm:pb-8">
          <div className="max-w-[672px] w-full pt-[1rem]">
           

            {/* Heading & Description */}
            <div className="max-w-sm mx-auto my-12 text-center pb-8">
              <h1 className="text-theme font-[700] text-[40px] leading-[47.42px] pt-4 transition-colors duration-300">
                Confirm and Secure Your Setup
              </h1>
              <p className="font-[400] text-[16px] leading-[25px] text-theme-secondary mt-3 transition-colors duration-300">
                Review your vault configuration, approve key settings, and
                finalize your setup.
              </p>
            </div>

            {/* Review & Threshold Sections */}
            <div className="rounded-[10px] bg-theme-bg-secondary w-full overflow-hidden border border-theme-border transition-colors duration-300">
              <div className="bg-theme-bg-tertiary py-[18px] md:px-[26px] px-4 w-full h-[62px] transition-colors duration-300">
                <h4 className="text-theme font-[700] text-xl transition-colors duration-300">
                  Review Setup
                </h4>
              </div>
              <div className="w-full flex flex-col gap-6 py-4 md:px-[26px] px-4">
                <SphereAccountReview deployFee='' />
                <MembersThreshold />
                <button
                  type="button"
                  disabled={account === undefined || isLoading}
                  onClick={handleClick}
                  className="w-full h-[50px] flex justify-center items-center bg-purple-700 dark:bg-white shadow-[0px_1.08px_2.16px_0px_#1018280A] text-[#101213] font-[500] text-base rounded-[7px] hover:bg-gray-50 dark:hover:bg-gray-100 transition-colors duration-300"
                >
                  Confirm Setup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
