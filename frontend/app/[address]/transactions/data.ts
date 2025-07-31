import { StaticImageData } from 'next/image'
import ProfileImage1 from '@/public/Images/reviewers1.png'
import ProfileImage2 from '@/public/Images/reviewers2.png'
import ProfileImage3 from '@/public/Images/reviewers3.png'
import Member1 from '@/public/member1.svg'
import Member2 from '@/public/member2.svg'
import Member3 from '@/public/member3.svg'
import Member4 from '@/public/member4.svg'
import Member5 from '@/public/member5.svg'
import BackstageBoysAvatar from '@/public/Images/backstageboys.png'

export interface Member {
  name: string
  avatar: StaticImageData | string
  address?: string
}

export interface Approval {
  member: Member
  status: 'Confirmed' | 'Rejected' | 'Pending'
}

export interface Transaction {
  id: number
  date: string
  type: 'withdraw' | 'swap' | 'limitSwap'
  amount: string
  toAddress: string
  time: string
  status: 'Pending' | 'Executed' | 'Rejected'
  initiator: Member
  dateInitiated: string
  dateExecuted?: string
  account: {
    name: string
    address: string
    avatar: StaticImageData | string
  }
  to: Member
  threshold: {
    current: number
    required: number
  }
  approvals: Approval[]
  rejections: Approval[]
  tokenIn?: { name: string; amount: number }
  tokenOut?: { name: string; amount: number }
  transactionLink?: string
  transactionId?: string
}

const members = {
  denzel: { name: 'Denzel Smith', avatar: ProfileImage1 },
  hichens: { name: 'Hichens', avatar: ProfileImage2 },
  jives: { name: 'Jives', avatar: ProfileImage3 },
  kerkeze: { name: 'Kerkeze', avatar: Member1 },
  haley: { name: 'Haley', avatar: Member2 },
  peter: { name: 'Peter Griffin', avatar: Member3 },
  lois: { name: 'Lois Griffin', avatar: Member4 },
  quagmire: { name: 'Glenn Quagmire', avatar: Member5 },
  kelvin: { name: 'Kelvin Brom', avatar: Member1, address: 'yeu7....0x23y' },
}

// Generate a large, varied dummy dataset
const transactionTypes = ['withdraw', 'swap', 'limitSwap'] as const
const statuses = ['Pending', 'Executed', 'Rejected'] as const
const dates = [
  'Today (27 Feb)',
  'Wed 26 Feb',
  'Tue 25 Feb',
  'Mon 24 Feb',
  'Sun 23 Feb',
  'Sat 22 Feb',
  'Fri 21 Feb',
  'Thu 20 Feb',
  'Wed 19 Feb',
  'Tue 18 Feb',
  'Mon 17 Feb',
  'Sun 16 Feb',
  'Sat 15 Feb',
  'Fri 14 Feb',
  'Thu 13 Feb',
  'Wed 12 Feb',
  'Tue 11 Feb',
  'Mon 10 Feb',
  'Sun 9 Feb',
  'Sat 8 Feb',
  'Fri 7 Feb',
  'Thu 6 Feb',
  'Wed 5 Feb',
  'Tue 4 Feb',
  'Mon 3 Feb',
  'Sun 2 Feb',
  'Sat 1 Feb',
]
const tokens = [
  { name: 'STRK', amount: 25 },
  { name: 'USDC', amount: 150 },
  { name: 'USDT', amount: 500 },
  { name: 'ETH', amount: 0.05 },
  { name: 'BTC', amount: 0.01 },
]
const memberList = Object.values(members)

function randomFrom<T>(arr: readonly T[], index: number): T {
  return arr[index % arr.length]
}

export const transactions: Transaction[] = Array.from(
  { length: 75 },
  (_, i) => {
    const type = randomFrom(transactionTypes, i)
    const status = randomFrom(statuses, i + 1)
    const date = randomFrom(dates, i + 2)
    const initiator = randomFrom(memberList, i + 3)
    const to = randomFrom(memberList, i + 4)
    const account = {
      name: 'Backstage Boys',
      address: '0x233r...6574',
      avatar: BackstageBoysAvatar,
    }
    const approvals = [
      { member: randomFrom(memberList, i + 5), status: 'Confirmed' as const },
      { member: randomFrom(memberList, i + 6), status: 'Confirmed' as const },
      { member: randomFrom(memberList, i + 7), status: 'Confirmed' as const },
    ]
    const rejections =
      i % 5 === 0
        ? [
          {
            member: randomFrom(memberList, i + 8),
            status: 'Rejected' as const,
          },
        ]
        : []
    const tokenIn = randomFrom(tokens, i + 9)
    const tokenOut = randomFrom(
      tokens.filter((t) => t.name !== tokenIn.name),
      i + 10,
    )

    const hour = (i % 12) + 1
    const minute = (i * 3) % 60
    const ampm = i % 2 === 0 ? 'am' : 'pm'

    return {
      id: i + 1,
      date,
      type,
      amount: `${tokenIn.amount} ${tokenIn.name}`,
      toAddress: `a2gja...${(i * 12345).toString(36).slice(-5)}`,
      time: `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`,
      status,
      initiator,
      dateInitiated: `${date} 2025 ${hour}:${minute.toString().padStart(2, '0')}${ampm.toUpperCase()}`,
      dateExecuted:
        status === 'Executed'
          ? `${date} 2025 ${(hour + 1) % 12}:${minute.toString().padStart(2, '0')}${ampm.toUpperCase()}`
          : undefined,
      account,
      to,
      threshold: { current: approvals.length, required: 3 },
      approvals,
      rejections,
      tokenIn: type !== 'withdraw' ? tokenIn : undefined,
      tokenOut: type !== 'withdraw' ? tokenOut : undefined,
      transactionId: (i + 1 * 9876).toString(36).slice(2, 14),
      transactionLink: (i + 1 * 5432).toString(36).slice(2, 14),
    }
  },
)
