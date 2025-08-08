'use client'

import { useState, useMemo } from 'react'
import { TransactionType } from '@/lib/contracts/types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import Image from 'next/image'
import { ChevronDown, ListFilter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { useSpherreAccount } from '@/app/context/account-context'
import { useGetAccountMembers } from '@/hooks/useSpherreHooks'
import { feltToAddress } from '@/lib/utils/validation'

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

// Mock member data for fallback
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
  defaultOpen = false,
  className,
}: {
  title: string
  className?: string
  children: React.ReactNode
  defaultOpen?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-theme-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center mt-2 mb-0 justify-between p-2 rounded-md text-left hover:bg-theme-bg-secondary transition-colors duration-200"
      >
        <span className="text-theme font-semibold text-base">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-theme-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </button>
      {isOpen && <div className={cn('px-2 pb-4', className)}>{children}</div>}
    </div>
  )
}

const FilterButton = ({
  title,
  onClick,
  isActive,
}: {
  title: string
  onClick: () => void
  isActive: boolean
}) => {
  return (
    <button
      className={`px-[14px] mt-2 py-[10px] rounded-lg text-sm text-white font-medium transition-colors bg-theme-bg-secondary duration-200 ${isActive
        ? 'border-2 border-primary bg-[#8C62F238]'
        : 'hover:border-primary'
        }`}
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export default function FilterPopover({
  filters,
  onFiltersChange,
}: FilterPopoverProps) {
  const { accountAddress } = useSpherreAccount()
  const [memberSearch, setMemberSearch] = useState('')
  const [tokenSearch, setTokenSearch] = useState('')

  // Get real members from contract
  const { data: contractMembers } = useGetAccountMembers(
    accountAddress || '0x0'
  )

  // Transform contract members to display format
  const realMembers = useMemo(() => {
    if (!contractMembers || contractMembers.length === 0) {
      return mockMembers // Fallback to mock data
    }

    return contractMembers.map((memberFelt, index) => {
      try {
        const memberAddress = feltToAddress(memberFelt)
        const truncatedAddress = memberAddress.length > 10
          ? `${memberAddress.slice(0, 6)}...${memberAddress.slice(-4)}`
          : memberAddress

        // Assign avatar based on index (cycle through available images)
        const avatar = `https://api.dicebear.com/9.x/avataaars/png?seed=${memberAddress}`
        return {
          id: memberAddress,
          name: `Member ${index + 1} (${truncatedAddress})`,
          avatar,
        }
      } catch (error) {
        console.warn('Failed to convert felt to address:', memberFelt, error)
        return {
          id: `member-${index}`,
          name: `Member ${index + 1}`,
          avatar: `/Images/reviewers${(index % 5) + 1}.png`,
        }
      }
    })
  }, [contractMembers])

  const filteredMembers = realMembers.filter((member) =>
    member.name.toLowerCase().includes(memberSearch.toLowerCase()),
  )

  const filteredTokens = predefinedTokens.filter((token) =>
    token.name.toLowerCase().includes(tokenSearch.toLowerCase()),
  )

  const handleStatusChange = (status: typeof filters.status) => {
    onFiltersChange({ ...filters, status })
  }

  const handleTypeChange = (type: typeof filters.type) => {
    onFiltersChange({ ...filters, type })
  }

  const handleMemberToggle = (memberId: string) => {
    const updatedMembers = filters.selectedMembers.includes(memberId)
      ? filters.selectedMembers.filter((id) => id !== memberId)
      : [...filters.selectedMembers, memberId]
    onFiltersChange({ ...filters, selectedMembers: updatedMembers })
  }

  const handleTokenToggle = (tokenId: string) => {
    const updatedTokens = filters.selectedTokens.includes(tokenId)
      ? filters.selectedTokens.filter((id) => id !== tokenId)
      : [...filters.selectedTokens, tokenId]
    onFiltersChange({ ...filters, selectedTokens: updatedTokens })
  }

  const handleAmountChange = (
    field: 'minAmount' | 'maxAmount' | 'amountToken',
    value: string,
  ) => {
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
        <button className="flex items-center gap-2 bg-theme-bg-tertiary border border-theme-border text-theme px-4 py-2 rounded-lg hover:bg-theme-border transition-colors duration-200 font-semibold font-sans">
          <ListFilter className="w-4 h-4" />
          Filters
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[360px] bg-[#101213] border border-theme-border shadow-2xl font-sans"
        align="end"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2">
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
            <div className="flex flex-wrap gap-5">
              {['All', 'Pending', 'Executed', 'Rejected'].map((status) => (
                <FilterButton
                  key={status}
                  title={status}
                  onClick={() =>
                    handleStatusChange(status as typeof filters.status)
                  }
                  isActive={filters.status === status}
                />
              ))}
            </div>
          </CollapsibleSection>

          {/* Transaction Type Filter */}
          <CollapsibleSection title="Transaction Type" defaultOpen>
            <div className="flex flex-wrap gap-5">
              {[
                { value: 'All', label: 'All' },
                { value: TransactionType.TOKEN_SEND, label: 'Withdraw' },
                { value: TransactionType.MEMBER_ADD, label: 'Add Member' },
                {
                  value: TransactionType.MEMBER_REMOVE,
                  label: 'Remove Member',
                },
                { value: TransactionType.NFT_SEND, label: 'Send NFT' },
                {
                  value: TransactionType.THRESHOLD_CHANGE,
                  label: 'Threshold Change',
                },
                {
                  value: TransactionType.SMART_TOKEN_LOCK,
                  label: 'Smart Lock',
                },
              ].map((type) => (
                <FilterButton
                  key={type.value}
                  title={type.label}
                  onClick={() =>
                    handleTypeChange(type.value as typeof filters.type)
                  }
                  isActive={filters.type === type.value}
                />
              ))}
            </div>
          </CollapsibleSection>

          {/* Amount Filter */}
          <CollapsibleSection title="Amount" className="pr-2">
            <div className="flex flex-col gap-5">
              {/* Token Selector */}
              <div>
                <Select
                  value={filters.amountToken}
                  onValueChange={(value) =>
                    handleAmountChange('amountToken', value)
                  }
                >
                  <SelectTrigger className="w-full border border-theme-border rounded-lg px-4 py-[14px] h-12 text-theme focus:outline-none focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Select a token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STRK">STRK</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Min/Max Inputs */}
              <div className="flex items-center justify-between gap-2 px-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minAmount}
                  onChange={(e) =>
                    handleAmountChange('minAmount', e.target.value)
                  }
                  className="bg-theme-bg-tertiary rounded-lg px-4 py-[14px] text-base text-theme placeholder-theme-secondary focus:outline-none"
                />
                <span className="text-theme font-normal text-base">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxAmount}
                  onChange={(e) =>
                    handleAmountChange('maxAmount', e.target.value)
                  }
                  className="bg-theme-bg-tertiary rounded-lg px-4 py-[14px] text-base text-theme placeholder-theme-secondary focus:outline-none"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Member Filter */}
          <CollapsibleSection title="Member" className="px-0 pr-2">
            <div className="flex flex-col gap-5">
              {/* Search Input */}
              <div className="relative mt-1">
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
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
          <CollapsibleSection title="Token" className="px-0 pr-2">
            <div className="flex flex-col gap-5">
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
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
