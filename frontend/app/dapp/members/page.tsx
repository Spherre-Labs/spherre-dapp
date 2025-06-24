'use client'
import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'
import { Nunito_Sans } from 'next/font/google'
import RemoveMemberModal from './components/remove-modal'
import AddMemberModal from './components/add-modal'
import EditMemberRolesModal from './components/edit-roles-modal'
const nunito = Nunito_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
})

const initialMembers = [
  {
    id: 1,
    name: 'Member 1',
    address: '22yquq...qyqiia',
    fullAddress: '22yquq92812xmnw2qyqiia',
    roles: ['Voter', 'Proposer', 'Executer'],
    dateAdded: '24 Mar 2025',
    image: '/member1.svg',
  },
  {
    id: 2,
    name: 'Member 2',
    address: '98sjdl...qwopsa',
    fullAddress: '98sjdl0293ksdlaqwopsa',
    roles: ['Voter', 'Proposer'],
    dateAdded: '24 Mar 2025',
    image: '/member2.svg',
  },
  {
    id: 3,
    name: 'Member 3',
    address: '88abck...zzzzzx',
    fullAddress: '88abckqwertyuizzzzzx',
    roles: ['Voter'],
    dateAdded: '24 Mar 2025',
    image: '/member3.svg',
  },
  {
    id: 4,
    name: 'Member 4',
    address: '88abck...zzzzzx',
    fullAddress: '88abckqwertyuizzzzzx',
    roles: ['Voter'],
    dateAdded: '24 Mar 2025',
    image: '/member3.svg',
  },
  {
    id: 5,
    name: 'Member 5',
    address: '88abck...zzzzzx',
    fullAddress: '88abckqwertyuizzzzzx',
    roles: ['Voter'],
    dateAdded: '24 Mar 2025',
    image: '/member3.svg',
  },
]

const roleColors: Record<string, string> = {
  Voter: 'text-[#FF7BE9] border-[#FF7BE9] bg-[#FF7BE9]/10',
  Proposer: 'text-[#FF8A25] border-[#FF8A25] bg-[#FF8A25]/10',
  Executer: 'text-[#19B360] border-[#19B360] bg-[#19B360]/10',
}

interface Member {
  id: number
  name: string
  address: string
  fullAddress: string
  roles: string[]
  dateAdded: string
  image: string
}

const Members = () => {
  const [activeTab, setActiveTab] = useState('members')
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null)
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null)
  const [members, setMembers] = useState(initialMembers)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [borderPosition, setBorderPosition] = useState(0)
  const animationRef = useRef<number>(0)

  // Modal state
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const [isEditRolesModalOpen, setIsEditRolesModalOpen] = useState(false)
  const [editRolesMember, setEditRolesMember] = useState<Member | null>(null)

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedMessage('Spherre Address copied!')
    setTimeout(() => setCopiedMessage(null), 3000)
  }

  const toggleDropdown = (id: number) => {
    setDropdownOpen((prev) => (prev === id ? null : id))
  }

  const startEditing = (memberId: number) => {
    const member = members.find((m) => m.id === memberId)
    if (member) {
      setEditingId(memberId)
      setEditName(member.name)
    }
    setDropdownOpen(null)
  }

  const saveName = () => {
    if (editingId !== null && editName.trim()) {
      setMembers(
        members.map((member) =>
          member.id === editingId ? { ...member, name: editName } : member,
        ),
      )
      setEditingId(null)
    }
  }

  const cancelEditing = () => {
    setEditingId(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveName()
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  // Handle remove member button click
  const handleRemoveMember = (member: Member) => {
    setSelectedMember(member)
    setIsRemoveModalOpen(true)
  }

  // Handle modal close
  const handleCloseModal = () => {
    setIsRemoveModalOpen(false)
    setSelectedMember(null)
  }

  // Handle confirm removal
  const handleConfirmRemoval = (memberId: number) => {
    setMembers(members.filter((member) => member.id !== memberId))
    console.log(`Member ${memberId} removed and transaction proposed`)
    // Here you would typically call your blockchain transaction function
  }

  // Snake border animation
  useEffect(() => {
    const animateBorder = () => {
      setBorderPosition((prev) => (prev + 0.5) % 100)
      animationRef.current = requestAnimationFrame(animateBorder)
    }

    if (editingId !== null || copiedMessage !== null) {
      animationRef.current = requestAnimationFrame(animateBorder)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [editingId, copiedMessage])

  const getBorderGradient = () => {
    return `linear-gradient(
      90deg,
      transparent ${borderPosition}%,
      #6F2FCE ${borderPosition}%,
      #6F2FCE ${(borderPosition + 20) % 100}%,
      transparent ${(borderPosition + 20) % 100}%
    )`
  }

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (
      !target.closest('.dropdown-menu') &&
      !target.closest('.dropdown-trigger')
    ) {
      setDropdownOpen(null)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handlePropose = (wallet: string, role: string) => {
    // TODO: Implement your logic here (e.g., add member, call API, etc.)
    console.log('Propose Transaction:', wallet, role)
  }

  const handleEditRoles = (member: Member) => {
    setEditRolesMember(member)
    setIsEditRolesModalOpen(true)
  }

  const handleProposeEditRoles = (roles: string[]) => {
    // TODO: Implement your logic to update roles
    console.log('Propose Edit Roles:', editRolesMember, roles)
  }

  return (
    <div
      className={`${nunito.className} bg-black min-h-screen p-3 sm:p-4 lg:p-5 py-6 sm:py-8 lg:py-10 overflow-x-hidden`}
    >
      <div className="flex flex-col sm:flex-row text-white justify-between border-b-2 relative border-[#292929] gap-4">
        <div className="flex items-center flex-wrap">
          <p
            className={`cursor-pointer px-3 sm:px-4 py-2 text-sm sm:text-base ${activeTab === 'members' ? 'border-b-2 border-white' : 'text-[#8E9BAE]'}`}
            onClick={() => setActiveTab('members')}
          >
            Spherre Members
          </p>
          <p
            className={`cursor-pointer px-3 sm:px-4 py-2 text-sm sm:text-base ${activeTab === 'history' ? 'border-b-2 border-white' : 'text-[#8E9BAE]'}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </p>
        </div>

        <button
          className="rounded-[7px] bg-[#6F2FCE] gap-2 sm:gap-[10px] text-xs sm:text-sm lg:text-[14px] font-medium w-full sm:w-auto h-[40px] sm:h-[45px] flex items-center justify-center p-3 mt-[-10px]"
          onClick={() => setIsAddMemberModalOpen(true)}
        >
          <Image
            src="/user-add.svg"
            alt="member avatar"
            height={20}
            width={20}
            className="sm:h-6 sm:w-6"
          />
          <span> Add Member</span>
        </button>
      </div>

      <div className="text-white mt-4 sm:mt-6">
        {activeTab === 'members' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {members.map((member) => (
              <div
                key={member.id}
                className="min-h-[240px] sm:h-[260px] bg-[#1C1D1F] rounded-[10px] relative"
                style={{
                  zIndex: dropdownOpen === member.id ? 20 : 10,
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-[95%] h-[70px] sm:h-[78px] bg-[#272729] mt-2 justify-between px-2 flex items-center rounded-[7px]">
                    <div className="flex gap-2 sm:gap-3 flex-1 min-w-0">
                      <Image
                        src={member.image}
                        alt="member avatar"
                        height={40}
                        width={40}
                        className="rounded-full flex-shrink-0 sm:h-[50px] sm:w-[50px]"
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        {editingId === member.id ? (
                          <div className="relative">
                            <div
                              className="absolute inset-0 rounded-md"
                              style={{
                                background: getBorderGradient(),
                                padding: '2px',
                                zIndex: 0,
                              }}
                            />
                            <div className="flex items-center gap-2 relative z-10 bg-[#1C1D1F] rounded-md">
                              <input
                                autoFocus
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="bg-[#1F1F22] w-full text-white text-sm sm:text-[16px] px-2 sm:px-3 py-2 rounded-md focus:outline-[#542699]"
                              />
                              <button
                                onClick={saveName}
                                className="p-1 hover:bg-[#6F2FCE]/20 rounded"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 sm:h-5 sm:w-5 text-green-400"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="p-1 hover:bg-[#6F2FCE]/20 rounded"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 sm:h-5 sm:w-5 text-red-400"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-base sm:text-lg lg:text-[20px] text-white font-semibold truncate">
                            {member.name}
                          </p>
                        )}
                        <div className="flex items-center gap-[5px]">
                          <p className="font-semibold text-sm sm:text-[16px] text-[#8E9BAE] truncate">
                            {member.address}
                          </p>
                          <button
                            onClick={() => handleCopy(member.fullAddress)}
                            className="flex-shrink-0"
                          >
                            <Image
                              src="/copy.svg"
                              alt="copy"
                              height={16}
                              width={16}
                              className="rounded-full mt-1 sm:h-[18px] sm:w-[18px]"
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex-shrink-0">
                      <button
                        className="dropdown-trigger"
                        onClick={() => toggleDropdown(member.id)}
                      >
                        <Image
                          src="/dots.svg"
                          alt="dots"
                          height={20}
                          width={20}
                          className="mb-8 sm:mb-12 sm:h-6 sm:w-6"
                        />
                      </button>
                      {dropdownOpen === member.id && (
                        <div className="dropdown-menu absolute z-50 right-0 bg-black mt-[-50px] rounded-lg shadow-lg w-32 sm:w-40 text-xs sm:text-sm text-white px-2 py-2">
                          <ul className="">
                            <li
                              className="px-3 sm:px-4 py-2 rounded-lg hover:bg-[#232323] cursor-pointer"
                              onClick={() => handleEditRoles(member)}
                            >
                              Edit Roles
                            </li>
                            <li
                              className="px-3 sm:px-4 py-2 rounded-lg hover:bg-[#383838] cursor-pointer"
                              onClick={() => startEditing(member.id)}
                            >
                              Edit Name
                            </li>
                            <li className="px-3 sm:px-4 py-2 rounded-lg hover:bg-[#383838] cursor-pointer">
                              Change Picture
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex mt-3 sm:mt-5 ml-3 sm:ml-5 gap-[8px] sm:gap-[10px] flex-wrap">
                  <p className="text-[#8E9BAE] text-xs sm:text-[14px] font-semibold">
                    Roles:
                  </p>
                  {member.roles.map((role) => (
                    <div
                      key={role}
                      className={`flex items-center justify-center text-[10px] sm:text-[12px] px-1 sm:px-2 py-[1px] sm:py-[2px] border-[1px] rounded-3xl ${roleColors[role]}`}
                    >
                      {role}
                    </div>
                  ))}
                </div>

                <div className="flex mt-3 sm:mt-5 ml-3 sm:ml-4 gap-[8px] sm:gap-[10px]">
                  <p className="text-[#8E9BAE] text-xs sm:text-[14px] font-semibold">
                    Date added:
                  </p>
                  <p className="text-white text-sm sm:text-[16px] font-semibold">
                    {member.dateAdded}
                  </p>
                </div>

                <div className="flex items-center justify-center mt-3 sm:mt-5">
                  <button
                    className="bg-[#272729] rounded-[7px] flex items-center justify-center font-medium text-xs sm:text-[14px] text-white w-[90%] h-[32px] sm:h-[36px] hover:bg-[#353538] transition-colors"
                    onClick={() => handleRemoveMember(member)}
                  >
                    Remove member
                  </button>
                </div>
              </div>
            ))}

            {/* Add Member Box */}
            <div
              className="min-h-[240px] sm:h-[260px] bg-[#1C1D1F] flex flex-col gap-4 sm:gap-5 items-center justify-center rounded-[10px] cursor-pointer"
              onClick={() => setIsAddMemberModalOpen(true)}
            >
              <div className="size-[40px] sm:size-[51px] rounded-full flex items-center justify-center bg-[#00000040]/25">
                <Image
                  src="/cross.svg"
                  alt="cross logo"
                  height={18}
                  width={18}
                  className="sm:h-[23px] sm:w-[23px]"
                />
              </div>
              <p
                className="text-sm sm:text-[16px] font-semibold text-[#8E9BAE] cursor-pointer text-center"
                onClick={() => setIsAddMemberModalOpen(true)}
              >
                Add Member
              </p>
            </div>
          </div>
        )}
      </div>

      {copiedMessage && (
        <div
          className="fixed bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50"
          style={{
            background: `
              linear-gradient(#272729) padding-box,
              ${getBorderGradient()} border-box
            `,
            border: '2px solid transparent',
            color: 'white',
          }}
        >
          {copiedMessage}
        </div>
      )}

      <RemoveMemberModal
        isOpen={isRemoveModalOpen}
        member={selectedMember}
        onClose={handleCloseModal}
        onConfirm={handleConfirmRemoval}
      />

      {isAddMemberModalOpen && (
        <AddMemberModal
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          onPropose={handlePropose}
        />
      )}

      <EditMemberRolesModal
        isOpen={isEditRolesModalOpen}
        member={editRolesMember}
        onClose={() => setIsEditRolesModalOpen(false)}
        onPropose={handleProposeEditRoles}
      />
    </div>
  )
}

export default Members
