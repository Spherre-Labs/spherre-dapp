import Image from 'next/image'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { MemberDetailsType } from './member-details-modal'
import { useGetMemberFullDetails, useGetMemberPermissions } from '@/lib'
import { SpherreAccountContext } from '@/app/context/account-context'

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

type Props = {
  member: Member
  dropdownOpen: number | null
  setMemberDetails: (details: MemberDetailsType) => void
  setIsMemberDetailsOpen: (val: boolean) => void
  getBorderGradient: () => string
  editName: string
  setEditName: (val: string) => void
  handleCopy: (add: string) => void
  setDropdownOpen: React.Dispatch<React.SetStateAction<number | null>>
  handleRemoveMember: (member: Member) => void
  handleEditRoles: (member: Member) => void
}

function MemberCardBase({
  member,
  dropdownOpen,
  setMemberDetails,
  setIsMemberDetailsOpen,
  getBorderGradient,
  editName,
  setEditName,
  handleCopy,
  setDropdownOpen,
  handleRemoveMember,
  handleEditRoles,
}: Props) {
  const { accountAddress } = useContext(SpherreAccountContext)
  const perms = useGetMemberPermissions(
    accountAddress || '0x0',
    (member.fullAddress || '0x0') as `0x${string}`,
  )

  console.log(perms)
  const { data: fullDetails } = useGetMemberFullDetails(
    accountAddress || '0x0',
    (member.fullAddress || '0x0') as `0x${string}`,
  )

  const joinedAt = useMemo(() => {
    console.log(fullDetails, 'hhh')
    const ts = fullDetails?.date_joined
    if (!ts) return ''
    try {
      const ms = Number(ts) * 1000
      return new Date(ms).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return ''
    }
  }, [fullDetails?.date_joined])

  const [editingId, setEditingId] = useState<number | null>(null)

  const gradientBorder = useMemo(() => getBorderGradient(), [getBorderGradient])

  const toggleDropdown = useCallback(
    (id: number | null) => {
      setDropdownOpen((prev) => (prev === id ? null : id))
    },
    [setDropdownOpen],
  )

  const startEditing = useCallback(
    (memberId: number) => {
      setEditingId(memberId)
      setEditName(member.name)
      setDropdownOpen(null)
    },
    [member.name, setEditName, setDropdownOpen],
  )

  const openDetails = useCallback(() => {
    setMemberDetails({
      id: member.id,
      name: member.name,
      address: member.address,
      fullAddress: member.fullAddress,
    })
    setIsMemberDetailsOpen(true)
  }, [member, setMemberDetails, setIsMemberDetailsOpen])

  const onCardClick: React.MouseEventHandler<HTMLDivElement> =
    useCallback(() => {
      // If currently editing name, don’t open details on card click.
      if (editingId !== member.id) openDetails()
    }, [editingId, member.id, openDetails])

  const dropdownId = `member-menu-${member.id}`
  const isMenuOpen = dropdownOpen === member.id

  const roleStyleMap: Record<string, string> = useMemo(
    () => ({
      Voter: 'bg-[#FF7BE9]/10 text-[#FF7BE9] border-[#FF7BE9]',
      Proposer: 'bg-[#FF8A25]/10 text-[#FF8A25] border-[#FF8A25]',
      Executor: 'bg-[#19B360]/10 text-[#19B360] border-[#19B360]',
    }),
    [],
  )

  const loadError = perms.error
  const isLoading = perms.isLoading

  return (
    <div
      className="w-full sm:w-[48.8%] lg:w-[32.8%] min-h-[240px] sm:min-h-[260px] bg-theme-bg-secondary border border-theme-border rounded-[10px] relative transition-colors duration-300 pt-6 px-6 mb-2"
      style={{ zIndex: isMenuOpen ? 20 : 10 }}
      onClick={onCardClick}
    >
      {/* Header section with avatar and name */}
      <div className="flex flex-col items-center">
        <div className="w-full h-[70px] sm:h-[78px] bg-theme-bg-tertiary justify-between px-2 flex items-center rounded-[7px] border border-theme-border">
          <div className="flex gap-2 sm:gap-3 flex-1 min-w-0">
            <Image
              src={member.image}
              alt={`${member.name} avatar`}
              height={40}
              width={40}
              className="rounded-full flex-shrink-0 sm:h/[50px] sm:w/[50px] sm:h-[50px] sm:w-[50px]"
            />

            <div className="flex flex-col min-w-0 flex-1">
              {editingId === member.id ? (
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <div
                    className="absolute inset-0 rounded-md"
                    style={{
                      background: gradientBorder,
                      padding: '2px',
                      zIndex: 0,
                    }}
                  />
                  <div className="flex items-center gap-2 relative z-10 bg-theme-bg-secondary rounded-md">
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === 'Escape') {
                          setEditingId(null)
                        }
                      }}
                      className="bg-theme-bg-tertiary w-full text-theme text-sm sm:text-[16px] px-2 sm:px-3 py-2 rounded-md focus:outline-primary border border-theme-border"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingId(null)
                      }}
                      className="p-1 hover:bg-primary/20 rounded"
                      aria-label="Confirm name edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1   1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingId(null)
                      }}
                      className="p-1 hover:bg-primary/20 rounded"
                      aria-label="Cancel name edit"
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
                <p className="text-base sm:text-lg lg:text-[20px] text-theme font-semibold truncate">
                  {member.name}
                </p>
              )}

              <div className="flex items-center gap-[5px]">
                <p className="font-semibold text-sm sm:text-[16px] text-theme-secondary truncate">
                  {member.address}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopy(member.fullAddress)
                  }}
                  className="flex-shrink-0"
                  aria-label="Copy address"
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
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              aria-controls={dropdownId}
              onClick={(e) => {
                e.stopPropagation()
                toggleDropdown(member.id)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setDropdownOpen(null)
              }}
            >
              <Image
                src="/dots.svg"
                alt="actions"
                height={20}
                width={20}
                className="mb-8 sm:mb-12 sm:h-6 sm:w-6"
              />
            </button>

            {isMenuOpen && (
              <div
                id={dropdownId}
                className="dropdown-menu absolute z-50 right-0 bg-theme-bg-tertiary border border-theme-border mt-[-50px] rounded-lg shadow-lg w-32 sm:w-40 text-xs sm:text-sm text-theme px-2 py-2"
                role="menu"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setDropdownOpen(null)
                }}
              >
                <ul>
                  <li
                    role="menuitem"
                    tabIndex={0}
                    className="px-3 sm:px-4 py-2 rounded-lg hover:bg-theme-bg-secondary cursor-pointer transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditRoles(member)
                      setDropdownOpen(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEditRoles(member)
                        setDropdownOpen(null)
                      }
                    }}
                  >
                    Edit Roles
                  </li>
                  <li
                    role="menuitem"
                    tabIndex={0}
                    className="px-3 sm:px-4 py-2 rounded-lg hover:bg-theme-bg-secondary cursor-pointer transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation()
                      startEditing(member.id)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') startEditing(member.id)
                    }}
                  >
                    Edit Name
                  </li>
                  <li
                    role="menuitem"
                    tabIndex={0}
                    className="px-3 sm:px-4 py-2 rounded-lg hover:bg-theme-bg-secondary cursor-pointer transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveMember(member)
                      setDropdownOpen(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRemoveMember(member)
                        setDropdownOpen(null)
                      }
                    }}
                  >
                    Remove Member
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Roles section */}
      <div className="flex mt-4 sm:mt-5 gap-[8px] sm:gap-[10px] flex-wrap">
        <p className="text-theme-secondary text-xs sm:text-[14px] font-semibold">
          Roles:
        </p>
        {(perms.permissions || []).map((role) => {
          const roleStyle = roleStyleMap[role] ?? ''
          return (
            <div
              key={role}
              className={`flex items-center justify-center text-[10px] sm:text-[12px] px-1 sm:px-2 py-[1px] sm:py-[2px] border-[1px] rounded-3xl ${roleStyle}`}
            >
              {role}
            </div>
          )
        })}
      </div>

      {/* Date added section */}
      <div className="flex mt-3 sm:mt-4 gap-[8px] sm:gap-[10px]">
        <p className="text-theme-secondary text-xs sm:text-[14px] font-semibold">
          Date added:
        </p>
        <p className="text-theme text-sm sm:text-[16px] font-semibold">
          {joinedAt}
        </p>
      </div>

      {/* Remove button section */}
      <div className="flex items-center justify-center mt-4 sm:mt-5">
        <button
          className="bg-theme-bg-tertiary border border-theme-border rounded-[7px] flex items-center justify-center font-medium text-xs sm:text-[14px] text-theme w-full h-[32px] sm:h-[36px] hover:bg-theme-bg-secondary transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation()
            handleRemoveMember(member)
          }}
        >
          Remove member
        </button>
      </div>

      {/* Content states */}
      {isLoading && (
        <div className="text-theme-secondary text-sm">
          Loading member details…
        </div>
      )}
      {loadError && !isLoading && (
        <div className="text-red-500 text-sm">
          Unable to load member details. Please try again later.
        </div>
      )}
    </div>
  )
}

const MemberCard = React.memo(MemberCardBase)
export default MemberCard
