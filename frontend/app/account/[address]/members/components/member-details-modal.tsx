'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import {
  useGetMemberPermissions,
  useIsMember,
  useMemberAddTransactionList,
  useMemberRemovalTransactionList,
  useEditPermissionTransactionList,
} from '@/hooks/useSpherreHooks'
import { formatAddress } from '@/lib/utils/transaction-utils'
import { X } from 'lucide-react'

export type MemberDetailsType = {
  id: number
  name: string
  address: string
  fullAddress: string
  proposed?: number
  approved?: number
  rejected?: number
  executed?: number
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
  const { data: isActive } = useIsMember(
    accountAddress,
    (memberAddress || '0x0') as `0x${string}`,
  )

  const { data: addTxList, error: addErr, isLoading: addLoading } =
    useMemberAddTransactionList(accountAddress)
  const { data: removeTxList, error: removeErr, isLoading: removeLoading } =
    useMemberRemovalTransactionList(accountAddress)
  const { data: editTxList, error: editErr, isLoading: editLoading } =
    useEditPermissionTransactionList(accountAddress)

  const loadError = addErr || removeErr || editErr || perms.error
  const isLoading = addLoading || removeLoading || editLoading || perms.isLoading

  // Filter lists for this member
  const stats = useMemo(() => {
    if (!memberAddress) {
      return { total: 0, add: 0, remove: 0, edit: 0 }
    }
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
        className="bg-theme-bg-secondary border border-theme-border rounded-xl p-5 sm:p-7 w-full max-w-[95vw] sm:max-w-[560px] md:max-w-[680px] shadow-lg text-theme transition-colors duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-details-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between gap-4 mb-4">
          <div className='w-full'>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-theme-secondary text-[#8E9BAE] bg-theme-bg-tertiary rounded-full p-2 text-2xl leading-none hover:text-theme"
          >
            <X />
          </button>
            <h2 id="member-details-title" className="text-xl text-center sm:text-[30px] font-bold">
              Member Details
            </h2>
           </div>
        </div>

        {/* Identity */}
        <div className="mb-4">
          <div className="text-sm text-theme-secondary">Wallet Address</div>
          <div className="flex items-center gap-2">
            <span className="font-mono break-all">{member.fullAddress}</span>
            <span className="px-2 py-0.5 text-xs rounded-full border border-theme-border bg-theme-bg-tertiary text-theme-secondary">
              {formatAddress(member.fullAddress)}
            </span>
          </div>
        </div>

        {/* Status and Roles */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span
            className={`text-xs px-2 py-1 rounded-full border ${
              isActive ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-red-500/10 border-red-500 text-red-400'
            }`}
          >
            {isActive ? 'Active' : 'Removed'}
          </span>

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

        {/* Content states */}
        {isLoading && (
          <div className="text-theme-secondary text-sm">Loading member details…</div>
        )}
        {loadError && !isLoading && (
          <div className="text-red-500 text-sm">
            Unable to load member details. Please try again later.
          </div>
        )}

        {/* History */}
        {!isLoading && !loadError && (
          <div className="space-y-3">
            <div className="text-sm text-theme-secondary">Member-related history</div>
            {stats.total === 0 ? (
              <div className="text-theme-secondary text-sm">No additional data available for this member.</div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-theme-border bg-theme-bg-tertiary p-3">
                  <div className="text-xs text-theme-secondary">Total</div>
                  <div className="text-lg font-semibold">{stats.total}</div>
                </div>
                <div className="rounded-lg border border-theme-border bg-theme-bg-tertiary p-3">
                  <div className="text-xs text-theme-secondary">Added</div>
                  <div className="text-lg font-semibold">{stats.add}</div>
                </div>
                <div className="rounded-lg border border-theme-border bg-theme-bg-tertiary p-3">
                  <div className="text-xs text-theme-secondary">Removed</div>
                  <div className="text-lg font-semibold">{stats.remove}</div>
                </div>
                <div className="rounded-lg border border-theme-border bg-theme-bg-tertiary p-3 col-span-3 sm:col-span-1">
                  <div className="text-xs text-theme-secondary">Permission Edits</div>
                  <div className="text-lg font-semibold">{stats.edit}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


