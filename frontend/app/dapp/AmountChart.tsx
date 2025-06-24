'use client'
import React, { useState, useEffect, useCallback } from 'react'
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
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-moment'
import moment from 'moment'
// import { useMediaQuery } from 'react-responsive'

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
  const [dateRange, setDateRange] = useState<DateRangeType>(initialDateRange)
  const [chartData, setChartData] = useState<ChartDataType>({
    labels: [],
    datasets: [],
  })
  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>({})
  const [selectedYear, setSelectedYear] = useState<string>(
    moment().format('YYYY'),
  )

  // Available years (last 7 years)
  const availableYears = Array.from({ length: 7 }, (_, i) =>
    moment().subtract(i, 'years').format('YYYY'),
  )

  // Generate mock data based on date range
  const generateChartData = useCallback(
    (range: DateRangeType, year?: string): DataItem[] => {
      const data: DataItem[] = []

      // Parse the selected year
      const currentYear = parseInt(moment().format('YYYY'))
      const selectedYearInt = year ? parseInt(year) : currentYear

      // Base value for the chart (starting point)
      let baseValue = 500 + Math.random() * 500

      switch (range) {
        case '1D':
          // For 1D, create data for the current day but in the selected year
          const dayStart =
            selectedYearInt === currentYear
              ? moment().startOf('day')
              : moment().startOf('day').year(selectedYearInt)

          // Generate 24 hourly data points
          for (let i = 0; i < 24; i++) {
            const date = moment(dayStart).add(i, 'hours').toDate()

            // Small random changes for hourly data
            baseValue += (Math.random() - 0.5) * 20

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

          // Generate 7 daily data points
          for (let i = 0; i < 7; i++) {
            const date = moment(weekStart).add(i, 'days').toDate()

            // Slightly larger changes for daily data
            baseValue += (Math.random() - 0.5) * 50

            data.push({
              date,
              year: moment(date).format('YYYY'),
              displayDate: moment(date).format('MMM DD'),
              value: Math.max(50, Math.round(baseValue)),
            })
          }
          break

        case '1M':
          // For 1M, create data for the last 30 days but in the selected year
          const monthStart =
            selectedYearInt === currentYear
              ? moment().subtract(15, 'days').startOf('day')
              : moment()
                  .subtract(15, 'days')
                  .startOf('day')
                  .year(selectedYearInt)

          // Generate 30 daily data points
          for (let i = 0; i < 15; i++) {
            const date = moment(monthStart).add(i, 'days').toDate()

            // More noticeable changes for monthly view
            baseValue += (Math.random() - 0.5) * 60

            data.push({
              date,
              year: moment(date).format('YYYY'),
              displayDate: moment(date).format('MMM DD'),
              value: Math.max(50, Math.round(baseValue)),
            })
          }
          break

        case '3M':
          // For 3M, create data for the last 12 weeks but in the selected year
          const quarterStart =
            selectedYearInt === currentYear
              ? moment().subtract(11, 'weeks').startOf('week')
              : moment()
                  .subtract(11, 'weeks')
                  .startOf('week')
                  .year(selectedYearInt)

          // Generate 12 weekly data points
          for (let i = 0; i < 12; i++) {
            const date = moment(quarterStart).add(i, 'weeks').toDate()

            // Larger changes for 3-month view
            baseValue += (Math.random() - 0.5) * 100

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

            // Significant changes for yearly view
            baseValue += (Math.random() - 0.5) * 150

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

            // Yearly trend with some randomness
            baseValue += 100 + (Math.random() - 0.3) * 200

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
    [availableYears], // Add availableYears as a dependency since it's used in the ALL case
  )

  // Update chart options based on date range
  const getChartOptions = useCallback(
    (range: DateRangeType): ChartOptions<'line'> => {
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
              display: true,
              color: '#292929',
              lineWidth: 1,
              drawOnChartArea: true,
              drawTicks: true,
            },
            ticks: {
              color: '#FFFFFF',
            },
          },
          y: {
            beginAtZero: false,
            grid: {
              display: true,
              color: '#292929',
              lineWidth: 1,
              drawOnChartArea: true,
              drawTicks: true,
            },
          },
        },
        plugins: {
          legend: {
            display: false, // Hide legend since we only have one dataset
          },
          tooltip: {
            mode: 'index',
            intersect: false, // Allow tooltip when near point
            backgroundColor: '#272729',
            cornerRadius: 10,
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: '#6F2FCE',
            borderWidth: 0,
            padding: 12,
            displayColors: true,
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true, // This makes the legend markers circular
            // @ts-expect-error Chart.js types don't properly define pointStyle as allowing 'circle'
            pointStyle: 'circle',
            boxPadding: 3,
            callbacks: {
              label: (context: TooltipItem<'line'>): string => {
                let label = 'Price: '
                if (
                  context.parsed &&
                  context.parsed.y !== null &&
                  context.parsed.y !== undefined
                ) {
                  label += `${context.parsed.y.toLocaleString()}`
                }
                return label
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
            radius: 3, // Center point size
            hoverRadius: 4,
            backgroundColor: '#6F2FCE', // Center point color
            borderColor: 'rgba(0, 0, 0, 0)', // Transparent space
            borderWidth: 5, // Width of transparent space
            hoverBackgroundColor: '#6F2FCE',
            hoverBorderColor: '6F2FCE',
            hoverBorderWidth: 5,
          },
          line: {
            tension: 0.4, // Smooth curve
          },
        },
      }
    },
    [],
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
          backgroundColor: 'rgba(111, 47, 206, 0.1)', // Area fill color
          fill: true,
          tension: 0.4,
          // Point styling
          pointRadius: 3, // Center point size
          pointHoverRadius: 4, // Slightly larger on hover
          pointBackgroundColor: '#6F2FCE', // Center point color
          pointHoverBackgroundColor: '#6F2FCE',
          pointBorderColor: 'rgba(0, 0, 0, 0)', // Transparent space
          pointBorderWidth: 5, // Width of transparent space
          pointHoverBorderColor: 'rgba(0, 0, 0, 0)',
          pointHoverBorderWidth: 5,
          // We'll use a custom point style with the outer border
          pointStyle: 'circle',
          // Additional styling for tooltip
          hoverBackgroundColor: '#6F2FCE',
        },
      ],
    }
  }

  // Handle year selection change
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value)
  }

  // Handle date range change
  const handleDateRangeChange = (range: DateRangeType) => {
    setDateRange(range)
  }

  useEffect(() => {
    const data = generateChartData(dateRange, selectedYear)
    setChartData(prepareChartData(data))
    setChartOptions(getChartOptions(dateRange))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, selectedYear])

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
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640

  // Calculate min-width for chart area based on data points (for scroll)
  const minChartWidth = chartData.labels && chartData.labels.length > 0 && isMobile
    ? Math.max(320, chartData.labels.length * 60) // 60px per point, min 320px
    : '100%'

  return (
    <div className="bg-[#1C1D1F] rounded-lg p-6 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-white">Price Analysis</h2>
        </div>
        {/* Desktop: Range buttons */}
        <div className="hidden sm:flex" style={{
          display: 'flex',
          gap: '10px',
          backgroundColor: '#272729',
          padding: '4px',
          borderRadius: '7.1px',
        }}>
          {dateRangeOptions.map((range) => (
            <button
              key={range}
              onClick={() => handleDateRangeChange(range)}
              style={{
                padding: '6px 8px',
                backgroundColor:
                  dateRange === range ? '#6F2FCE' : 'transparent',
                color: dateRange === range ? 'white' : '#8E9BAE',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12.93px',
                fontWeight: dateRange === range ? 'bold' : 'normal',
              }}
            >
              {range}
            </button>
          ))}
        </div>
        <div className="relative ml-2">
          <select
            value={selectedYear}
            onChange={handleYearChange}
            disabled={dateRange === 'ALL'}
            className={`bg-[#2D2F34] text-gray-300 rounded-md px-3 py-1 text-sm font-medium appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-[#6F2FCE] ${
              dateRange === 'ALL'
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer'
            }`}
            style={{
              color: dateRange !== 'ALL' ? '#6F2FCE' : '#9CA3AF',
            }}
          >
            {availableYears.map((year) => (
              <option
                key={year}
                value={year}
                style={{
                  color: year === selectedYear ? '#6F2FCE' : '#9CA3AF',
                  backgroundColor: '#2D2F34',
                }}
              >
                {year}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-[75%] flex items-center px-2 text-gray-400">
            <svg
              className="h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="w-full overflow-x-auto" style={{overflowY: 'hidden'}}>
        <div className="h-[320px]" style={{ minWidth: isMobile ? minChartWidth : '100%' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default AmountAnalysisChart
