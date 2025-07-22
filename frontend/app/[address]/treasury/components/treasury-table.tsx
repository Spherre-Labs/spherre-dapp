import Image from "next/image";
import React from "react";

// Define the type for the token object (optional but recommended for TypeScript)
interface Token {
  symbol: string;
  price: string;
  balance: string;
  value: string;
  percentage: number;
    logo: string;
}

const TreasuryTable = ({ tokens }: { tokens: Token[] }) => {
  return (
    <div className=" rounded-lg">
      <div className="flex border-b border-gray-800">
        <button className="px-6 py-3 text-white border-b-2 border-white font-medium">
          Tokens
        </button>
        <button className="px-6 py-3 text-gray-400 hover:text-white transition-colors">
          NFTs Vaults
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="">
              <th className="text-left py-3 px-6 text-gray-400 font-medium">Coin</th>
              <th className="text-left py-3 px-6 text-gray-400 font-medium">Price</th>
              <th className="text-left py-3 px-6 text-gray-400 font-medium">Balance</th>
              <th className="text-left py-3 px-6 text-gray-400 font-medium">Value</th>
              <th className="text-left py-3 px-6 text-gray-400 font-medium">Size</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, index) => (
              <tr key={index} className=" hover:bg-gray-800/50">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full  flex items-center justify-center text-sm font-bold text-white">
                      <Image 
                        src={token.logo}
                        width={24}
                        height={24}
                        alt={`${token.symbol} logo`}
                        className="rounded-full"
                        />
                    </div>
                    <span className="text-white font-medium">{token.symbol}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-white">{token.price}</td>
                <td className="py-4 px-6 text-white">{token.balance}</td>
                <td className="py-4 px-6 text-white">{token.value}</td>
                <td className="py-4 px-6">
                  <div className="flex flex-col ">
                    <div className="rounded-full ">
                    <div className="text-white text-sm mb-2">{token.percentage}%</div>
                      <div 
                        className="h-2 rounded-full bg-white"
                        style={{ width: `${token.percentage}%` }}
                      ></div>
                    </div>
                   
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TreasuryTable;