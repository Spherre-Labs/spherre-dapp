'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { Nunito_Sans } from 'next/font/google'

const nunito = Nunito_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
})

const Members = () => {
  const [activeTab, setActiveTab] = useState('members')

  return (
    <div className={`${nunito.className} bg-black h-screen p-5 py-10`}>
      <div className="flex text-white justify-between border-b-2 relative  border-[#292929]">
        <div className="flex items-center ">
          <p
            className={`cursor-pointer px-4 py-2 ${
              activeTab === 'members'
                ? 'border-b-2 border-white'
                : 'text-[#8E9BAE]'
            }`}
            onClick={() => setActiveTab('members')}
          >
            Spherre Members
          </p>
          <p
            className={`cursor-pointer px-4 py-2 ${
              activeTab === 'history'
                ? 'border-b-2 border-white'
                : 'text-[#8E9BAE]'
            }`}
            onClick={() => setActiveTab('history')}
          >
            History
          </p>
        </div>

        <button className="rounded-[7px] bg-[#6F2FCE] gap-[10px] text-[14px] font-medium absolute right-0 bottom-4 w-[156px] h-[45px] flex items-center justify-center">
          {' '}
          <Image
            src="/user-add.svg"
            alt="member avatar"
            height={24}
            width={24}
            className="rounded-full"
          />
          <span> Add Member</span>
        </button>
      </div>

      <div className="text-white mt-4">
        {activeTab === 'members' && (
          <div className="grid grid-cols-4 gap-5">
            <div className=" h-[244px] bg-[#1C1D1F]  rounded-[10px] ">
              <div className="flex flex-col items-center">
                <div className="w-[95%] h-[78px] bg-[#272729] mt-2 justify-between px-2 flex items-center  rounded-[7px]">
                  <div className="flex gap-3">
                    <Image
                      src="/member1.svg"
                      alt="member avatar"
                      height={50}
                      width={50}
                      className="rounded-full"
                    />{' '}
                    <div className="flex flex-col">
                      <p className="text-[20px] text-white font-semibold">
                        Member 1
                      </p>
                      <div className="flex items-center justify-center gap-[5px]">
                        <p className="font-semibold text-[16px] text-[#8E9BAE]">
                          22yquq...qyqiia
                        </p>
                        <Image
                          src="/copy.svg"
                          alt="copy"
                          height={18}
                          width={18}
                          className="rounded-full mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Image
                    src="/dots.svg"
                    alt="member avatar"
                    height={24}
                    width={24}
                    className="mb-12"
                  />
                </div>
              </div>
              <div className="flex mt-5 ml-5 gap-[10px]">
                {' '}
                <p className="text-[#8E9BAE] text-[14px] font-semibold">
                  Roles:
                </p>{' '}
                <div className="flex items-center justify-center text-[12px]  px-2 py-[2px] border-[1px] rounded-3xl text-[#FF7BE9] border-[#FF7BE9] bg-[#FF7BE9]/10">
                  Voter{' '}
                </div>
                <div className="flex items-center justify-center text-[12px]  px-2 py-[2px] border-[1px] rounded-3xl text-[#FF8A25] border-[#FF8A25] bg-[#FF8A25]/10">
                  Proposer{' '}
                </div>
                <div className="flex items-center justify-center text-[12px]  px-2 py-[2px] border-[1px] rounded-3xl text-[#19B360] border-[#19B360] bg-[#19B360]/10">
                  Executer{' '}
                </div>
              </div>

              <div className="flex mt-5 ml-4 gap-[10px]">
                {' '}
                <p className="text-[#8E9BAE] text-[14px] font-semibold">
                  Date added:
                </p>{' '}
                <p className="text-white text-[16px] font-semibold">
                  24 Mar 2025
                </p>{' '}
              </div>
              <div className="flex items-center justify-center mt-5">
                <button className="bg-[#272729] rounded-[7px] flex items-center justify-center font-medium text-[14px] text-white w-[90%] h-[36px]">
                  Remove member
                </button>
              </div>
            </div>{' '}
            <div className=" h-[244px] bg-[#1C1D1F]  rounded-[10px] ">
              <div className="flex flex-col items-center">
                <div className="w-[95%] h-[78px] bg-[#272729] mt-2 justify-between px-2 flex items-center  rounded-[7px]">
                  <div className="flex gap-3">
                    <Image
                      src="/member2.svg"
                      alt="member avatar"
                      height={50}
                      width={50}
                      className="rounded-full"
                    />{' '}
                    <div className="flex flex-col">
                      <p className="text-[20px] text-white font-semibold">
                        Member 2
                      </p>
                      <div className="flex items-center justify-center gap-[5px]">
                        <p className="font-semibold text-[16px] text-[#8E9BAE]">
                          22yquq...qyqiia
                        </p>
                        <Image
                          src="/copy.svg"
                          alt="copy"
                          height={18}
                          width={18}
                          className="rounded-full mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Image
                    src="/dots.svg"
                    alt="member avatar"
                    height={24}
                    width={24}
                    className="mb-12"
                  />
                </div>
              </div>
              <div className="flex mt-5 ml-4 gap-[10px]">
                {' '}
                <p className="text-[#8E9BAE] text-[14px] font-semibold">
                  Roles:
                </p>{' '}
                <div className="flex items-center justify-center text-[12px]  px-2 py-[2px] border-[1px] rounded-3xl text-[#FF7BE9] border-[#FF7BE9] bg-[#FF7BE9]/10">
                  Voter{' '}
                </div>
                <div className="flex items-center justify-center text-[12px]  px-2 py-[2px] border-[1px] rounded-3xl text-[#FF8A25] border-[#FF8A25] bg-[#FF8A25]/10">
                  Proposer{' '}
                </div>
              </div>

              <div className="flex mt-5 ml-4 gap-[10px]">
                {' '}
                <p className="text-[#8E9BAE] text-[14px] font-semibold">
                  Date added:
                </p>{' '}
                <p className="text-white text-[16px] font-semibold">
                  24 Mar 2025
                </p>{' '}
              </div>
              <div className="flex items-center justify-center mt-5">
                <button className="bg-[#272729] rounded-[7px] flex items-center justify-center font-medium text-[14px] text-white w-[90%] h-[36px]">
                  Remove member
                </button>
              </div>
            </div>{' '}
            <div className=" h-[244px] bg-[#1C1D1F]  rounded-[10px] ">
              <div className="flex flex-col items-center">
                <div className="w-[95%] h-[78px] bg-[#272729] mt-2 justify-between px-2 flex items-center  rounded-[7px]">
                  <div className="flex gap-3">
                    <Image
                      src="/member3.svg"
                      alt="member avatar"
                      height={50}
                      width={50}
                      className="rounded-full"
                    />{' '}
                    <div className="flex flex-col">
                      <p className="text-[20px] text-white font-semibold">
                        Member 3
                      </p>
                      <div className="flex items-center justify-center gap-[5px]">
                        <p className="font-semibold text-[16px] text-[#8E9BAE]">
                          22yquq...qyqiia
                        </p>
                        <Image
                          src="/copy.svg"
                          alt="copy"
                          height={18}
                          width={18}
                          className="rounded-full mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Image
                    src="/dots.svg"
                    alt="member avatar"
                    height={24}
                    width={24}
                    className="mb-12"
                  />
                </div>
              </div>
              <div className="flex mt-5 ml-4 gap-[10px]">
                {' '}
                <p className="text-[#8E9BAE] text-[14px] font-semibold">
                  Roles:
                </p>{' '}
                <div className="flex items-center justify-center text-[12px]  px-2 py-[2px] border-[1px] rounded-3xl text-[#FF7BE9] border-[#FF7BE9] bg-[#FF7BE9]/10">
                  Voter{' '}
                </div>
                <div className="flex items-center justify-center text-[12px]  px-2 py-[2px] border-[1px] rounded-3xl text-[#FF8A25] border-[#FF8A25] bg-[#FF8A25]/10">
                  Proposer{' '}
                </div>
              </div>

              <div className="flex mt-5 ml-4 gap-[10px]">
                {' '}
                <p className="text-[#8E9BAE] text-[14px] font-semibold">
                  Date added:
                </p>{' '}
                <p className="text-white text-[16px] font-semibold">
                  24 Mar 2025
                </p>{' '}
              </div>
              <div className="flex items-center justify-center mt-5">
                <button className="bg-[#272729] rounded-[7px] flex items-center justify-center font-medium text-[14px] text-white w-[90%] h-[36px]">
                  Remove member
                </button>
              </div>
            </div>{' '}
            <div className=" h-[244px] bg-[#1C1D1F]  rounded-[10px] ">
              <div className="flex flex-col items-center">
                <div className="w-[95%] h-[78px] bg-[#272729] mt-2 justify-between px-2 flex items-center  rounded-[7px]">
                  <div className="flex gap-3">
                    <Image
                      src="/member4.svg"
                      alt="member avatar"
                      height={50}
                      width={50}
                      className="rounded-full"
                    />{' '}
                    <div className="flex flex-col">
                      <p className="text-[20px] text-white font-semibold">
                        Member 4
                      </p>
                      <div className="flex items-center justify-center gap-[5px]">
                        <p className="font-semibold text-[16px] text-[#8E9BAE]">
                          22yquq...qyqiia
                        </p>
                        <Image
                          src="/copy.svg"
                          alt="copy"
                          height={18}
                          width={18}
                          className="rounded-full mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Image
                    src="/dots.svg"
                    alt="member avatar"
                    height={24}
                    width={24}
                    className="mb-12"
                  />
                </div>
              </div>
              <div className="flex mt-5 ml-4 gap-[10px]">
                {' '}
                <p className="text-[#8E9BAE] text-[14px] font-semibold">
                  Roles:
                </p>{' '}
                <div className="flex items-center justify-center text-[12px]  px-2 py-[2px] border-[1px] rounded-3xl text-[#FF7BE9] border-[#FF7BE9] bg-[#FF7BE9]/10">
                  Voter{' '}
                </div>
              </div>

              <div className="flex mt-5 ml-4 gap-[10px]">
                {' '}
                <p className="text-[#8E9BAE] text-[14px] font-semibold">
                  Date added:
                </p>{' '}
                <p className="text-white text-[16px] font-semibold">
                  24 Mar 2025
                </p>{' '}
              </div>
              <div className="flex items-center justify-center mt-5">
                <button className="bg-[#272729] rounded-[7px] flex items-center justify-center font-medium text-[14px] text-white w-[90%] h-[36px]">
                  Remove member
                </button>
              </div>
            </div>{' '}
            <div className=" h-[244px] bg-[#1C1D1F]  rounded-[10px] ">
              <div className="flex flex-col items-center">
                <div className="w-[95%] h-[78px] bg-[#272729] mt-2 justify-between px-2 flex items-center  rounded-[7px]">
                  <div className="flex gap-3">
                    <Image
                      src="/member5.svg"
                      alt="member avatar"
                      height={50}
                      width={50}
                      className="rounded-full"
                    />{' '}
                    <div className="flex flex-col">
                      <p className="text-[20px] text-white font-semibold">
                        Member 5
                      </p>
                      <div className="flex items-center justify-center gap-[5px]">
                        <p className="font-semibold text-[16px] text-[#8E9BAE]">
                          22yquq...qyqiia
                        </p>
                        <Image
                          src="/copy.svg"
                          alt="copy"
                          height={18}
                          width={18}
                          className="rounded-full mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Image
                    src="/dots.svg"
                    alt="member avatar"
                    height={24}
                    width={24}
                    className="mb-12"
                  />
                </div>
              </div>
              <div className="flex mt-5 ml-4 gap-[10px]">
                {' '}
                <p className="text-[#8E9BAE] text-[14px] font-semibold">
                  Roles:
                </p>{' '}
                <div className="flex items-center justify-center text-[12px]  px-2 py-[2px] border-[1px] rounded-3xl text-[#FF7BE9] border-[#FF7BE9] bg-[#FF7BE9]/10">
                  Voter{' '}
                </div>
              </div>

              <div className="flex mt-5 ml-4 gap-[10px]">
                {' '}
                <p className="text-[#8E9BAE] text-[14px] font-semibold">
                  Date added:
                </p>{' '}
                <p className="text-white text-[16px] font-semibold">
                  24 Mar 2025
                </p>{' '}
              </div>
              <div className="flex items-center justify-center mt-5">
                <button className="bg-[#272729] rounded-[7px] flex items-center justify-center font-medium text-[14px] text-white w-[90%] h-[36px]">
                  Remove member
                </button>
              </div>
            </div>{' '}
            <div className=" h-[244px] bg-[#1C1D1F]  flex flex-col gap-5 items-center justify-center rounded-[10px] ">
              <div className="size-[51px] rounded-full flex items-center justify-center bg-[#00000040]/25">
                <Image
                  src="/cross.svg"
                  alt="cross logo"
                  height={23}
                  width={23}
                  className=""
                />
              </div>
              <p className="text-[16px] font-semibold text-[#8E9BAE]">
                Add Member
              </p>
            </div>
          </div>
        )}
        {activeTab === 'history' && <p>Showing History...</p>}
      </div>
    </div>
  )
}

export default Members
