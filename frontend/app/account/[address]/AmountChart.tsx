'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
  ChartData,
  TooltipItem,
} from 'chart.js'
import type { Chart } from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-moment'
import moment from 'moment'
import { useTheme } from '@/app/context/theme-context-provider'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
)

interface DataItem {
  date: Date
  year: string
  displayDate: string
  value: number
}

type DateRangeType = '1D' | '7D' | '1M' | '3M' | '1Y' | 'ALL'
type TimeUnit = 'hour' | 'day' | 'week' | 'month' | 'year'

interface AmountAnalysisChartProps {
  initialDateRange?: DateRangeType
}

type ChartDataType = ChartData<'line', number[], Date>

const AmountAnalysisChart: React.FC<AmountAnalysisChartProps> = ({
  initialDateRange = '1M',
}) => {
  const [mounted, setMounted] = useState(false)
  const { actualTheme } = useTheme()
  const [dateRange, setDateRange] = useState<DateRangeType>(initialDateRange)
  const [chartData, setChartData] = useState<ChartDataType>({
    labels: [],
    datasets: [],
  })
  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>({})
  const [selectedYear, setSelectedYear] = useState<string>(
    moment().format('YYYY'),
  )
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<Chart<'line'> | null>(null)
  const [isChartReady, setIsChartReady] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Add a small delay to ensure container is properly sized
    const timer = setTimeout(() => {
      setIsChartReady(true)
      if (chartRef.current) {
        chartRef.current.resize()
      }
    }, 150)

    return () => clearTimeout(timer)
  }, [])

  // Available years (last 7 years)
  const availableYears = Array.from({ length: 7 }, (_, i) =>
    moment().subtract(i, 'years').format('YYYY'),
  )

  // Theme-aware colors
  const getThemeColors = useCallback(() => {
    return {
      gridColor: actualTheme === 'dark' ? '#292929' : '#e2e8f0',
      tickColor: actualTheme === 'dark' ? '#FFFFFF' : '#374151',
      tooltipBg: actualTheme === 'dark' ? '#24252A' : '#f8fafc',
      tooltipText: actualTheme === 'dark' ? '#FFFFFF' : '#374151',
      selectorBg: actualTheme === 'dark' ? '#24252A' : '#f1f5f9',
      selectorText: actualTheme === 'dark' ? '#8E9BAE' : '#64748b',
      selectBg: actualTheme === 'dark' ? '#2D2F34' : '#f8fafc',
      selectText: actualTheme === 'dark' ? '#9CA3AF' : '#6b7280',
    }
  }, [actualTheme])

  // Generate mock data based on date range
  const generateChartData = useCallback(
    (range: DateRangeType, year?: string): DataItem[] => {
      const data: DataItem[] = []

      // Parse the selected year
      const currentYear = parseInt(moment().format('YYYY'))
      const selectedYearInt = year ? parseInt(year) : currentYear

      // Base value for the chart (starting point) - only use Math.random after mount
      let baseValue = 500
      if (mounted) {
        baseValue = 500 + Math.random() * 500
      }

      switch (range) {
        case '1D':
          // For 1D, create data for the current day but in the selected year
          const dayStart =
            selectedYearInt === currentYear
              ? moment().startOf('day')
              : moment().startOf('day').year(selectedYearInt)

          // Generate data points every 30 minutes (48 points total)
          for (let i = 0; i < 48; i++) {
            const date = moment(dayStart)
              .add(i * 30, 'minutes')
              .toDate()

            // Small random changes for hourly data - only after mount
            if (mounted) {
              baseValue += (Math.random() - 0.5) * 15
            }

            data.push({
              date,
              year: moment(date).format('YYYY'),
              displayDate: moment(date).format('HH:mm'),
              value: Math.max(50, Math.round(baseValue)),
            })
          }
          break

        case '7D':
          // For 7D, create data for the last 7 days but in the selected year
          const weekStart =
            selectedYearInt === currentYear
              ? moment().subtract(6, 'days').startOf('day')
              : moment()
                  .subtract(6, 'days')
                  .startOf('day')
                  .year(selectedYearInt)

          // Generate data points every 4 hours (42 points total)
          for (let i = 0; i < 42; i++) {
            const date = moment(weekStart)
              .add(i * 4, 'hours')
              .toDate()

            // Slightly larger changes for daily data - only after mount
            if (mounted) {
              baseValue += (Math.random() - 0.5) * 30
            }

            data.push({
              date,
              year: moment(date).format('YYYY'),
              displayDate: moment(date).format('MMM DD HH:mm'),
              value: Math.max(50, Math.round(baseValue)),
            })
          }
          break

        case '1M':
          // For 1M, create data for the last 30 days but in the selected year
          const monthStart =
            selectedYearInt === currentYear
              ? moment().subtract(29, 'days').startOf('day')
              : moment()
                  .subtract(29, 'days')
                  .startOf('day')
                  .year(selectedYearInt)

          // Generate 30 daily data points
          for (let i = 0; i < 30; i++) {
            const date = moment(monthStart).add(i, 'days').toDate()

            // More noticeable changes for monthly view - only after mount
            if (mounted) {
              baseValue += (Math.random() - 0.5) * 60
            }

            data.push({
              date,
              year: moment(date).format('YYYY'),
              displayDate: moment(date).format('MMM DD'),
              value: Math.max(50, Math.round(baseValue)),
            })
          }
          break

        case '3M':
          // For 3M, create data for the last 90 days but in the selected year
          const quarterStart =
            selectedYearInt === currentYear
              ? moment().subtract(89, 'days').startOf('day')
              : moment()
                  .subtract(89, 'days')
                  .startOf('day')
                  .year(selectedYearInt)

          // Generate data points every 3 days (30 points total)
          for (let i = 0; i < 30; i++) {
            const date = moment(quarterStart)
              .add(i * 3, 'days')
              .toDate()

            // Larger changes for 3-month view - only after mount
            if (mounted) {
              baseValue += (Math.random() - 0.5) * 100
            }

            data.push({
              date,
              year: moment(date).format('YYYY'),
              displayDate: moment(date).format('MMM DD'),
              value: Math.max(50, Math.round(baseValue)),
            })
          }
          break

        case '1Y':
          // For 1Y, create data for all 12 months of the selected year
          // Start from January of the selected year
          const yearStart = moment().month(0).date(1).year(selectedYearInt)

          // Generate 12 monthly data points
          for (let i = 0; i < 12; i++) {
            const date = moment(yearStart).add(i, 'months').toDate()

            // Significant changes for yearly view - only after mount
            if (mounted) {
              baseValue += (Math.random() - 0.5) * 150
            }

            data.push({
              date,
              year: moment(date).format('YYYY'),
              displayDate: moment(date).format('MMM YYYY'),
              value: Math.max(50, Math.round(baseValue)),
            })
          }
          break

        case 'ALL':
          // Generate yearly data for all available years (7 years)
          baseValue = 500 // Start with a base value

          // Sort years in ascending order
          const sortedYears = [...availableYears].sort()

          for (let i = 0; i < sortedYears.length; i++) {
            const yearValue = sortedYears[i]
            // Use mid-year point for better visualization
            const date = moment(yearValue, 'YYYY').startOf('year').toDate()

            // Yearly trend with some randomness - only after mount
            if (mounted) {
              baseValue += 100 + (Math.random() - 0.3) * 200
            }

            data.push({
              date,
              year: yearValue,
              displayDate: yearValue,
              value: Math.max(50, Math.round(baseValue)),
            })
          }
          break

        default:
          console.warn(`Unexpected date range: ${range}`)
          break
      }

      // Ensure data is sorted chronologically
      return data.sort((a, b) => a.date.getTime() - b.date.getTime())
    },
    [availableYears, mounted], // Add mounted as a dependency
  )

  // Update chart options based on date range
  const getChartOptions = useCallback(
    (range: DateRangeType): ChartOptions<'line'> => {
      const colors = getThemeColors()
      let unit: TimeUnit = 'day'
      let tooltipFormat = 'MMM DD, YYYY'

      switch (range) {
        case '1D':
          unit = 'hour'
          tooltipFormat = 'HH:mm, DD/MM/YYYY'
          break
        case '7D':
          unit = 'day'
          tooltipFormat = 'DD/MM/YYYY'
          break
        case '1M':
          unit = 'day'
          tooltipFormat = 'DD/MM/YYYY'
          break
        case '3M':
          unit = 'week'
          tooltipFormat = 'DD/MM/YYYY'
          break
        case '1Y':
          unit = 'month'
          tooltipFormat = 'MMM YYYY'
          break
        case 'ALL':
          unit = 'year'
          tooltipFormat = 'YYYY'
          break
        default:
          console.warn(`Unexpected date range: ${range}`)
          break
      }

      return {
        responsive: true,
        maintainAspectRatio: false,
        backgroundColor: 'transparent',
        resizeDelay: 0,
        layout: {
          padding: 0,
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit,
              tooltipFormat,
              displayFormats: {
                hour: 'HH:mm',
                day: 'MMM DD',
                week: 'MMM DD',
                month: 'MMM',
                year: 'YYYY',
              },
            },
            grid: {
              display: false, // Hide vertical grid lines for cleaner look
            },
            ticks: {
              color: colors.tickColor,
              maxTicksLimit: 6, // Limit number of x-axis labels
              font: {
                size: 11,
              },
              padding: 8, // Add spacing between labels and chart
            },
            border: {
              display: false,
            },
          },
          y: {
            beginAtZero: false,
            grid: {
              display: true,
              color: colors.gridColor,
              lineWidth: 0.5, // Thinner grid lines
              drawOnChartArea: true,
              drawTicks: false,
            },
            ticks: {
              color: colors.tickColor,
              maxTicksLimit: 5, // Limit number of y-axis labels
              font: {
                size: 11,
              },
              padding: 12, // Add spacing between price labels and chart
              callback: function (value: string | number) {
                // Simplify y-axis labels
                if (typeof value === 'number') {
                  if (value >= 1000) {
                    return (value / 1000).toFixed(1) + 'K'
                  }
                  return value.toFixed(0)
                }
                return value
              },
            },
            border: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: colors.tooltipBg,
            cornerRadius: 8,
            titleColor: colors.tooltipText,
            bodyColor: colors.tooltipText,
            borderColor: 'rgba(111, 47, 206, 0.2)',
            borderWidth: 1,
            padding: 8,
            displayColors: false, // Remove color box for cleaner tooltip
            titleFont: {
              size: 11,
              weight: 500,
            },
            bodyFont: {
              size: 12,
              weight: 600,
            },
            callbacks: {
              title: () => '', // Remove title for cleaner look
              label: (context: TooltipItem<'line'>): string => {
                if (
                  context.parsed &&
                  context.parsed.y !== null &&
                  context.parsed.y !== undefined
                ) {
                  const value = context.parsed.y
                  if (value >= 1000) {
                    return `$${(value / 1000).toFixed(1)}K`
                  }
                  return `$${value.toFixed(0)}`
                }
                return ''
              },
            },
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
        elements: {
          point: {
            radius: 0, // Hide points by default for cleaner look
            hoverRadius: 4,
            backgroundColor: '#6F2FCE',
            borderColor: 'white',
            borderWidth: 2,
            hoverBackgroundColor: '#6F2FCE',
            hoverBorderColor: 'white',
            hoverBorderWidth: 2,
          },
          line: {
            tension: 0.3, // Slightly less curved for more professional look
            borderWidth: 2,
          },
        },
      }
    },
    [getThemeColors],
  )

  // Prepare chart data from generated data
  const prepareChartData = (data: DataItem[]): ChartDataType => {
    return {
      labels: data.map((item) => item.date),
      datasets: [
        {
          label: 'Price',
          data: data.map((item) => item.value),
          borderColor: '#6F2FCE',
          backgroundColor: 'transparent', // No background fill
          fill: false, // Disable area fill completely
          tension: 0.3,
          borderWidth: 2,
          // Point styling - hidden by default, shown on hover
          pointRadius: 0,
          pointHoverRadius: 4,
          pointBackgroundColor: '#6F2FCE',
          pointHoverBackgroundColor: '#6F2FCE',
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          pointHoverBorderColor: 'white',
          pointHoverBorderWidth: 2,
          pointStyle: 'circle',
        },
      ],
    }
  }

  // Handle year selection change
  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    setIsDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle window resize to ensure chart stays properly sized
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        // Small delay to ensure container has updated dimensions
        setTimeout(() => {
          chartRef.current?.resize()
        }, 100)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mounted])

  // Handle date range change
  const handleDateRangeChange = (range: DateRangeType) => {
    setDateRange(range)
  }

  useEffect(() => {
    if (!mounted) return // Only update chart after mount

    const data = generateChartData(dateRange, selectedYear)
    setChartData(prepareChartData(data))
    setChartOptions(getChartOptions(dateRange))

    // Force chart resize after data update
    const timer = setTimeout(() => {
      if (chartRef.current) {
        chartRef.current.resize()
      }
    }, 50)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, selectedYear, actualTheme, mounted])

  // Date range selector buttons
  const dateRangeOptions: DateRangeType[] = [
    '1D',
    '7D',
    '1M',
    '3M',
    '1Y',
    'ALL',
  ]

  // Responsive: detect mobile
  const isMobile =
    mounted && typeof window !== 'undefined' && window.innerWidth < 640

  // Calculate min-width for chart area based on data points (for scroll)
  const minChartWidth =
    mounted && chartData.labels && chartData.labels.length > 0 && isMobile
      ? Math.max(320, chartData.labels.length * 60) // 60px per point, min 320px
      : '100%'

  if (!mounted) {
    return (
      <div className="bg-theme-bg-secondary border border-theme-border rounded-lg p-6 w-full transition-colors duration-300">
        <div className="animate-pulse">
          <div className="h-6 bg-theme-bg-tertiary rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-theme-bg-tertiary rounded"></div>
        </div>
      </div>
    )
  }

  const colors = getThemeColors()

  return (
    <div className="border border-theme-border rounded-lg p-4 sm:p-6 w-full transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3 sm:gap-0">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-medium text-theme transition-colors duration-300">
            Price Analysis
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Simplified Range buttons */}
          <div
            className="flex"
            style={{
              gap: '6px',
              backgroundColor: colors.selectorBg,
              padding: '3px',
              borderRadius: '8px',
            }}
          >
            {dateRangeOptions.map((range) => (
              <button
                key={range}
                onClick={() => handleDateRangeChange(range)}
                style={{
                  padding: '4px 8px',
                  backgroundColor:
                    dateRange === range ? '#6F2FCE' : 'transparent',
                  color: dateRange === range ? 'white' : colors.selectorText,
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: dateRange === range ? '600' : '400',
                  transition: 'all 0.2s ease',
                  minWidth: '28px',
                }}
              >
                {range}
              </button>
            ))}
          </div>
          {/* Ultra Modern Custom Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() =>
                dateRange !== 'ALL' && setIsDropdownOpen(!isDropdownOpen)
              }
              className={`relative rounded-xl px-4 py-2.5 text-sm font-bold cursor-pointer transition-all duration-300 border-2 ${
                dateRange === 'ALL'
                  ? 'cursor-not-allowed opacity-40 border-gray-300'
                  : isDropdownOpen
                    ? 'border-primary shadow-lg shadow-primary/20 scale-105'
                    : 'border-transparent hover:border-primary/30 hover:shadow-md hover:scale-102'
              }`}
              style={{
                background:
                  dateRange !== 'ALL'
                    ? isDropdownOpen
                      ? 'linear-gradient(135deg, rgba(111, 47, 206, 0.1) 0%, rgba(111, 47, 206, 0.05) 50%, rgba(111, 47, 206, 0.1) 100%)'
                      : `linear-gradient(135deg, ${colors.selectBg} 0%, rgba(111, 47, 206, 0.03) 100%)`
                    : colors.selectBg,
                color: dateRange !== 'ALL' ? '#6F2FCE' : colors.selectText,
                minWidth: '80px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-base">{selectedYear}</span>
                <div
                  className={`ml-3 transition-all duration-300 ${
                    isDropdownOpen ? 'rotate-180 scale-110' : 'rotate-0'
                  }`}
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Custom Dropdown Menu */}
            {isDropdownOpen && dateRange !== 'ALL' && (
              <div
                className="absolute top-full left-0 right-0 mt-2 rounded-xl border-2 border-primary/20 shadow-2xl shadow-primary/10 z-50 overflow-hidden backdrop-blur-md"
                style={{
                  background: `linear-gradient(135deg, ${colors.selectBg} 0%, rgba(111, 47, 206, 0.02) 100%)`,
                  animation: 'slideDown 0.2s ease-out',
                }}
              >
                {availableYears.map((year, index) => (
                  <div
                    key={year}
                    onClick={() => handleYearChange(year)}
                    className={`px-4 py-3 text-sm font-semibold cursor-pointer transition-all duration-200 ${
                      year === selectedYear
                        ? 'bg-primary text-white shadow-inner'
                        : 'hover:bg-primary/10 hover:text-primary'
                    }`}
                    style={{
                      color:
                        year === selectedYear ? 'white' : colors.selectText,
                      borderBottom:
                        index < availableYears.length - 1
                          ? `1px solid rgba(111, 47, 206, 0.1)`
                          : 'none',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{year}</span>
                      {year === selectedYear && (
                        <svg
                          className="h-4 w-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full overflow-x-auto" style={{ overflowY: 'hidden' }}>
        <div
          className="chart-container h-[280px] sm:h-[320px]"
          style={{
            minWidth: isMobile ? minChartWidth : '100%',
            backgroundColor: 'transparent',
          }}
        >
          {isChartReady && mounted ? (
            <Line
              ref={chartRef}
              data={chartData}
              options={{
                ...chartOptions,
                onResize: () => {
                  // Chart resize handler - ensures proper dimensions
                },
                plugins: {
                  ...chartOptions.plugins,
                  filler: {
                    propagate: false,
                  },
                },
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse">
                <div className="h-4 bg-theme-border rounded w-32 mb-4"></div>
                <div className="h-64 bg-theme-border rounded"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AmountAnalysisChart
