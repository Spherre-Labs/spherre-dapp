"use client"

import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Define data item type
interface DataItem {
    date: Date;
    year: string;
    displayDate: string;
    value: number;
    deposits: number;
    withdrawals: number;
    priceImpact: number;
}

// Define time range type
type TimeRange = '1D' | '7D' | '1M' | '3M' | '1Y' | 'ALL';

const AmountAnalysisChart = () => {
    // States for filters
    const [timeRange, setTimeRange] = useState<TimeRange>('1Y');
    const [selectedYear, setSelectedYear] = useState<string>('2023');
    const [completeData, setCompleteData] = useState<DataItem[]>([]);
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);

    // Available years
    const availableYears: string[] = ['2021', '2022', '2023', '2024', '2025'];

    // Generate multi-year daily data
    const generateMultiYearData = (): DataItem[] => {
        const allData: DataItem[] = [];

        // Generate more granular data for each year
        availableYears.forEach(year => {
            let currentValue = 300 + Math.random() * 100;

            // Generate daily data instead of monthly
            for (let month = 0; month < 12; month++) {
                for (let day = 1; day <= 31; day++) {
                    // Ensure valid date
                    const currentDate = new Date(parseInt(year), month, day);
                    if (currentDate.getMonth() !== month) continue;

                    // Generate multiple data points per day (hourly)
                    for (let hour = 0; hour < 24; hour += 2) {
                        // Format date
                        const monthName = currentDate.toLocaleString('default', { month: 'short' });

                        // More dynamic random changes
                        const deposit = Math.random() < 0.2 ? Math.floor(Math.random() * 50) : 0;
                        const withdrawal = Math.random() < 0.15 ? Math.floor(Math.random() * 40) : 0;
                        const priceImpact = Math.floor(Math.random() * 20) - 8;

                        // More sophisticated yearly trend adjustment
                        const yearTrendMap: Record<string, number> = {
                            '2021': -0.2,
                            '2022': 0.5,
                            '2023': 0.1,
                            '2024': -0.1,
                            '2025': 0.3
                        };
                        const yearTrend = yearTrendMap[year] || 0;

                        // Update value with more variability
                        currentValue += deposit - withdrawal + priceImpact + yearTrend;
                        currentValue = Math.max(currentValue, 50);

                        allData.push({
                            date: new Date(parseInt(year), month, day, hour),
                            year: year,
                            displayDate: `${monthName} ${day}, ${year}`, // Example: "Jan 1, 2023"
                            value: Math.round(currentValue),
                            deposits: deposit,
                            withdrawals: withdrawal,
                            priceImpact
                        });
                    }
                }
            }
        });

        return allData;
    };

    const filterData = (data: DataItem[], range: TimeRange, year: string): void => {
        if (!data || data.length === 0) return;

        // Filter by year if not ALL
        const yearFiltered = range === 'ALL' ? data : data.filter(item => item.year === year);

        if (yearFiltered.length === 0) {
            setFilteredData([]);
            return;
        }

        // Sort data chronologically
        yearFiltered.sort((a, b) => a.date.getTime() - b.date.getTime());

        const endDate = new Date(yearFiltered[yearFiltered.length - 1].date);
        let startDate = new Date(endDate);

        // Determine start date based on range
        const rangeStartDates: Record<TimeRange, () => Date> = {
            '1D': () => new Date(endDate.getTime() - 24 * 60 * 60 * 1000),
            '7D': () => new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000),
            '1M': () => new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate()),
            '3M': () => new Date(endDate.getFullYear(), endDate.getMonth() - 3, endDate.getDate()),
            '1Y': () => new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate()),
            'ALL': () => new Date(yearFiltered[0].date)
        };

        startDate = rangeStartDates[range]();

        // Filter data within range
        const filtered = yearFiltered.filter(item => item.date >= startDate);

        // Sampling strategy to ensure 12 points
        const sampleData = (data: DataItem[], targetPoints = 12): DataItem[] => {
            if (data.length <= targetPoints) return data;

            const result: DataItem[] = [];
            const interval = Math.floor(data.length / targetPoints);

            for (let i = 0; i < data.length; i += interval) {
                result.push(data[i]);
                if (result.length === targetPoints) break;
            }

            // Always include the last point
            if (result[result.length - 1] !== data[data.length - 1]) {
                result[result.length - 1] = data[data.length - 1];
            }

            return result;
        };

        const sampledData = sampleData(filtered);
        setFilteredData(sampledData);
    };

    // Handle range button click
    const handleRangeChange = (range: TimeRange): void => {
        setTimeRange(range);
        filterData(completeData, range, selectedYear);
    };

    // Handle year dropdown change
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const year = e.target.value;
        setSelectedYear(year);
        filterData(completeData, timeRange, year);
    };

    // Format the label based on time range
    const formatLabel = (item: DataItem): string => {
        const date = new Date(item.date);

        if (timeRange === '1D') {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        else if (timeRange === '7D') {
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'short' });
            return `${month} ${day}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        else if (timeRange === '1Y') {
            const month = date.toLocaleString('default', { month: 'short' });
            return `${month}`;
        }
        else if (timeRange === 'ALL') {
            return item.displayDate; // Full date with year
        }
        else {
            // For 1M, 3M, 1Y - show month and day
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'short' });
            return `${month} ${day}`;
        }
    };

    // Initialize data on component mount
    useEffect(() => {
        const data = generateMultiYearData();
        setCompleteData(data);
        filterData(data, timeRange, selectedYear);
    }, []);

    // Prepare data for Chart.js
    const chartData = {
        labels: filteredData.map(item => formatLabel(item)),
        datasets: [
            {
                label: 'Account Value',
                data: filteredData.map(item => item.value),
                fill: false,
                backgroundColor: '#6F2FCE',
                borderColor: '#6F2FCE',
                tension: 0.4,
                pointRadius: 2, // Slightly larger base point
                pointBackgroundColor: '#6F2FCE', // Solid point color
                pointBorderColor: 'rgba(111, 47, 206, 0.3)', // Transparent orbit border
                pointBorderWidth: 8, // Wider border to create orbit effect
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#6F2FCE',
                pointHoverBorderColor: 'rgba(111, 47, 206, 0.5)', // More visible on hover
                pointHoverBorderWidth: 12,
            }
        ]
    };

    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: false,
                    text: 'Account Value'
                }
            },
            x: {
                title: {
                    display: false,
                    text: timeRange === '1D' ? 'Time' : 'Date'
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                mode: 'nearest',
                intersect: false, // Allow tooltip when near point
                backgroundColor: '#272729',
                cornerRadius: 10,
                padding: 10,
                callbacks: {
                    title: (context: any) => {
                        const index = context[0].dataIndex;
                        return filteredData[index].displayDate;
                    },
                    label: (context: any) => {
                        const index = context.dataIndex;
                        const data = filteredData[index];

                        return [
                            `Price: ${data.value}`,
                            `Deposits: +${data.deposits}`,
                            `Withdrawals: -${data.withdrawals}`,
                            `Token Price Impact: ${data.priceImpact > 0 ? '+' : ''}${data.priceImpact}`
                        ];
                    }
                }
            },
            hover: {
                mode: 'nearest',
                intersect: false
            }
        },
        interaction: {
            mode: 'nearest',
            intersect: false
        },
        elements: {
            point: {
                radius: 2, // Invisible by default
                hoverRadius: 8, // Size when hovered
                backgroundColor: '#6F2FCE', // Solid point color
                borderColor: 'rgba(111, 47, 206, 0.3)', // Transparent orbit border
                borderWidth: 2, // Width of the orbit border
                hoverBackgroundColor: '#6F2FCE',
                hoverBorderColor: 'rgba(111, 47, 206, 0.5)', // More visible on hover
                hoverBorderWidth: 12,
            }
        }
    };

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
            }}>
                <h3 className="text-[#8E9BAE] font-semibold">Amount Analysis</h3>
                {/* Time Range Selector */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    height: '30px',
                    backgroundColor: '#272729',
                    padding: '4px',
                    borderRadius: '7.1px',
                }}>
                    {(['1D', '7D', '1M', '3M', '1Y', 'ALL'] as TimeRange[]).map(range => (
                        <button
                            key={range}
                            onClick={() => handleRangeChange(range)}
                            style={{
                                padding: '2px 4px',
                                backgroundColor: timeRange === range ? '#6F2FCE' : 'transparent',
                                color: timeRange === range ? 'white' : '#8E9BAE',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12.93px',
                                fontWeight: timeRange === range ? 'bold' : 'normal'
                            }}
                        >
                            {range}
                        </button>
                    ))}
                </div>

                {/* Year Dropdown */}
                <div>
                    <select
                        value={selectedYear}
                        onChange={handleYearChange}
                        disabled={timeRange === 'ALL'}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '4px',
                            border: '1px solid #292929',
                            backgroundColor: timeRange === 'ALL' ? '#272729' : '#272729',
                            cursor: timeRange === 'ALL' ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ height: '250px', width: '100%', maxWidth: '100%' }}>
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default AmountAnalysisChart;
