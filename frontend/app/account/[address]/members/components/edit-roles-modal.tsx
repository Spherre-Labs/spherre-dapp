import React, { useState } from 'react'
import Image from 'next/image'
import { useTheme } from '@/app/context/theme-context-provider'

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
    name: 'Executor',
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
  permissionMask: number
}

interface EditMemberRolesModalProps {
  isOpen: boolean
  member: Member | null
  onClose: () => void
  onPropose: (selectedRoles: string[]) => void
}

const EditMemberRolesModal: React.FC<EditMemberRolesModalProps> = ({
  isOpen,
  member,
  onClose,
  onPropose,
}) => {
  useTheme()
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    member?.roles || [],
  )

  React.useEffect(() => {
    setSelectedRoles(member?.roles || [])
  }, [member])

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    )
  }

  const handleSubmit = () => {
    if (selectedRoles.length > 0) {
      onPropose(selectedRoles)
    }
  }

  if (!isOpen || !member) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-theme-bg-secondary border border-theme-border rounded-xl p-4 sm:p-8 w-full max-w-[320px] sm:max-w-[580px] relative shadow-lg transition-colors duration-300">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 sm:top-5 sm:right-5 text-theme-secondary text-xl sm:text-2xl font-bold hover:text-theme transition-colors duration-200"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-xl sm:text-3xl font-bold text-theme text-center mb-3 sm:mb-4">
          Edit Member Roles
        </h2>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-2">
          <div className="rounded-full border-4 border-primary p-1 mb-2">
            <Image
              src={member.image}
              alt="avatar"
              width={60}
              height={60}
              className="rounded-full sm:w-[90px] sm:h-[90px]"
            />
          </div>
          <div className="text-lg sm:text-2xl text-theme font-semibold">
            {member.name}
          </div>
        </div>

        {/* Address */}
        <div className="text-center mb-6">
          <p className="text-sm text-theme-secondary">{member.address}</p>
        </div>

        {/* Role Selection */}
        <div className="mb-6 sm:mb-8">
          <p className="text-sm sm:text-base text-theme font-medium mb-4">
            Assign Roles:
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {roleOptions.map((roleOption) => {
              const isSelected = selectedRoles.includes(roleOption.name)

              return (
                <label
                  key={roleOption.name}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? roleOption.color
                      : 'border-theme-border bg-transparent text-theme-secondary hover:bg-theme-bg-tertiary/50'
                  }`}
                  onClick={() => toggleRole(roleOption.name)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleRole(roleOption.name)}
                    className="sr-only"
                  />

                  {/* Custom checkbox */}
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                      isSelected
                        ? roleOption.check + ' border-current'
                        : 'border-theme-border bg-transparent'
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  <span className="font-medium">{roleOption.name}</span>
                </label>
              )
            })}
          </div>

          {/* Helper text */}
          <p className="text-xs sm:text-sm text-theme-secondary mt-3">
            Note: Changing member roles will require approval from other members
            before taking effect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 sm:gap-4">
          <button
            className="flex-1 bg-theme-bg-tertiary text-theme py-2 sm:py-3 rounded-lg hover:bg-theme-bg-tertiary/80 transition-colors font-medium border border-theme-border text-sm sm:text-base"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`flex-1 py-2 sm:py-3 rounded-lg transition-colors font-medium text-sm sm:text-base ${
              selectedRoles.length > 0
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-theme-bg-tertiary text-theme-secondary cursor-not-allowed'
            }`}
            onClick={handleSubmit}
            disabled={selectedRoles.length === 0}
          >
            Propose Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditMemberRolesModal
