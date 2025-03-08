'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { LuTrash } from 'react-icons/lu'
import OnboardingCard from './OnboardingCard'

const StepTwo = () => {
  const router = useRouter()

  const [spherreMembers, setSpherreMembers] = useState([''])
  const [approvals, setApprovals] = useState(1)

  const addNewMember = () => {
    setSpherreMembers([...spherreMembers, ''])
  }

  const deleteMember = (index: number) => {
    const newMembers = spherreMembers.filter((_, i) => i !== index)
    setSpherreMembers(newMembers)
    if (approvals > newMembers.length) {
      setApprovals(newMembers.length)
    }
  }

  const clearMember = (index: number) => {
    const updatedMembers = [...spherreMembers]
    updatedMembers[index] = ''
    setSpherreMembers(updatedMembers)
  }

  const handleApprovalsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setApprovals(Number(event.target.value))
  }

  const handleMembersChange = (index: number, value: string) => {
    const updatedMembers = [...spherreMembers]
    updatedMembers[index] = value
    setSpherreMembers(updatedMembers)
  }

  const handleSubmitStepTwo = async () => {
    if (spherreMembers[0] === '') {
      throw Error('Please add at least one member to continue')
    }

    try {
      console.log({ spherreMembers, approvals })
      // Necessay submit logic
      router.push('/onboarding/step3')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {/* Writeup */}
      <div className="max-w-sm my-12">
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
            {spherreMembers.map((member, index) => (
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
                max={spherreMembers.length}
                step="1"
                value={approvals}
                onChange={handleApprovalsChange}
                className="flex-grow w-full appearance-none h-2 bg-[#272729] rounded-lg outline-none cursor-pointer"
              />
              <div className="flex items-center justify-between px-1">
                <span className="text-sm">1</span>
                <span className="text-sm">{spherreMembers.length}</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/confirmSetup')}
              type="submit"
              className="w-full h-[50px] flex justify-center items-center bg-white shadow-[0px_1.08px_2.16px_0px_#1018280A] text-[#101213] font-[500] text-base rounded-[7px]"
            >
              Continue
            </button>

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
  )
}

export default StepTwo
