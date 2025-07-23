import React, { useState } from 'react'

const roles = ['Voter', 'Proposer', 'Executor']

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onPropose: (wallet: string, selectedRoles: string[]) => void
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onPropose,
}) => {
  const [wallet, setWallet] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['Voter', 'Proposer', 'Executor']) // All roles by default

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  const handleSubmit = () => {
    if (wallet.trim() && selectedRoles.length > 0) {
      onPropose(wallet.trim(), selectedRoles)
      setWallet('')
      setSelectedRoles(['Voter', 'Proposer', 'Executor']) // Reset to all roles
    }
  }

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
          <label className="block text-theme mb-4">Assign Roles</label>
          <div className="flex flex-wrap items-center gap-3">
            {roles.map((role) => {
              const isSelected = selectedRoles.includes(role)
              let borderColor = ''
              let bgColor = ''
              let textColor = ''
              
              if (isSelected) {
                if (role === 'Voter') {
                  borderColor = 'border-[#FF7BE9]'
                  bgColor = 'bg-[#FF7BE9]/10'
                  textColor = 'text-[#FF7BE9]'
                } else if (role === 'Executor') {
                  borderColor = 'border-[#19B360]'
                  bgColor = 'bg-[#19B360]/10'
                  textColor = 'text-[#19B360]'
                } else if (role === 'Proposer') {
                  borderColor = 'border-[#FF8A25]'
                  bgColor = 'bg-[#FF8A25]/10'
                  textColor = 'text-[#FF8A25]'
                }
              } else {
                borderColor = 'border-theme-border'
                bgColor = 'bg-transparent'
                textColor = 'text-theme-secondary'
              }
              
              return (
                <label
                  key={role}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 cursor-pointer ${borderColor} ${bgColor} ${
                    isSelected
                      ? textColor
                      : 'hover:bg-theme-bg-tertiary/50'
                  }`}
                  onClick={() => toggleRole(role)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleRole(role)}
                    className="sr-only"
                  />
                  
                  {/* Custom checkbox */}
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                    isSelected 
                      ? role === 'Voter' 
                        ? 'bg-[#FF7BE9] border-[#FF7BE9]'
                        : role === 'Proposer'
                        ? 'bg-[#FF8A25] border-[#FF8A25]'
                        : 'bg-[#19B360] border-[#19B360]'
                      : 'border-theme-border bg-transparent'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  <span className="font-medium">{role}</span>
                </label>
              )
            })}
          </div>
          
          {/* Helper text */}
          <p className="text-sm text-theme-secondary mt-3">
            By default, all members are assigned all three roles. You can modify individual roles by unchecking them above.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            className="flex-1 bg-theme-bg-tertiary text-theme py-3 rounded-lg hover:bg-theme-bg-tertiary/80 transition-colors font-medium border border-theme-border"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`flex-1 py-3 rounded-lg transition-colors font-medium ${
              wallet.trim() && selectedRoles.length > 0
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-theme-bg-tertiary text-theme-secondary cursor-not-allowed'
            }`}
            onClick={handleSubmit}
            disabled={!wallet.trim() || selectedRoles.length === 0}
          >
            Propose Addition
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddMemberModal
