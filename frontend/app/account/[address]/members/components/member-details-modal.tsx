'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import {
  useGetMemberPermissions,
  useMemberAddTransactionList,
  useMemberRemovalTransactionList,
  useEditPermissionTransactionList,
  useGetMemberFullDetails,
} from '@/hooks/useSpherreHooks'
import { getAvatarUrl } from '@/lib/utils/transaction-utils'
import { X } from 'lucide-react'
import Image from 'next/image'

export type MemberDetailsType = {
  id: number
  name: string
  address: string
  fullAddress: string
  proposed?: number
  approved?: number
  rejected?: number
  executed?: number
  joinedAt?: string
  image?: string
}

interface MemberDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  accountAddress: `0x${string}`
  member: MemberDetailsType | null
}

export default function MemberDetailsModal({
  isOpen,
  onClose,
  accountAddress,
  member,
}: MemberDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (
        modalRef.current &&
        e.target instanceof Node &&
        !modalRef.current.contains(e.target)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, onClose])

  const memberAddress = useMemo(
    () => (member?.fullAddress ? (member.fullAddress as `0x${string}`) : undefined),
    [member?.fullAddress],
  )

  // Smart contract reads
  const perms = useGetMemberPermissions(
    accountAddress,
    (memberAddress || '0x0') as `0x${string}`,
  )

  const { data: fullDetails } = useGetMemberFullDetails(
    accountAddress,
    (memberAddress || '0x0') as `0x${string}`,
  )

  const joinedAt = useMemo(() => {
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

  const avatarSrc = useMemo(() => {
    if (!member) return '/Images/profile2.png'
    return member.image && member.image.trim().length > 0
      ? member.image
      : getAvatarUrl(member.fullAddress)
  }, [member])
  console.log(avatarSrc)

  const memberStats = useMemo((): { label: string; color: string; value: string }[] => {
    if (!fullDetails) return []
    return [
      { label: 'Proposed', color: '#FF8A25', value: fullDetails.proposed_count?.toString?.() ?? '0' },
      { label: 'Approved', color: '#FF7BE9', value: fullDetails.approved_count?.toString?.() ?? '0' },
      { label: 'Rejected', color: '#D44B4B', value: fullDetails.rejected_count?.toString?.() ?? '0' },
      { label: 'Executed', color: '#19B360', value: fullDetails.executed_count?.toString?.() ?? '0' },
    ]
  }, [fullDetails])

  const { data: addTxList, error: addErr, isLoading: addLoading } =
    useMemberAddTransactionList(accountAddress)
  const { data: removeTxList, error: removeErr, isLoading: removeLoading } =
    useMemberRemovalTransactionList(accountAddress)
  const { data: editTxList, error: editErr, isLoading: editLoading } =
    useEditPermissionTransactionList(accountAddress)

  const loadError = addErr || removeErr || editErr || perms.error
  const isLoading = addLoading || removeLoading || editLoading || perms.isLoading

  // History stats (currently unused in UI)
  useMemo(() => {
    if (!memberAddress) return
    const normalized = memberAddress.toLowerCase()
    const addCount = (addTxList || []).filter((tx) =>
      (tx as { member?: string }).member?.toLowerCase?.() === normalized,
    ).length
    const removeCount = (removeTxList || []).filter((tx) =>
      (tx as { member_address?: string }).member_address?.toLowerCase?.() === normalized,
    ).length
    const editCount = (editTxList || []).filter((tx) =>
      (tx as { member?: string }).member?.toLowerCase?.() === normalized,
    ).length
    return { total: addCount + removeCount + editCount, add: addCount, remove: removeCount, edit: editCount }
  }, [memberAddress, addTxList, removeTxList, editTxList])

  if (!isOpen || !member) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-theme-bg-secondary border-[4px] border-theme-border rounded-xl p-3 sm:p-7 w-full max-w-[95vw] sm:max-w-[583px] md:max-w-[680px] shadow-lg text-theme transition-colors duration-300 font-sans"
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-details-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between gap-4 mb-4">
          <div className='w-full'>
            <div className='w-full flex justify-end'>
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="text-theme-secondary align-end bg-theme-bg-tertiary rounded-full p-1 leading-none hover:text-theme"
                >
                    <X className='w-[20px] h-[20px]' />
                </button>
            </div>
            <h2 id="member-details-title" className="text-xl text-center sm:text-[30px] font-bold">
              Member Details
            </h2>
           </div>
        </div>

        {/* Member Details */}
        <div className="flex flex-col md:flex-row justify-between mb-2 sm:mb-4 w-full">
          <div className='flex flex-row md:flex-col items-center col-span-1 gap-2'>
            <div className='bg-theme-bg-tertiary border-[3px] md:border-[6px] border-[#6F2FCE] rounded-full overflow-hidden'>
              <Image src={avatarSrc} alt={`User's image`} className='w-[40px] md:w-[130px] h-[40px] md:h-[130px] object-cover' width={130} height={130} />
            </div>
            <div className='flex flex-col'>
              <span className="break-all text-base md:text-xl text-theme">{member.name}</span>
              <span className="text-theme-secondary text-sm md:text-base">{member.fullAddress.slice(0, 10)}...{member.fullAddress.slice(-4)}</span>
            </div>
          </div>
          <div className='grid grid-cols-2 mt-3 md:mt-0 gap-1 md:gap-2'>
              {
                memberStats.map((stat) => (
                <div key={stat.label} className='bg-theme-bg-tertiary w-full md:w-[167px] h-[100px] md:h-[126px] rounded-[12px] px-0.5 py-0.5'>
                  <div className='bg-theme-bg-secondary h-[80%] rounded-[10px] w-full'>
                    <div className='rounded-[10px] p-2 md:px-4 md:py-[10px]'>
                      <div className='flex items-center gap-2'>
                        <div className={`pl-[3px] pr-[2.5px] pb-[1px] rounded-[6px]`} style={{ backgroundColor: stat.color }}><Image src={'/card-fill.svg'} className='w-[20px] h-[20px] p-0' alt={stat.label} width={20} height={20} /></div>
                          <div className='text-sm text-theme-secondary'>{stat.label}</div>
                        </div>
                        <div className='font-bold mt-4 text-theme'>{stat.value}</div>
                      </div>
                    </div>
                    <div className='text-sm px-2 text-theme-secondary'>
                    --
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Date joined */}
        <div className='mb-4 w-fit  bg-theme-bg-tertiary  flex items-center gap-2 rounded-[10px] p-2 md:p-4'>
            <div className='text-sm text-theme-secondary'>Date joined:</div>
            <div className='flex items-center'>
                <span className='break-all text-sm md:text-base'>{joinedAt}</span>
            </div>
        </div>

        {/* Status and Roles */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className='text-sm text-theme-secondary'>Roles:</div>
               <div className="flex items-center gap-2 flex-wrap">
                {(perms.permissions || []).map((role) => {
                let styles = 'border-theme-border text-theme-secondary'
                if (role === 'Voter') styles = 'bg-[#FF7BE9]/10 text-[#FF7BE9] border-[#FF7BE9]'
                if (role === 'Proposer') styles = 'bg-[#FF8A25]/10 text-[#FF8A25] border-[#FF8A25]'
                if (role === 'Executor') styles = 'bg-[#19B360]/10 text-[#19B360] border-[#19B360]'
                return (
                    <span key={role} className={`text-xs px-2 py-0.5 rounded-2xl border ${styles}`}>
                    {role}
                    </span>
                )
                })}
            </div>
        </div>

        {/* Will wallet */}
        <div className='flex items-center gap-2'>
            <div className='text-sm text-theme-secondary mb-2'>Will Wallet:</div>
            <div className='flex items-center text-sm md:text-base text-theme-secondary bg-theme-bg-tertiary rounded-[10px] p-2 md:px-4 md:py-[10px] gap-2'>
                <span className='break-all'>G2520xec7Spherre520bb71f30523bcce4c10ad62teyw</span>
            </div>
        </div>

        {/* Content states */}
        {isLoading && (
          <div className="text-theme-secondary text-sm">Loading member details…</div>
        )}
        {loadError && !isLoading && (
          <div className="text-red-500 text-sm">
            Unable to load member details. Please try again later.
          </div>
        )}
      </div>
    </div>
  )
}


