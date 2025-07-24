import React, { useState } from 'react'

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onPropose: (wallet: string, role: string) => void
}

const roles = ['Voter', 'Proposer', 'Executer']

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onPropose,
}) => {
  const [wallet, setWallet] = useState('')
  const [role, setRole] = useState('')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-theme-bg-secondary border border-theme-border rounded-xl p-4 sm:p-8 w-full max-w-[95vw] sm:max-w-[500px] md:max-w-[600px] relative shadow-lg transition-colors duration-300">
        {/* Close button */}
        <button
          className="absolute top-5 right-5 text-theme-secondary text-2xl font-bold hover:text-theme transition-colors duration-200"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {/* Title */}
        <h2 className="text-3xl font-bold text-theme text-center mb-2">
          Add Member
        </h2>
        {/* Subtitle */}
        <p className="text-theme-secondary text-center mb-7">
          Simply input the correct information to add a member to your account.
        </p>
        {/* Wallet Address */}
        <label className="block text-theme mb-3">Wallet Address</label>
        <input
          className="w-full p-3 mb-6 rounded bg-theme-bg-tertiary text-theme placeholder-theme-muted outline-none border border-theme-border focus:border-primary transition-colors duration-200"
          placeholder="Enter wallet address"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
        />
        {/* Assign Roles */}
        <div className="mb-8">
          <label className="block text-theme mb-2">Assign Roles</label>
          <div className="flex gap-4">
            {roles.map((r) => {
              let borderColor = ''
              let accentColor = ''
              if (role === r) {
                if (r === 'Voter') {
                  borderColor = 'border-[#FF7BE9]'
                  accentColor = 'accent-[#FF7BE9]'
                } else if (r === 'Executer') {
                  borderColor = 'border-green'
                  accentColor = 'accent-green'
                } else if (r === 'Proposer') {
                  borderColor = 'border-[#FF8A25]'
                  accentColor = 'accent-[#FF8A25]'
                }
              } else {
                borderColor = 'border-theme-border'
                accentColor = 'accent-primary'
              }
              return (
                <label
                  key={r}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-200 cursor-pointer text-sm font-medium ${borderColor} ${role === r
                      ? 'text-theme bg-theme-bg-tertiary'
                      : 'text-theme-secondary bg-transparent hover:bg-theme-bg-tertiary/50'
                    }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={() => setRole(r)}
                    className={`${accentColor}`}
                  />
                  {r}
                </label>
              )
            })}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-8">
          <button
            className="w-full sm:flex-1 bg-theme-bg-tertiary border border-theme-border text-theme text-sm sm:text-base font-medium py-2 sm:py-3 rounded-[8px] sm:rounded-lg hover:bg-theme-bg-secondary transition-colors duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="w-full sm:flex-1 bg-primary text-white text-sm sm:text-base font-medium py-2 sm:py-3 rounded-[8px] sm:rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!wallet || !role}
            onClick={() => {
              onPropose(wallet, role)
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

export default AddMemberModal
