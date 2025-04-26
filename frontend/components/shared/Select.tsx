'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  tokenIcon?: string;
}

export function Select({ 
  className = '',
  error,
  tokenIcon,
  children,
  ...props 
}: SelectProps) {
  return (
    <div className="relative inline-flex items-center gap-2">
      <div className="absolute left-2 flex items-center pointer-events-none">
        {tokenIcon && (
          <div className="w-5 h-5 rounded-full overflow-hidden mr-6">
            <Image 
              src={tokenIcon} 
              alt="Token icon" 
              width={20} 
              height={20}
            />
          </div>
        )}
      </div>
      <select
        className={`
          appearance-none
          bg-[#2C2C2E] text-white
          rounded-full
          pl-${tokenIcon ? '10' : '4'} pr-8 py-2
          text-sm font-medium
          focus:outline-none
          cursor-pointer
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-4 pointer-events-none">
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
} 