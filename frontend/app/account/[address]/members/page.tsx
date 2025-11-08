'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/app/context/theme-context-provider'
import {
  useGetAccountMembers,
  useProposeMemberAdd,
  useProposeMemberRemove,
  useProposeEditPermission,
} from '@/hooks/useSpherreHooks'
import { useSpherreAccount } from '@/app/context/account-context'
import AddMemberModal from './components/add-modal'
import MemberDetailsModal from './components/member-details-modal'
import { MemberDetailsType } from './components/member-details-modal'
import EditMemberRolesModal from './components/edit-roles-modal'
import ProcessingModal from '../../../components/modals/Loader'
import SuccessModal from '../../../components/modals/SuccessModal'
import {
  createPermissionMask,
  ALL_PERMISSIONS_MASK,
  feltToAddress,
} from '@/lib/utils/validation'
import MemberCard from './components/member-card'
import { Skeleton } from '@/components/ui/skeleton'

interface Member {
  id: number
  name: string
  address: string
  fullAddress: string
  dateAdded: string
  image: string
  permissions: string[]
  permissionMask: number
}

const ZERO_ADDRESS =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

const Members = () => {
  useTheme()
  const router = useRouter()
  const { accountAddress } = useSpherreAccount()

  const [members, setMembers] = useState<Member[]>([])
  const [borderPosition, setBorderPosition] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditRolesModalOpen, setIsEditRolesModalOpen] = useState(false)
  const [editRolesMember, setEditRolesMember] = useState<Member | null>(null)
  const [memberDetails, setMemberDetails] = useState<MemberDetailsType | null>(
    null,
  )
  const [isMemberDetailsOpen, setIsMemberDetailsOpen] = useState(false)

  // Transaction modals state
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [processingTitle, setProcessingTitle] = useState(
    'Processing Transaction!',
  )
  const [processingSubtitle, setProcessingSubtitle] = useState(
    'Please exercise a little patience as we process your details',
  )
  const [successTitle, setSuccessTitle] = useState('Successful Transaction!')
  const [successMessage, setSuccessMessage] = useState(
    'Congratulations! your transaction has been successfully confirmed and been sent to other members of the team for approval',
  )

  const accountReady = Boolean(accountAddress)

  // Smart contract hooks
  const {
    data: contractMembers,
    isLoading,
    error,
    refetch,
  } = useGetAccountMembers(accountAddress ?? '0x0')

  const { writeAsync: proposeMemberAdd } = useProposeMemberAdd(
    accountAddress ?? '0x0',
  )
  const { writeAsync: proposeMemberRemove } = useProposeMemberRemove(
    accountAddress ?? '0x0',
  )
  const { writeAsync: proposeEditPermission } = useProposeEditPermission(
    accountAddress ?? '0x0',
  )

  // Transform contract members (base data only; MemberCard fetches permissions/dates)
  const transformedMembers = useMemo(() => {
    if (!contractMembers || contractMembers.length === 0) return []

    return contractMembers
      .map((memberFelt: string, index: number) => {
        let memberAddress: string
        try {
          memberAddress = feltToAddress(memberFelt)
        } catch (error) {
          console.warn('Failed to convert felt to address:', memberFelt, error)
          memberAddress = memberFelt
        }

        if (memberAddress.toLowerCase() === ZERO_ADDRESS) {
          return null
        }

        const truncatedAddress =
          memberAddress.length > 10
            ? `${memberAddress.slice(0, 6)}...${memberAddress.slice(-4)}`
            : memberAddress

        // Placeholder roles/mask/date for layout; MemberCard replaces with real data
        const roles: string[] = []
        const permissionMask = ALL_PERMISSIONS_MASK
        const avatarIndex = (index % 3) + 1
        const image = `/member${avatarIndex}.svg`

        return {
          id: index + 1,
          name: `Member ${index + 1}`,
          address: truncatedAddress,
          fullAddress: memberAddress,
          roles,
          dateAdded: '—',
          image,
          permissions: roles,
          permissionMask,
        } as Member
      })
      .filter((member): member is Member => member !== null)
  }, [contractMembers])

  // Update members when transformed members change
  useEffect(() => {
    setMembers(transformedMembers)
  }, [transformedMembers])

  // Animated border gradient util (memoized)
  const getBorderGradient = useCallback(() => {
    return `linear-gradient(
      90deg,
      transparent ${borderPosition}%,
      #6F2FCE ${borderPosition}%,
      #6F2FCE ${(borderPosition + 20) % 100}%,
      transparent ${(borderPosition + 20) % 100}%
    )`
  }, [borderPosition])

  // Click outside to close dropdown
  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (
      !target.closest('.dropdown-menu') &&
      !target.closest('.dropdown-trigger')
    ) {
      setDropdownOpen(null)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  // Border animation ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setBorderPosition((prev) => (prev + 2) % 100)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Session-gated skeleton (show once per session for 5s max)
  const [minSkeletonElapsed, setMinSkeletonElapsed] = useState(false)
  useEffect(() => {
    try {
      const done = sessionStorage.getItem('membersSkeletonShown') === 'true'
      if (done) {
        setMinSkeletonElapsed(true)
        return
      }
    } catch {}

    const id = setTimeout(() => {
      setMinSkeletonElapsed(true)
      try {
        sessionStorage.setItem('membersSkeletonShown', 'true')
      } catch {}
    }, 5000)
    return () => clearTimeout(id)
  }, [])

  const handleCopy = useCallback(async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopiedMessage('Spherre Address copied!')
      setTimeout(() => setCopiedMessage(null), 3000)
    } catch {
      setCopiedMessage('Failed to copy address')
      setTimeout(() => setCopiedMessage(null), 3000)
    }
  }, [])

  const handlePropose = useCallback(
    async (wallet: string, selectedRoles: string[]) => {
      try {
        setIsAddModalOpen(false)
        setIsProcessingModalOpen(true)
        setProcessingTitle('Proposing Member Addition!')
        setProcessingSubtitle(
          'Please wait while we process the member addition proposal...',
        )

        const permissions = selectedRoles.map((role) => {
          switch (role) {
            case 'Voter':
              return 'VOTER'
            case 'Proposer':
              return 'PROPOSER'
            case 'Executor':
              return 'EXECUTOR'
            default:
              return 'VOTER'
          }
        }) as ('VOTER' | 'PROPOSER' | 'EXECUTOR')[]

        const permissionMask = createPermissionMask(permissions)

        await proposeMemberAdd({
          member: wallet,
          permissions: permissionMask,
        })

        setIsProcessingModalOpen(false)
        setIsSuccessModalOpen(true)
        setSuccessTitle('Member Addition Proposed!')
        setSuccessMessage(
          'The member addition proposal has been successfully created and sent to other members for approval.',
        )

        refetch()
      } catch (error) {
        setIsProcessingModalOpen(false)
        console.error('Error proposing member addition:', error)
      }
    },
    [proposeMemberAdd, refetch],
  )

  const handleEditRoles = useCallback((member: Member) => {
    setEditRolesMember(member)
    setIsEditRolesModalOpen(true)
  }, [])

  const handleProposeEditRoles = useCallback(
    async (selectedRoles: string[]) => {
      if (!editRolesMember) return
      try {
        setIsEditRolesModalOpen(false)
        setIsProcessingModalOpen(true)
        setProcessingTitle('Proposing Role Changes!')
        setProcessingSubtitle(
          'Please wait while we process the role change proposal...',
        )

        const permissions = selectedRoles.map((role) => {
          switch (role) {
            case 'Voter':
              return 'VOTER'
            case 'Proposer':
              return 'PROPOSER'
            case 'Executor':
              return 'EXECUTOR'
            default:
              return 'VOTER'
          }
        }) as ('VOTER' | 'PROPOSER' | 'EXECUTOR')[]

        const newPermissionMask = createPermissionMask(permissions)

        await proposeEditPermission({
          member: editRolesMember.fullAddress,
          new_permissions: newPermissionMask,
        })

        setIsProcessingModalOpen(false)
        setIsSuccessModalOpen(true)
        setSuccessTitle('Role Changes Proposed!')
        setSuccessMessage(
          'The role change proposal has been successfully created and sent to other members for approval.',
        )

        refetch()
      } catch (error) {
        setIsProcessingModalOpen(false)
        console.error('Error proposing role edit:', error)
      }
    },
    [editRolesMember, proposeEditPermission, refetch],
  )

  const handleRemoveMember = useCallback(
    async (member: Member) => {
      try {
        setDropdownOpen(null)
        setIsProcessingModalOpen(true)
        setProcessingTitle('Proposing Member Removal!')
        setProcessingSubtitle(
          'Please wait while we process the member removal proposal...',
        )

        await proposeMemberRemove({
          member_address: member.fullAddress,
        })

        setIsProcessingModalOpen(false)
        setIsSuccessModalOpen(true)
        setSuccessTitle('Member Removal Proposed!')
        setSuccessMessage(
          'The member removal proposal has been successfully created and sent to other members for approval.',
        )

        refetch()
      } catch (error) {
        setIsProcessingModalOpen(false)
        console.error('Error proposing member removal:', error)
      }
    },
    [proposeMemberRemove, refetch],
  )

  const handleViewTransaction = useCallback(() => {
    setIsSuccessModalOpen(false)
    if (accountAddress) {
      router.push(`/${accountAddress}/transactions`)
    }
  }, [router, accountAddress])

  if (!accountReady) {
    return (
      <div className="overflow-x-hidden transition-colors duration-300">
        <div className="flex items-center justify-center h-64">
          <div className="text-theme text-lg">Loading account…</div>
        </div>
      </div>
    )
  }

  if (isLoading || !minSkeletonElapsed) {
    return (
      <div className="overflow-x-hidden transition-colors duration-300 p-4 sm:p-6 lg:p-8">
        <div className="bg-theme-bg-tertiary border border-theme-border rounded-lg p-4 sm:p-6">
          <div className="h-6 w-48 bg-theme-bg-secondary rounded animate-pulse mb-6 mx-1" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-60 w-full rounded-lg bg-theme-bg-secondary mx-1"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="overflow-x-hidden transition-colors duration-300">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-lg">
            Error loading members: {error.message}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-hidden transition-colors duration-300">
      <div className="flex flex-col sm:flex-row text-theme justify-between border-b-2 relative border-theme-border gap-4">
        <div className="flex items-center flex-wrap">
          <p className="cursor-pointer px-3 sm:px-4 py-2 text-sm sm:text-base transition-colors duration-200 border-b-2 border-theme text-theme">
            Spherre Members
          </p>
          <p className="cursor-pointer px-3 sm:px-4 py-2 text-sm sm:text-base transition-colors duration-200 text-theme-secondary hover:text-theme">
            History
          </p>
        </div>

        <button
          className="rounded-[7px] bg-primary gap-2 sm:gap-[10px] text-xs sm:text-sm lg:text-[14px] font-medium w-full sm:w-auto h-[40px] sm:h-[45px] flex items-center justify-center p-3 mt-[-10px] hover:opacity-90 transition-opacity duration-200 text-white"
          onClick={() => setIsAddModalOpen(true)}
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

      <div className="text-theme mt-4 sm:mt-6">
        <div className="flex flex-wrap gap-2">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              dropdownOpen={dropdownOpen}
              setMemberDetails={setMemberDetails}
              setIsMemberDetailsOpen={setIsMemberDetailsOpen}
              getBorderGradient={getBorderGradient}
              editName={editName}
              setEditName={setEditName}
              handleCopy={handleCopy}
              setDropdownOpen={setDropdownOpen}
              handleRemoveMember={handleRemoveMember}
              handleEditRoles={handleEditRoles}
            />
          ))}

          {/* Add Member Box */}
          <div
            className="w-full sm:w-[48.8%] lg:w-[32.8%] min-h-[240px] sm:h-[260px] bg-theme-bg-secondary border border-theme-border flex flex-col gap-4 sm:gap-5 items-center justify-center rounded-[10px] cursor-pointer hover:bg-theme-bg-tertiary transition-colors duration-300"
            onClick={() => setIsAddModalOpen(true)}
          >
            <div className="size-[40px] sm:size-[51px] rounded-full flex items-center justify-center bg-theme-bg-tertiary border border-theme-border">
              <Image
                src="/cross.svg"
                alt="cross logo"
                height={18}
                width={18}
                className="sm:h-[23px] sm:w-[23px]"
              />
            </div>
            <p
              className="text-sm sm:text-[16px] font-semibold text-theme-secondary cursor-pointer text-center hover:text-theme transition-colors duration-200"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Member
            </p>
          </div>
        </div>
      </div>

      {copiedMessage && (
        <div
          className="fixed bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 text-theme"
          style={{
            background: `
              linear-gradient(var(--theme-bg-tertiary)) padding-box,
              ${getBorderGradient()} border-box
            `,
            border: '2px solid transparent',
          }}
        >
          {copiedMessage}
        </div>
      )}

      {/* Modals */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPropose={handlePropose}
      />

      <EditMemberRolesModal
        isOpen={isEditRolesModalOpen}
        member={editRolesMember}
        onClose={() => setIsEditRolesModalOpen(false)}
        onPropose={handleProposeEditRoles}
      />

      <ProcessingModal
        isOpen={isProcessingModalOpen}
        onClose={() => setIsProcessingModalOpen(false)}
        title={processingTitle}
        subtitle={processingSubtitle}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onViewTransaction={handleViewTransaction}
        title={successTitle}
        message={successMessage}
      />

      {/* Member Details Modal */}
      <MemberDetailsModal
        isOpen={isMemberDetailsOpen}
        onClose={() => setIsMemberDetailsOpen(false)}
        accountAddress={accountAddress!}
        member={memberDetails}
      />
    </div>
  )
}

export default Members
