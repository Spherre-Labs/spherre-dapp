import React, { useState } from 'react'
import Image from 'next/image'

const roleOptions = [
  {
    name: 'Voter',
    color: 'border-[#FF7BE9] text-[#FF7BE9] bg-[#FF7BE9]/10',
    check: 'bg-[#FF7BE9]',
  },
  {
    name: 'Proposer',
    color: 'border-[#FF8A25] text-[#FF8A25] bg-[#FF8A25]/10',
    check: 'bg-[#FF8A25]',
  },
  {
    name: 'Executer',
    color: 'border-[#19B360] text-[#19B360] bg-[#19B360]/10',
    check: 'bg-[#19B360]',
  },
]

interface Member {
  id: number
  name: string
  address: string
  fullAddress: string
  roles: string[]
  dateAdded: string
  image: string
}

interface EditMemberRolesModalProps {
  isOpen: boolean
  member: Member | null
  onClose: () => void
  onPropose: (roles: string[]) => void
}

const EditMemberRolesModal: React.FC<EditMemberRolesModalProps> = ({
  isOpen,
  member,
  onClose,
  onPropose,
}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    member?.roles || [],
  )

  React.useEffect(() => {
    setSelectedRoles(member?.roles || [])
  }, [member])

  if (!isOpen || !member) return null

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-[#18191d] rounded-xl p-4 sm:p-8 w-full max-w-[320px] sm:max-w-[580px] relative shadow-lg">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 sm:top-5 sm:right-5 text-[#8E9BAE] text-xl sm:text-2xl font-bold hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {/* Title */}
        <h2 className="text-xl sm:text-3xl font-bold text-white text-center mb-3 sm:mb-4">
          Edit Member Roles
        </h2>
        {/* Avatar */}
        <div className="flex flex-col items-center mb-2">
          <div className="rounded-full border-4 border-[#a259ff] p-1 mb-2">
            <Image
              src={member.image}
              alt="avatar"
              width={60}
              height={60}
              className="rounded-full sm:w-[90px] sm:h-[90px]"
            />
          </div>
          <div className="text-lg sm:text-2xl text-white font-semibold">
            {member.name}
          </div>
        </div>
        {/* Address */}
        <div className="w-full bg-[#23242a] text-[#8E9BAE] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-center mb-4 sm:mb-6 break-all text-xs sm:text-base">
          {member.fullAddress}
        </div>
        {/* Assign Roles */}
        <label className="block text-white mb-2 text-sm sm:text-base">
          Assign Roles
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2">
          {roleOptions.map((role) => {
            const checked = selectedRoles.includes(role.name)
            return (
              <button
                key={role.name}
                type="button"
                className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-2 font-semibold text-base sm:text-lg transition-colors
                  ${checked ? role.color + ' border-2' : 'border-[#23242a] text-[#8E9BAE] bg-transparent'}
                `}
                onClick={() => toggleRole(role.name)}
              >
                {role.name}
                {checked && (
                  <span
                    className={`ml-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${role.check}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M5 10.5L9 14.5L15 7.5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6 sm:mt-8">
          <button
            className="w-full sm:flex-1 bg-[#23242a] text-white py-2 sm:py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#23242a] transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="w-full sm:flex-1 bg-[#a259ff] text-white py-2 sm:py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#7c3aed]"
            disabled={selectedRoles.length === 0}
            onClick={() => {
              onPropose(selectedRoles)
              onClose()
            }}
          >
            Propose Transaction
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditMemberRolesModal
