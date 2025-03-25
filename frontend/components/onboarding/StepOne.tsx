'use client'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { LuTrash } from 'react-icons/lu'
import OnboardingCard from './OnboardingCard'
import StepIndicator from './StepIndicators'



// Main Onboarding Component
export default function StepOne() {
  // State to track the current step
  const [currentStep, setCurrentStep] = useState(1)
  
  // Loading state for data fetching operations
  const [isLoading, setIsLoading] = useState(false)
  
  // Form data state (combined from all steps)
  const [formData, setFormData] = useState({
    // Step 1 data
    accountName: '',
    description: '',
    
    // Step 2 data
    spherreMembers: [''],
    approvals: 1,
  })
  
  // Handle changes to accountName and description
  const handleAccountNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, accountName: e.target.value })
  }
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, description: e.target.value })
  }
  
  // Handle adding, deleting and updating members
  const addNewMember = () => {
    setFormData({
      ...formData,
      spherreMembers: [...formData.spherreMembers, '']
    })
  }
  
  const deleteMember = (index: number) => {
    const newMembers = formData.spherreMembers.filter((_, i) => i !== index)
    const newApprovals = formData.approvals > newMembers.length ? newMembers.length : formData.approvals
    
    setFormData({
      ...formData,
      spherreMembers: newMembers,
      approvals: newApprovals
    })
  }
  
  const clearMember = (index: number) => {
    const updatedMembers = [...formData.spherreMembers]
    updatedMembers[index] = ''
    
    setFormData({
      ...formData,
      spherreMembers: updatedMembers
    })
  }
  
  const handleMembersChange = (index: number, value: string) => {
    const updatedMembers = [...formData.spherreMembers]
    updatedMembers[index] = value
    
    setFormData({
      ...formData,
      spherreMembers: updatedMembers
    })
  }
  
  const handleApprovalsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      approvals: Number(event.target.value)
    })
  }
  
  // Form submission handlers for each step
  const handleSubmitStepOne = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.accountName || !formData.description) {
      throw Error('Account name and description are required')
    }
    
    try {
      setIsLoading(true)
      
      // Simulate API call to save step 1 data
      await new Promise(resolve => setTimeout(resolve, 500))
      console.log('Step 1 data:', { 
        accountName: formData.accountName, 
        description: formData.description 
      })
      
      // Move to next step
      setCurrentStep(2)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSubmitStepTwo = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.spherreMembers[0] === '') {
      throw Error('Please add at least one member to continue')
    }
    
    try {
      setIsLoading(true)
      
      // Simulate API call to save step 2 data
      await new Promise(resolve => setTimeout(resolve, 500))
      console.log('Step 2 data:', { 
        spherreMembers: formData.spherreMembers, 
        approvals: formData.approvals 
      })
      
      // Move to next step
      setCurrentStep(3)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)
      
      // Simulate final API call to save all data
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Log the complete form data
      console.log('Complete onboarding data:', formData)
      
      // Here you would navigate to the success page or dashboard
      // For now, we'll reset the form and go back to step 1
      alert('Multisig account successfully created!')
      setFormData({
        accountName: '',
        description: '',
        spherreMembers: [''],
        approvals: 1
      })
      setCurrentStep(1)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <StepIndicator currentStep={currentStep} />
      </div>
      
      {/* Step 1: Account Details */}
      {currentStep === 1 && (
        <>
          {/* Writeup */}
          <div className="max-w-sm my-12 text-white mx-auto">
            <h1 className="text-center text-white font-[700] text-[40px] leading-[47.42px]">
              Secure Your Digital Assets Seamlessly
            </h1>
            <p className="text-[16px] leading-[25px] text-center text-[#8E9BAE] mx-auto w-[337px] mt-3">
              Name your Spherre account, Spherre ensures seamless integration,
              giving you full control over your digital assets.
            </p>
          </div>
          
          {/* form */}
          <form onSubmit={handleSubmitStepOne}>
            <OnboardingCard title="Create Account">
              <div className="w-full flex flex-col gap-6 py-4 md:px-[26px] px-4">
                {/* Account name */}
                <div className="w-full">
                  <label
                    htmlFor="accountName"
                    className="font-[400] text-[14px] leading-[24px] text-white mb-1 block"
                  >
                    Spherre Account Name
                  </label>
                  <input
                    type="text"
                    name="accountName"
                    id="accountName"
                    value={formData.accountName}
                    onChange={handleAccountNameChange}
                    className="w-full border border-[#292929] rounded-[7px] placeholder:text-[#8E9BAE] px-4 py-3 bg-transparent outline-none"
                    placeholder="Enter a team name"
                    required
                  />
                </div>
                
                {/* Description */}
                <div className="w-full">
                  <label
                    htmlFor="description"
                    className="font-[400] text-[14px] leading-[24px] text-white mb-1 block pb-2"
                  >
                    Spherre Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    className="w-full h-[100px] border border-[#292929] rounded-[7px] placeholder:text-[#8E9BAE] px-4 py-3 bg-transparent outline-none resize-y shadow-[0px_1.08px_2.16px_0px_#1018280A]"
                    placeholder="Write here..."
                    required
                  ></textarea>
                </div>
                
                {/* Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[50px] flex justify-center items-center bg-white shadow-[0px_1.08px_2.16px_0px_#1018280A] text-[#101213] font-[500] text-base rounded-[7px] disabled:opacity-70"
                >
                  {isLoading ? 'Loading...' : 'Continue'}
                </button>
              </div>
            </OnboardingCard>
          </form>
        </>
      )}
      
      {/* Step 2: Members & Threshold */}
      {currentStep === 2 && (
        <>
          {/* Writeup */}
          <div className="max-w-sm my-12 mx-auto">
            <h1 className="text-center text-white font-[700] text-[40px] leading-[47.42px]">
              Add Members to a Multisig Vault
            </h1>
            <p className="font-[400] text-[16px] leading-[25px] text-center text-[#8E9BAE] lg:px-8 mt-3">
              Add your team members & customize security settings to fit your
              team&apos;s needs.
            </p>
          </div>
          
          {/* form */}
          <form onSubmit={handleSubmitStepTwo} className="w-full space-y-4">
            <OnboardingCard title="Add Spherre Members">
              {/* Inputs */}
              <div className="w-full flex flex-col gap-6 py-4 md:px-[26px] px-4">
                {/* Account name */}
                {formData.spherreMembers.map((member, index) => (
                  <div key={index} className="w-full">
                    <label
                      htmlFor={`accountName-${index}`}
                      className="font-[400] text-[14px] leading-[24px] text-white mb-1 block"
                    >
                      Member {index + 1}
                    </label>

                    <div className="relative w-full">
                      <input
                        type="text"
                        name="accountName"
                        id={`accountName-${index}`}
                        className="w-full border border-[#292929] rounded-[7px] placeholder:text-[#8E9BAE] px-4 py-3 bg-transparent outline-none pr-10"
                        placeholder="Enter team member's address"
                        onChange={(e) => handleMembersChange(index, e.target.value)}
                        value={member}
                        required
                      />
                      {index === 0 ? (
                        <LuTrash
                          onClick={() => clearMember(index)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8E9BAE] cursor-pointer"
                        />
                      ) : (
                        <LuTrash
                          onClick={() => deleteMember(index)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8E9BAE] cursor-pointer"
                        />
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="w-full h-[50px] flex justify-center items-center bg-[#272729] shadow-[0px_1.08px_2.16px_0px_#1018280A] text-white font-[500] text-base rounded-[7px]"
                  onClick={addNewMember}
                >
                  <FaPlus className="mr-3" /> Add Member
                </button>
              </div>
            </OnboardingCard>

            <OnboardingCard title="Configure Threshold">
              <div className="w-full flex flex-col gap-6 py-4 md:px-[26px] px-4">
                <p className="text-gray-400 text-sm mt-1">
                  Please select the amount of approvals needed to confirm a
                  transaction.
                </p>

                <div className="w-full">
                  <input
                    type="range"
                    min="1"
                    max={formData.spherreMembers.length}
                    step="1"
                    value={formData.approvals}
                    onChange={handleApprovalsChange}
                    className="flex-grow w-full appearance-none h-2 bg-[#272729] rounded-lg outline-none cursor-pointer"
                  />
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm">1</span>
                    <span className="text-sm">{formData.spherreMembers.length}</span>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="w-full h-[50px] flex justify-center items-center bg-[#272729] shadow-[0px_1.08px_2.16px_0px_#1018280A] text-white font-[500] text-base rounded-[7px]"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-[50px] flex justify-center items-center bg-white shadow-[0px_1.08px_2.16px_0px_#1018280A] text-[#101213] font-[500] text-base rounded-[7px] disabled:opacity-70"
                  >
                    {isLoading ? 'Loading...' : 'Continue'}
                  </button>
                </div>

                <style>
                  {`
                    input[type='range']::-webkit-slider-thumb {
                        appearance: none;
                        width: 16px;
                        height: 16px;
                        background: white;
                        border-radius: 50%;
                    }`}
                </style>
              </div>
            </OnboardingCard>
          </form>
        </>
      )}
      
      {/* Step 3: Confirm & Setup */}
      {currentStep === 3 && (
        <>
          {/* Writeup */}
          <div className="max-w-sm my-12 mx-auto">
            <h1 className="text-center text-white font-[700] text-[40px] leading-[47.42px]">
              Confirm Your Setup
            </h1>
            <p className="font-[400] text-[16px] leading-[25px] text-center text-[#8E9BAE] lg:px-8 mt-3">
              Please review the details of your multisig account before finalizing setup.
            </p>
          </div>
          
          <form onSubmit={handleFinalSubmit} className="w-full space-y-4">
            <OnboardingCard title="Account Details">
              <div className="w-full flex flex-col gap-4 py-4 md:px-[26px] px-4">
                <div>
                  <h4 className="text-white text-sm font-medium">Account Name</h4>
                  <p className="text-[#8E9BAE] mt-1">{formData.accountName}</p>
                </div>
                
                <div>
                  <h4 className="text-white text-sm font-medium">Description</h4>
                  <p className="text-[#8E9BAE] mt-1">{formData.description}</p>
                </div>
              </div>
            </OnboardingCard>
            
            <OnboardingCard title="Members & Threshold">
              <div className="w-full flex flex-col gap-4 py-4 md:px-[26px] px-4">
                <div>
                  <h4 className="text-white text-sm font-medium">Members ({formData.spherreMembers.length})</h4>
                  <ul className="mt-2 space-y-2">
                    {formData.spherreMembers.map((member, index) => (
                      <li key={index} className="text-[#8E9BAE]">
                        {index + 1}. {member}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-white text-sm font-medium">Required Approvals</h4>
                  <p className="text-[#8E9BAE] mt-1">
                    {formData.approvals} out of {formData.spherreMembers.length} members
                  </p>
                </div>
              </div>
            </OnboardingCard>
            
            <div className="flex space-x-4 mt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full h-[50px] flex justify-center items-center bg-[#272729] shadow-[0px_1.08px_2.16px_0px_#1018280A] text-white font-[500] text-base rounded-[7px]"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[50px] flex justify-center items-center bg-white shadow-[0px_1.08px_2.16px_0px_#1018280A] text-[#101213] font-[500] text-base rounded-[7px] disabled:opacity-70"
              >
                {isLoading ? 'Processing...' : 'Create Multisig Account'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}