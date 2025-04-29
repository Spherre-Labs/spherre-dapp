export interface Transaction {
    id: number;
    date: string;
    type: 'withdraw' | 'swap' | 'limitSwap';
    amount: string;
    toAddress: string;
    time: string;
    status: 'Pending' | 'Executed' | 'Rejected';
    initiator?: string;
    dateInitiated?: string;
    account?: string;
  }