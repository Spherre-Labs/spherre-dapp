'use client';

import { useState } from 'react';
import Transaction, { Transaction as TransactionType } from './components/transaction';

const transactions: TransactionType[] = [
  {
    id: 1,
    date: 'Today (27 Feb)',
    type: 'withdraw',
    amount: '25 STRK',
    toAddress: 'a2gja...7wyw',
    time: '01:45 pm',
    status: 'Pending',
    initiator: '22yqu...qyyia',
    dateInitiated: 'Wed 27 Feb, 2025 4:45PM',
    account: 'Backstage Boys',
  },
  {
    id: 2,
    date: 'Today (27 Feb)',
    type: 'swap',
    amount: '25 STRK',
    toAddress: 'a2gja...7wyw',
    time: '01:45 pm',
    status: 'Pending',
    initiator: '22yqu...qyyia',
    dateInitiated: 'Wed 27 Feb, 2025 4:45PM',
    account: 'Backstage Boys',
  },
  {
    id: 3,
    date: 'Wed 20 February',
    type: 'withdraw',
    amount: '25 STRK',
    toAddress: 'a2gja...7wyw',
    time: '01:45 pm',
    status: 'Rejected',
    initiator: '22yqu...qyyia',
    dateInitiated: 'Wed 20 Feb, 2025 4:45PM',
    account: 'Backstage Boys',
  },
  {
    id: 4,
    date: 'Wed 18 February',
    type: 'swap',
    amount: '25 STRK',
    toAddress: 'a2gja...7wyw',
    time: '01:45 pm',
    status: 'Pending',
    initiator: '22yqu...qyyia',
    dateInitiated: 'Wed 18 Feb, 2025 4:45PM',
    account: 'Backstage Boys',
  },
  {
    id: 5,
    date: 'Wed 2 February',
    type: 'swap',
    amount: '25 STRK',
    toAddress: 'a2gja...7wyw',
    time: '01:45 pm',
    status: 'Executed',
    initiator: '22yqu...qyyia',
    dateInitiated: 'Wed 12 Feb, 2025 4:45PM',
    account: 'Backstage Boys',
  },
  {
    id: 6,
    date: 'Wed 4 February',
    type: 'limitSwap',
    amount: '25 STRK',
    toAddress: 'a2gja...7wyw',
    time: '01:45 pm',
    status: 'Executed',
    initiator: '22yqu...qyyia',
    dateInitiated: 'Wed 18 Feb, 2025 4:45PM',
    account: 'Backstage Boys',
  },
  {
    id: 7,
    date: 'Today (27 Feb)',
    type: 'withdraw',
    amount: '25 STRK',
    toAddress: 'a2gja...7wyw',
    time: '01:45 pm',
    status: 'Pending',
    initiator: '22yqu...qyyia',
    dateInitiated: 'Wed 27 Feb, 2025 4:45PM',
    account: 'Backstage Boys',
  },
  {
    id: 8,
    date: 'Wed 13 February',
    type: 'limitSwap',
    amount: '25 STRK',
    toAddress: 'a2gja...7wyw',
    time: '01:45 pm',
    status: 'Rejected',
    initiator: '22yqu...qyyia',
    dateInitiated: 'Wed 18 Feb, 2025 4:45PM',
    account: 'Backstage Boys',
  },
  {
    id: 9,
    date: 'Wed 18 February',
    type: 'swap',
    amount: '25 STRK',
    toAddress: 'a2gja...7wyw',
    time: '01:45 pm',
    status: 'Executed',
    initiator: '22yqu...qyyia',
    dateInitiated: 'Wed 18 Feb, 2025 4:45PM',
    account: 'Backstage Boys',
  },
  {
    id: 10,
    date: 'Wed 2 February',
    type: 'limitSwap',
    amount: '25 STRK',
    toAddress: 'a2gja...7wyw',
    time: '01:45 pm',
    status: 'Executed',
    initiator: '22yqu...qyyia',
    dateInitiated: 'Wed 18 Feb, 2025 4:45PM',
    account: 'Backstage Boys',
  },
  {
    id: 11,
    date: 'Today (27 Feb)',
    type: 'withdraw',
    amount: '25 STRK',
    toAddress: 'a2gja...7wyw',
    time: '01:45 pm',
    status: 'Pending',
    initiator: '22yqu...qyyia',
    dateInitiated: 'Wed 27 Feb, 2025 4:45PM',
    account: 'Backstage Boys',
  },
  {
    id: 12,
    date: 'Wed 9 February',
    type: 'limitSwap',
    amount: '25 STRK',
    toAddress: 'a2gja...7wyw',
    time: '01:45 pm',
    status: 'Executed',
    initiator: '22yqu...qyyia',
    dateInitiated: 'Wed 18 Feb, 2025 4:45PM',
    account: 'Backstage Boys',
  },
  {
    id: 13,
    date: 'Wed 24 February',
    type: 'swap',
    amount: '25 STRK',
    toAddress: 'a2gja...7wyw',
    time: '01:45 pm',
    status: 'Pending',
    initiator: '22yqu...qyyia',
    dateInitiated: 'Wed 18 Feb, 2025 4:45PM',
    account: 'Backstage Boys',
  },
  {
    id: 14,
    date: 'Wed 11 February',
    type: 'swap',
    amount: '25 STRK',
    toAddress: 'a2gja...7wyw',
    time: '01:45 pm',
    status: 'Executed',
    initiator: '22yqu...qyyia',
    dateInitiated: 'Wed 18 Feb, 2025 4:45PM',
    account: 'Backstage Boys',
  },
  {
    id: 15,
    date: 'Wed 30 February',
    type: 'limitSwap',
    amount: '25 STRK',
    toAddress: 'a2gja...7wyw',
    time: '01:45 pm',
    status: 'Executed',
    initiator: '22yqu...qyyia',
    dateInitiated: 'Wed 18 Feb, 2025 4:45PM',
    account: 'Backstage Boys',
  },
];

// Group transactions by date
const groupedTransactions = transactions.reduce((acc, transaction) => {
  if (!acc[transaction.date]) {
    acc[transaction.date] = [];
  }
  acc[transaction.date].push(transaction);
  return acc;
}, {} as Record<string, TransactionType[]>);

export default function TransactionPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="">
      <div className="m-6 p-10 bg-[#1C1D1F] rounded-xl">
        
        {Object.entries(groupedTransactions).map(([date, txns]) => (
          <div key={date} className="mb-6">
            <h2 className="text-gray-400 text-sm mb-2">{date}</h2>
            <div className="space-y-6">
              {txns.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-[#2A2A2A] rounded-lg overflow-hidden"
                >
                  <Transaction
                    transaction={transaction}
                    isExpanded={expandedId === transaction.id}
                    onToggle={() => handleToggle(transaction.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}