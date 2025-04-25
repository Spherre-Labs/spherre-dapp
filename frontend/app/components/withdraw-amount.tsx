"use client"

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import TokenIcon from "@/public/Images/token-icon.png"; // You'll need to add this icon

interface Token {
  symbol: string;
  balance: number;
  icon?: string;
  usdValue?: number;
}

interface WithdrawAmountProps {
  onNext: (amount: number, token: string) => void;
  onCancel: () => void;
  currentStep?: number;
}

export function WithdrawAmount({ onNext, onCancel, currentStep = 2 }: WithdrawAmountProps) {
  const [amount, setAmount] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<string>("STRK");
  const [availableTokens, setAvailableTokens] = useState<Token[]>([
    { 
      symbol: "STRK", 
      balance: 0.0,
      usdValue: 0
    },
    { 
      symbol: "ETH", 
      balance: 0.0,
      usdValue: 0
    }
  ]);

  // Validation
  const isValidAmount = () => {
    const numAmount = parseFloat(amount);
    const selectedTokenData = availableTokens.find(
      (t) => t.symbol === selectedToken
    );
    return (
      !isNaN(numAmount) &&
      numAmount > 0 &&
      selectedTokenData &&
      numAmount <= selectedTokenData.balance
    );
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleNext = () => {
    if (isValidAmount()) {
      onNext(parseFloat(amount), selectedToken);
    }
  };

  const selectedTokenData = availableTokens.find(t => t.symbol === selectedToken);

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= 1 ? "bg-green-500" : "bg-gray-600"
          }`}>
            {currentStep > 1 ? "✓" : "1"}
          </div>
          <span className="ml-2 text-sm text-gray-400">Recipient</span>
        </div>
        <div className={`w-16 h-0.5 ${currentStep >= 2 ? "bg-green-500" : "bg-gray-600"}`} />
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= 2 ? "bg-purple-600" : "bg-gray-600"
          }`}>
            2
          </div>
          <span className="ml-2 text-sm text-white">Token and Amount</span>
        </div>
        <div className={`w-16 h-0.5 ${currentStep >= 3 ? "bg-purple-600" : "bg-gray-600"}`} />
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= 3 ? "bg-purple-600" : "bg-gray-600"
          }`}>
            3
          </div>
          <span className="ml-2 text-sm text-gray-400">Final Review</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">
            Withdraw to Another Wallet
          </h1>
          <p className="text-gray-400">
            Please select the token and amount you wish to send
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-[#272729] rounded-lg p-6">
            <label className="block text-sm text-gray-400 mb-4">
              Enter Amount
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="w-full bg-[#1C1C1E] text-white text-2xl p-4 rounded-lg border border-gray-700 focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                />
              </div>
              <Select
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="min-w-[120px] bg-[#1C1C1E] text-white border border-gray-700 rounded-lg px-4 py-2 focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              >
                {availableTokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </Select>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Balance: {selectedTokenData?.balance || 0} {selectedToken}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              USD Balance: ${selectedTokenData?.usdValue || 0}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={onCancel}
              className="flex-1 bg-[#272729] text-white hover:bg-[#323234] px-6 py-3 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!isValidAmount()}
              className="flex-1 bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}