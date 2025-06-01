import React from 'react'
import Image from 'next/image'

interface Member {
  id: number
  name: string
  address: string
  fullAddress: string
  roles: string[]
  dateAdded: string
  image: string
}

interface RemoveMemberModalProps {
  isOpen: boolean
  member: Member | null
  onClose: () => void
  onConfirm: (memberId: number) => void
}

const RemoveMemberModal: React.FC<RemoveMemberModalProps> = ({
  isOpen,
  member,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !member) return null

  const roleColors = {
    Voter: 'text-[#FF7BE9] border-[#FF7BE9] bg-[#FF7BE9]/10',
    Proposer: 'text-[#FF8A25] border-[#FF8A25] bg-[#FF8A25]/10',
    Executer: 'text-[#19B360] border-[#19B360] bg-[#19B360]/10',
  }

  const handleCancel = () => {
    onClose()
  }

  const handleProposeTransaction = () => {
    onConfirm(member.id)
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4  "
      onClick={handleBackdropClick}
    >
      <div
        className="bg-[#1C1D1F] rounded-[12px] w-full max-w-[480px] p-8 relative border-[#292929] border-[2px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-200 bg-[#697281] hover:text-white transition-colors rounded-full p-1"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-white text-[32px] font-bold mb-3">
            Remove Member
          </h2>
          <p className="text-[#8E9BAE] text-[18px]">
            Are you sure you want to remove this member?
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-r from-[#6F2FCE] to-[#9D4EDD] p-1">
              <div className="w-full h-full rounded-full bg-[#1C1D1F] flex items-center justify-center overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={110}
                  height={110}
                  className="rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-4">
          <h3 className="text-white text-[24px] font-semibold mb-4">
            {member.name}
          </h3>
        </div>

        <div className="bg-[#272729] rounded-[8px] p-4 mb-8">
          <p className="text-[#8E9BAE] text-[14px] font-mono break-all text-center">
            {member.fullAddress}
          </p>
        </div>

        <div className="mb-8">
          <h4 className="text-white text-[18px] font-semibold mb-4">
            Assigned Roles
          </h4>
          <div className="flex gap-3 flex-wrap">
            {member.roles.map((role) => (
              <div
                key={role}
                className={`flex items-center justify-center text-[14px] px-4 py-2 border-[1px] rounded-full font-medium ${roleColors[role as keyof typeof roleColors]}`}
              >
                {role}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 bg-[#272729] text-white text-[16px] font-medium py-4 rounded-[8px] hover:bg-[#353538] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleProposeTransaction}
            className="flex-1 bg-[#6F2FCE] text-white text-[16px] font-medium py-4 rounded-[8px] hover:bg-[#5A25A8] transition-colors"
          >
            Propose Transaction
          </button>
        </div>
      </div>
    </div>
  )
}

export default RemoveMemberModal
