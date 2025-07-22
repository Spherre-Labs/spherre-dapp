"use client";
import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import dynamic from "next/dynamic";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from "chart.js";
import Image from "next/image";

// Register Chart.js components with logging
try {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);
  console.log("Chart.js scales registered:", ChartJS.registry.scales.get("category") ? "Success" : "Failed");
} catch (error) {
  console.error("Error registering Chart.js components:", error);
}

// Dynamically import the Bar component with SSR disabled
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
  loading: () => <div>Loading chart...</div>,
});

interface TreasuryPortfoliochatProps {
  data: import("chart.js").ChartData<"bar">;
  onPeriodChange: (date: string) => void;
}

const TreasuryPortfoliochat = ({ data, onPeriodChange }: TreasuryPortfoliochatProps) => {
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
    console.log("Client-side rendering enabled for TreasuryPortfoliochat");
  }, []);

  const topTokens = [
    { symbol: "STRK", name: "Starknet", amount: "0.23", unit: "STRK", change: "+0.75%", logo: "/starknet.png" },
    { symbol: "ETH", name: "Ethereum", amount: "0.23", unit: "ETH", change: "+0.75%", logo: "/Eth.png" },
    { symbol: "USDT", name: "Tether", amount: "0.23", unit: "USDT", change: "+0.54%", logo: "/Eth.png" },
    { symbol: "ETH", name: "Ethereum", amount: "0.23", unit: "ETH", change: "+0.75%", logo: "/Eth.png" },
    { symbol: "ETH", name: "Ethereum", amount: "0.23", unit: "ETH", change: "+0.75%", logo: "/Eth.png" },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        type: "category" as const, // Use string literal type
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
        },
      },
      y: {
        type: "linear" as const, // Use string literal type
        grid: {
          color: "#374151",
        },
        ticks: {
          color: "#6b7280",
        },
      },
    },
  };

  // State for selected date
  const [selectedDate, setSelectedDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  // Sample date options (you can expand these)
    const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
    const months = [
      "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12",
    ];
    const years = Array.from({ length: 5 }, (_, i) => String(2025 - i));
  
    // Handle date changes
    const handleDateChange = (field: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newDate = { ...selectedDate, [field]: e.target.value };
      setSelectedDate(newDate);
      // Call onPeriodChange with a formatted date (e.g., "DD-MM-YYYY" or custom format)
      const formattedDate = `${newDate.day}-${newDate.month}-${newDate.year}`;
      if (newDate.day && newDate.month && newDate.year) {
        onPeriodChange(formattedDate);
      }
    };
  
    return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:h-[445px] gap-6 mb-6">
      <div className="lg:col-span-2 h-full bg-[#1C1D1F] rounded-lg p-4 border-4 border-[#292929]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#6F2FCE]"></div>
              <span className="text-sm text-gray-400">Tokens</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF7BE9]"></div>
              <span className="text-sm text-gray-400">NFTs</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            <div className="flex items-center gap-2">
              <select
                value={selectedDate.day}
                onChange={handleDateChange("day")}
                className="bg-[#1C1D1F] text-gray-400 border-none outline-none"
              >
                <option value="">Day</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select
                value={selectedDate.month}
                onChange={handleDateChange("month")}
                className="bg-[#1C1D1F] text-gray-400 border-none outline-none"
              >
                <option value="">Month</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={selectedDate.year}
                onChange={handleDateChange("year")}
                className="bg-[#1C1D1F] text-gray-400 border-none outline-none"
              >
                <option value="">Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="h-96">
          {isClient ? (
            <Bar
              data={data}
              options={chartOptions}
            />
          ) : (
            <div>Loading chart...</div>
          )}
        </div>
      </div>

      <div className="bg-[#1C1D1F] h-full rounded-lg p-4 border-4 border-[#292929]">
        <h3 className="text-lg font-semibold text-white mb-4">Top Tokens</h3>
        <div className="space-y-3 h-full justify-between ">
          {topTokens.map((token, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <Image src={token.logo} width={24} height={24} alt={`${token.symbol} logo`} />
                </div>
                <div>
                  <div className="font-medium text-white text-sm">{token.symbol}</div>
                  <div className="text-xs text-gray-400">{token.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-white text-sm">{token.amount} {token.unit}</div>
                <div className="text-xs text-green-400">{token.change}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TreasuryPortfoliochat;