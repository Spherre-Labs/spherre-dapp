import React from 'react';

const TokenVaults: React.FC = () => {
  const data = [
    { coin: "STRK", price: 0.46, balance: 5, value: 460.43, size: "100%" },
    { coin: "STRK", price: 0.46, balance: 2, value: 700.20, size: "25%" },
    { coin: "STRK", price: 0.46, balance: 3, value: 527.00, size: "50%" },
  ];

  return (
    <div className="overflow-x-auto p-4 bg-black text-white">
      <table className="min-w-full border border-gray-700">
        <thead>
          <tr className="bg-gray-800 text-gray-300">
            <th className="py-2 px-4 text-left">Coin</th>
            <th className="py-2 px-4 text-left">Price</th>
            <th className="py-2 px-4 text-left">Balance</th>
            <th className="py-2 px-4 text-left">Value</th>
            <th className="py-2 px-4 text-left">Size</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-t border-gray-700">
              <td className="py-2 px-4 flex items-center">
                <img
                  src="/path-to-strk-icon.png"
                  alt="STRK"
                  className="w-5 h-5 mr-2"
                />
                {item.coin}
              </td>
              <td className="py-2 px-4">${item.price.toFixed(2)}</td>
              <td className="py-2 px-4">{item.balance}</td>
              <td className="py-2 px-4">${item.value.toFixed(2)}</td>
              <td className="py-2 px-4">
                <div className="relative w-24 bg-gray-700 h-2 rounded">
                  <div
                    className="absolute top-0 left-0 h-2 bg-blue-500 rounded"
                    style={{ width: item.size }}
                  ></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokenVaults;
