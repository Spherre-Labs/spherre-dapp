import type { SmartLockPlan } from '@/types/smart-lock'

export const mockPlans: SmartLockPlan[] = [
  {
    id: '1',
    name: 'My Next Game Console',
    token: 'STRK',
    dateCreated: '01/01/2025',
    amount: '0.036 STRK',
    unlockDate: '03/06/2025',
    isUnlockable: false,
    category: 'Gaming',
    imageUrl: '/Smart-Lock-Banner-1.png',
  },
  {
    id: '2',
    name: 'My Dream Car',
    token: 'STRK',
    dateCreated: '01/01/2025',
    amount: '0.126 STRK',
    unlockDate: '03/06/2025',
    isUnlockable: false,
    category: 'Transportation',
    imageUrl: '/Smart-Lock-Banner-2.png',
  },
  {
    id: '3',
    name: 'Subscription Plans',
    token: 'STRK',
    dateCreated: '01/01/2025',
    amount: '0.036 STRK',
    unlockDate: '03/06/2025',
    isUnlockable: true,
    category: 'Subscription',

    imageUrl: '/Smart-Lock-Banner-3.png',
  },
  {
    id: '4',
    name: 'Subscription Plans',
    token: 'STRK',
    dateCreated: '01/01/2025',
    amount: '0.036 STRK',
    unlockDate: '03/06/2025',
    isUnlockable: false,
    category: 'Subscription',

    imageUrl: '/Smart-Lock-Banner-4.png',
  },
  {
    id: '5',
    name: 'Subscription Plans',
    token: 'STRK',
    dateCreated: '01/01/2025',
    amount: '0.036 STRK',
    unlockDate: '03/06/2025',
    isUnlockable: false,
    category: 'Subscription',

    imageUrl: '/Smart-Lock-Banner-4.png',
  },
  {
    id: '6',
    name: 'Subscription Plans',
    token: 'STRK',
    dateCreated: '01/01/2025',
    amount: '0.036 STRK',
    unlockDate: '03/06/2025',
    isUnlockable: false,
    category: 'Subscription',
    imageUrl: '/Smart-Lock-Banner-4.png',
  },
]

export const categories = ['Gaming', 'Transportation', 'Subscription']
