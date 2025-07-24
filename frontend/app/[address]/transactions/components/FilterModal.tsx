'use client'

import { useState } from 'react'
import { TransactionType } from '@/lib/contracts/types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Image from 'next/image'
import { ListFilter } from 'lucide-react'

interface FilterPopoverProps {
  filters: {
    status: 'Pending' | 'Executed' | 'Rejected' | 'All'
    type: TransactionType | 'All'
    sort: 'newest' | 'oldest' | 'amount'
    selectedMembers: string[]
    selectedTokens: string[]
    minAmount: string
    maxAmount: string
    amountToken: string
  }
  onFiltersChange: (filters: FilterPopoverProps['filters']) => void
}

// Mock member data
const mockMembers = [
  { id: 'hichens', name: 'Hichens', avatar: '/Images/reviewers1.png' },
  { id: 'denzel', name: 'Denzel Smith', avatar: '/Images/reviewers2.png' },
  { id: 'jives', name: 'Jives', avatar: '/Images/reviewers3.png' },
  { id: 'kerkeze', name: 'Kerkeze', avatar: '/Images/avatar.png' },
  { id: 'haley', name: 'Haley', avatar: '/Images/avatarr.png' },
]

const predefinedTokens = [
  { id: 'starknet', name: 'StarkNet', icon: '🟡' },
  { id: 'ethereum', name: 'Ethereum', icon: '💎' },
]

const CollapsibleSection = ({
  title,
  children,
  defaultOpen = false
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-theme-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-theme-bg-secondary transition-colors duration-200"
      >
        <span className="text-theme font-medium">{title}</span>
        <svg
          className={`w-4 h-4 text-theme-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

export default function FilterPopover({ filters, onFiltersChange }: FilterPopoverProps) {
  const [memberSearch, setMemberSearch] = useState('')
  const [tokenSearch, setTokenSearch] = useState('')

  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(memberSearch.toLowerCase())
  )

  const filteredTokens = predefinedTokens.filter(token =>
    token.name.toLowerCase().includes(tokenSearch.toLowerCase())
  )

  const handleStatusChange = (status: typeof filters.status) => {
    onFiltersChange({ ...filters, status })
  }

  const handleTypeChange = (type: typeof filters.type) => {
    onFiltersChange({ ...filters, type })
  }

  const handleMemberToggle = (memberId: string) => {
    const updatedMembers = filters.selectedMembers.includes(memberId)
      ? filters.selectedMembers.filter(id => id !== memberId)
      : [...filters.selectedMembers, memberId]
    onFiltersChange({ ...filters, selectedMembers: updatedMembers })
  }

  const handleTokenToggle = (tokenId: string) => {
    const updatedTokens = filters.selectedTokens.includes(tokenId)
      ? filters.selectedTokens.filter(id => id !== tokenId)
      : [...filters.selectedTokens, tokenId]
    onFiltersChange({ ...filters, selectedTokens: updatedTokens })
  }

  const handleAmountChange = (field: 'minAmount' | 'maxAmount' | 'amountToken', value: string) => {
    onFiltersChange({ ...filters, [field]: value })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      status: 'All',
      type: 'All',
      sort: 'newest',
      selectedMembers: [],
      selectedTokens: [],
      minAmount: '',
      maxAmount: '',
      amountToken: 'STRK',
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 bg-theme-bg-tertiary border border-theme-border text-theme px-4 py-2 rounded-lg hover:bg-theme-border transition-colors duration-200">
          <ListFilter className="w-4 h-4" />
          Filters
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] bg-[#101213] border border-theme-border shadow-2xl" align="end">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-theme-border">
          <h2 className="text-theme font-semibold text-lg">Filters</h2>
          <button
            onClick={clearAllFilters}
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200"
          >
            Clear filters
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
          {/* Status Filter */}
          <CollapsibleSection title="Status" defaultOpen>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Pending', 'Executed', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status as typeof filters.status)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${filters.status === status
                    ? 'bg-primary text-white'
                    : 'bg-theme-bg-tertiary text-theme-secondary hover:bg-theme-border'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </CollapsibleSection>

          {/* Transaction Type Filter */}
          <CollapsibleSection title="Transaction Type" defaultOpen>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'All', label: 'All' },
                { value: TransactionType.MEMBER_ADD, label: 'Add Member' },
                { value: TransactionType.MEMBER_REMOVE, label: 'Remove Member' },
                { value: TransactionType.TOKEN_SEND, label: 'Send Token' },
                { value: TransactionType.NFT_SEND, label: 'Send NFT' },
                { value: TransactionType.THRESHOLD_CHANGE, label: 'Threshold Change' },
                { value: TransactionType.SMART_TOKEN_LOCK, label: 'Smart Lock' },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleTypeChange(type.value as typeof filters.type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${filters.type === type.value
                    ? 'bg-primary text-white'
                    : 'bg-theme-bg-tertiary text-theme-secondary hover:bg-theme-border'
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </CollapsibleSection>

          {/* Amount Filter */}
          <CollapsibleSection title="Amount">
            <div className="space-y-3">
              {/* Token Selector */}
              <div>
                <select
                  value={filters.amountToken}
                  onChange={(e) => handleAmountChange('amountToken', e.target.value)}
                  className="w-full bg-theme-bg-tertiary border border-theme-border rounded-lg px-3 py-2 text-theme focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="STRK">STRK</option>
                  <option value="ETH">ETH</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>

              {/* Min/Max Inputs */}
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minAmount}
                  onChange={(e) => handleAmountChange('minAmount', e.target.value)}
                  className="flex-1 bg-theme-bg-tertiary border border-theme-border rounded-lg px-3 py-2 text-theme placeholder-theme-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="flex items-center text-theme-secondary">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxAmount}
                  onChange={(e) => handleAmountChange('maxAmount', e.target.value)}
                  className="flex-1 bg-theme-bg-tertiary border border-theme-border rounded-lg px-3 py-2 text-theme placeholder-theme-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Member Filter */}
          <CollapsibleSection title="Member">
            <div className="space-y-3">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full bg-theme-bg-tertiary border border-theme-border rounded-lg px-3 py-2 pr-10 text-theme placeholder-theme-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-theme-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Member List */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filteredMembers.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-theme-bg-tertiary cursor-pointer transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={filters.selectedMembers.includes(member.id)}
                      onChange={() => handleMemberToggle(member.id)}
                      className="w-4 h-4 text-primary bg-theme-bg-tertiary border-theme-border rounded focus:ring-primary focus:ring-2"
                    />
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-theme text-sm">{member.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* Token Filter */}
          <CollapsibleSection title="Token">
            <div className="space-y-3">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={tokenSearch}
                  onChange={(e) => setTokenSearch(e.target.value)}
                  className="w-full bg-theme-bg-tertiary border border-theme-border rounded-lg px-3 py-2 pr-10 text-theme placeholder-theme-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-theme-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Token List */}
              <div className="space-y-2">
                {filteredTokens.map((token) => (
                  <label
                    key={token.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-theme-bg-tertiary cursor-pointer transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={filters.selectedTokens.includes(token.id)}
                      onChange={() => handleTokenToggle(token.id)}
                      className="w-4 h-4 text-primary bg-theme-bg-tertiary border-theme-border rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-lg">{token.icon}</span>
                    <span className="text-theme text-sm">{token.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </PopoverContent>
    </Popover>
  )
} 