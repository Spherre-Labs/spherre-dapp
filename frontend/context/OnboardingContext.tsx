"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from '@starknet-react/core';
// import { StarknetProvider } from '@starknet-react/core';

type OnboardingContextType = {
  accountName: string;
  setAccountName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  members: string[];
  setMembers: React.Dispatch<React.SetStateAction<string[]>>;
  approvals: number;
  setApprovals: React.Dispatch<React.SetStateAction<number>>;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [accountName, setAccountName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [approvals, setApprovals] = useState<number>(1);
  const router = useRouter();
  const { address } = useAccount();

  useEffect(() => {
    if (!address) {
      router.replace('/');
    }
  }, [address, router]);

  return (
    <OnboardingContext.Provider value={{
      accountName, setAccountName,
      description, setDescription,
      members, setMembers,
      approvals, setApprovals
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
