'use client'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { LuTrash } from 'react-icons/lu'
import OnboardingCard from './OnboardingCard'

import StepIndicator from './StepIndicators'

export default function StepOne() {
  const [currentStep, setCurrentStep] = useState(1)

  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    accountName: '',
    description: '',

    spherreMembers: [''],
    approvals: 1,
  })

  const handleAccountNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, accountName: e.target.value })
  }

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, description: e.target.value })
  }

  const addNewMember = () => {
    setFormData({
      ...formData,
      spherreMembers: [...formData.spherreMembers, ''],
    })
  }

  const deleteMember = (index: number) => {
    const newMembers = formData.spherreMembers.filter((_, i) => i !== index)
    const newApprovals =
      formData.approvals > newMembers.length
        ? newMembers.length
        : formData.approvals

    setFormData({
      ...formData,
      spherreMembers: newMembers,
      approvals: newApprovals,
    })
  }

  const clearMember = (index: number) => {
    const updatedMembers = [...formData.spherreMembers]
    updatedMembers[index] = ''

    setFormData({
      ...formData,
      spherreMembers: updatedMembers,
    })
  }

  const handleMembersChange = (index: number, value: string) => {
    const updatedMembers = [...formData.spherreMembers]
    updatedMembers[index] = value

    setFormData({
      ...formData,
      spherreMembers: updatedMembers,
    })
  }

  const handleApprovalsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData({
      ...formData,
      approvals: Number(event.target.value),
    })
  }

  const handleSubmitStepOne = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.accountName || !formData.description) {
      throw Error('Account name and description are required')
    }

    try {
      setIsLoading(true)

      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log('Step 1 data:', {
        accountName: formData.accountName,
        description: formData.description,
      })

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

      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log('Step 2 data:', {
        spherreMembers: formData.spherreMembers,
        approvals: formData.approvals,
      })

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

      await new Promise((resolve) => setTimeout(resolve, 800))

      console.log('Complete onboarding data:', formData)

      alert('Multisig account successfully created!')
      setFormData({
        accountName: '',
        description: '',
        spherreMembers: [''],
        approvals: 1,
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
      <div className="mb-8">
        <StepIndicator currentStep={currentStep} />
      </div>
      {currentStep === 1 && (
        <>
          <div className="max-w-sm my-12 text-white mx-auto">
            <h1 className="text-center text-white font-[700] text-[40px] leading-[47.42px]">
              Secure Your Digital Assets Seamlessly
            </h1>
            <p className="text-[16px] leading-[25px] text-center text-[#8E9BAE] mx-auto w-[337px] mt-3">
              Name your Spherre account, Spherre ensures seamless integration,
              giving you full control over your digital assets.
            </p>
          </div>
          <form onSubmit={handleSubmitStepOne}>
            <OnboardingCard title="Create Account">
              <div className="w-full flex flex-col gap-6 py-4 md:px-[26px] px-4">
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
                    className="w-full border border-[#292929] rounded-[7px] placeholder:text-[#8E9BAE] px-4 py-3 bg-transparent outline-none text-[#8E9BAE]"
                    placeholder="Enter a team name"
                    required
                  />
                </div>

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
                    className="w-full h-[100px] border border-[#292929] text-[#8E9BAE] rounded-[7px] placeholder:text-[#8E9BAE] px-4 py-3 bg-transparent outline-none resize-y shadow-[0px_1.08px_2.16px_0px_#1018280A]"
                    placeholder="Write here..."
                    required
                  ></textarea>
                </div>
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
      {currentStep === 2 && (
        <>
          <div className="max-w-sm my-12 mx-auto">
            <h1 className="text-center text-white font-[700] text-[40px] leading-[47.42px]">
              Add Members to a Multisig Vault
            </h1>
            <p className="font-[400] text-[16px] leading-[25px] text-center text-[#8E9BAE] lg:px-8 mt-3">
              Add your team members & customize security settings to fit your
              team&apos;s needs.
            </p>
          </div>

          <form onSubmit={handleSubmitStepTwo} className="w-full space-y-4">
            <OnboardingCard title="Add Spherre Members">
              <div className="w-full flex flex-col gap-6 py-4 md:px-[26px] px-4">
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
                        className="w-full border border-[#292929] rounded-[7px] placeholder:text-[#8E9BAE] px-4 py-3 bg-transparent text-[#8E9BAE] outline-none pr-10"
                        placeholder="Enter team member's address"
                        onChange={(e) =>
                          handleMembersChange(index, e.target.value)
                        }
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
                    className="flex-grow w-full appearance-none h-2 bg-[#272729] text-[#8E9BAE ] rounded-lg outline-none cursor-pointer"
                  />
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm">1</span>
                    <span className="text-sm">
                      {formData.spherreMembers.length}
                    </span>
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
      {currentStep === 3 && (
        <>
          <div className="max-w-sm my-12 mx-auto">
            <h1 className="text-center text-white font-[700] text-[40px] leading-[47.42px]">
              Confirm Your Setup
            </h1>
            <p className="font-[400] text-[16px] leading-[25px] text-center text-[#8E9BAE] lg:px-8 mt-3">
              Please review the details of your multisig account before
              finalizing setup.
            </p>
          </div>

          <form onSubmit={handleFinalSubmit} className="w-full space-y-4">
            <OnboardingCard title="Account Details">
              <div className="w-full flex flex-col gap-4 py-4 md:px-[26px] px-4">
                <div>
                  <h4 className="text-white text-sm font-medium">
                    Account Name
                  </h4>
                  <p className="text-[#8E9BAE] mt-1">{formData.accountName}</p>
                </div>

                <div>
                  <h4 className="text-white text-sm font-medium">
                    Description
                  </h4>
                  <p className="text-[#8E9BAE] mt-1">{formData.description}</p>
                </div>
              </div>
            </OnboardingCard>

            <OnboardingCard title="Members & Threshold">
              <div className="w-full flex flex-col gap-4 py-4 md:px-[26px] px-4">
                <div>
                  <h4 className="text-white text-sm font-medium">
                    Members ({formData.spherreMembers.length})
                  </h4>
                  <ul className="mt-2 space-y-2">
                    {formData.spherreMembers.map((member, index) => (
                      <li key={index} className="text-[#8E9BAE]">
                        {index + 1}. {member}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-white text-sm font-medium">
                    Required Approvals
                  </h4>
                  <p className="text-[#8E9BAE] mt-1">
                    {formData.approvals} out of {formData.spherreMembers.length}{' '}
                    members
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
