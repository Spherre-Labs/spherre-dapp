'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const StepOne = () => {
    const [accountName, setAccountName] = useState("")
    const [desc, setDesc] = useState("")

    const router = useRouter()

    /**
     * Handles form submission for Step 1 of the onboarding process.
     * Checks if both the account name and description inputs are not empty.
     * If not, it throws an error.
     * If valid, logs the inputs to console and navigates to Step 2.
     * If an error occurs during navigation, it's logged to console.
     */
    const handleSubmitStepOne = async () => {
        if (!accountName && !desc) {
            throw Error("Inputs are required");
        }

        try {
            console.log({ accountName, description: desc });
            // Necessay submit logic 
            router.push("/onboarding/step2");
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <section className="max-w-2xl mx-auto md:mt-28 mt-20">
            <main className='w-full flex flex-col items-center gap-6'>
                {/* Step Indicators */}
                <div className="w-full flex justify-between items-center md:px-8 relative">
                    {/* Horizontal Lines */}
                    <div className="absolute top-[22.5px] md:left-[18%] left-[23%] w-[15%] md:w-[25%] h-[1px] bg-[#8E9BAE]"></div>
                    <div className="absolute top-[22.5px] md:right-[18%] right-[23%] w-[15%] md:w-[25%] h-[1px] bg-[#8E9BAE]"></div>

                    {/* Step 1 */}
                    <div className="flex flex-col items-center gap-8 relative">
                        <div className="flex justify-center items-center w-[45px] h-[45px] rounded-full bg-[#6F2FCE] text-white font-[700] text-lg z-10">
                            1
                        </div>
                        <h4 className="text-white text-sm text-center font-[400]">Account Details</h4>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center gap-8 relative">
                        <div className="flex justify-center items-center w-[45px] h-[45px] rounded-full bg-[#1C1D1F] text-[#8E9BAE] font-[700] text-lg z-10">
                            2
                        </div>
                        <h4 className="text-[#8E9BAE] text-sm text-center font-[400]">Members & Threshold</h4>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center gap-8 relative">
                        <div className="flex justify-center items-center w-[45px] h-[45px] rounded-full bg-[#1C1D1F] text-[#8E9BAE] font-[700] text-lg z-10">
                            3
                        </div>
                        <h4 className="text-[#8E9BAE] text-sm text-center font-[400]">Confirm & Setup</h4>
                    </div>
                </div>

                {/* Writeup */}
                <div className='max-w-sm my-12'>
                    <h1 className='text-center text-white font-[700] text-[40px] leading-[47.42px]'>Secure Your Digital Assets Seamlessly</h1>
                    <p className='font-[400] text-[16px] leading-[25px] text-center text-[#8E9BAE] lg:px-8 mt-3'>Name your Spherre account, Spherre ensures seamless integration, giving you full control over your digital assets.</p>
                </div>


                {/* form */}
                <div className='rounded-[10px] bg-[#1C1D1F] w-full overflow-hidden'>
                    <div className='bg-[#272729] py-[18px] md:px-[26px] px-4 w-full h-[62px]'>
                        <h4 className="text-white font-[700] text-xl">Create Account</h4>
                    </div>

                    {/* Inputs */}
                    <form onSubmit={handleSubmitStepOne} className='w-full flex flex-col gap-6 py-4 md:px-[26px] px-4'>
                        {/* Account name */}
                        <div className='w-full'>
                            <label htmlFor="accountName" className='font-[400] text-[14px]leading-[24px] text-white mb-1 block'>Spherre Account Name</label>
                            <input
                                type='text'
                                name='accountName'
                                id='accountName'
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                className='w-full border border-[#292929] rounded-[7px] placeholder:text-[#8E9BAE] px-4 py-3 bg-transparent outline-none'
                                placeholder='Enter a team name'
                                required />
                        </div>

                        {/* Description */}
                        <div className='w-full'>
                            <label htmlFor="description" className='font-[400] text-[14px]leading-[24px] text-white mb-1 block'>Spherre Description</label>
                            <textarea
                                name='description'
                                id="description"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                className='w-full h-[100px] border border-[#292929] rounded-[7px] placeholder:text-[#8E9BAE] px-4 py-3 bg-transparent outline-none resize-y shadow-[0px_1.08px_2.16px_0px_#1018280A]'
                                placeholder='Write here...'
                                required></textarea>
                        </div>

                        {/* Button */}
                        <button type='submit' className='w-full h-[50px] flex justify-center items-center bg-white shadow-[0px_1.08px_2.16px_0px_#1018280A] text-[#101213] font-[500] text-base rounded-[7px]'>Continue</button>
                    </form>
                </div>
            </main>
        </section>
    )
}

export default StepOne