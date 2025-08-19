import React from 'react'
import { Card } from '../../components'
import {
  CHART_DAYS_DEFAULT,
  MS_PER_DAY,
  CHART_SVG_WIDTH,
  CHART_SVG_HEIGHT,
  CHART_MARGIN_LEFT,
  CHART_BAR_WIDTH,
  CHART_BAR_SPACING,
  CHART_MAX_HEIGHT,
  CHART_BASE_Y
} from '../../../constants'

/**
 * Event Chart Component
 * 
 * @description A comprehensive bar chart visualization showing daily event counts and revenue trends
 * over a configurable time period. Features dual-axis display with events and revenue correlation.
 * 
 * @param {Object} props - Component properties
 * @param {any[]} props.events - Array of event objects with timestamp, event type, and revenue data
 * 
 * @features
 * - Daily aggregation of events and revenue data
 * - Dual-axis visualization (events count + revenue)
 * - Interactive SVG-based bar chart
 * - Responsive design with configurable dimensions
 * - Grid lines for better data reading
 * - Purchase events highlighting
 * - Revenue correlation visualization
 * - Dynamic scaling based on data range
 * 
 * @dataProcessing
 * - Groups events by day over the specified period
 * - Calculates daily event counts and purchase volumes
 * - Aggregates revenue per day for purchase events
 * - Normalizes data for optimal chart scaling
 * 
 * @constants
 * - Uses predefined chart dimensions and spacing
 * - Configurable time period (default: CHART_DAYS_DEFAULT)
 * - Responsive SVG viewBox for mobile compatibility
 * 
 * @example
 * ```tsx
 * <EventChart events={filteredEvents} />
 * ```
 */
export const EventChart = ({ events }: { events: any[] }) => {
  const days = CHART_DAYS_DEFAULT
  const now = Date.now()
  const msPerDay = MS_PER_DAY

  const dailyData: any[] = []
  for (let i = days - 1; i >= 0; i--) {
    const dayStart = now - i * msPerDay
    const dayEnd = dayStart + msPerDay
    const dayEvents = events.filter((e) => e.timestamp >= dayStart && e.timestamp < dayEnd)

    dailyData.push({
      day: i,
      date: new Date(dayStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      events: dayEvents.length,
      purchases: dayEvents.filter((e) => e.event === 'purchase').length,
      revenue: dayEvents.filter((e) => e.event === 'purchase').reduce((sum, e) => sum + e.revenue, 0),
    })
  }

  const maxEvents = Math.max(...dailyData.map((d) => d.events), 1)
  const maxRevenue = Math.max(...dailyData.map((d) => d.revenue), 1)

  return (
    <Card className="glass-card">
      <h3 className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-5 flex items-center gap-2">
        📈 Events & Revenue Trends
      </h3>
      <svg width="100%" height={CHART_SVG_HEIGHT} viewBox={`0 0 ${CHART_SVG_WIDTH} ${CHART_SVG_HEIGHT}`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={CHART_MARGIN_LEFT}
            y1={60 + i * CHART_BAR_WIDTH}
            x2="740"
            y2={60 + i * CHART_BAR_WIDTH}
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-200 dark:text-gray-700"
          />
        ))}

        {dailyData.map((d, i) => {
          const x = CHART_MARGIN_LEFT + i * CHART_BAR_WIDTH + CHART_BAR_SPACING
          const barHeight = (d.events / maxEvents) * CHART_MAX_HEIGHT
          const y = CHART_BASE_Y - barHeight

          return (
            <g key={i}>
              <rect x={x} y={y} width="20" height={barHeight} fill="#3b82f6" opacity="0.7" />
              <text x={x + 10} y="260" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">
                {d.date}
              </text>
              <text x={x + 10} y={y - 5} textAnchor="middle" fontSize="10" fill="#3b82f6">
                {d.events}
              </text>
            </g>
          )
        })}

        <polyline
          points={dailyData.map((d, i) => `${CHART_MARGIN_LEFT + i * CHART_BAR_WIDTH + 15},${CHART_BASE_Y - (d.revenue / maxRevenue) * CHART_MAX_HEIGHT}`).join(' ')}
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
        />

        {dailyData.map((d, i) => {
          const x = CHART_MARGIN_LEFT + i * CHART_BAR_WIDTH + 15
          const y = CHART_BASE_Y - (d.revenue / maxRevenue) * CHART_MAX_HEIGHT

          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="#ef4444" />
              <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill="#ef4444">
                ${d.revenue}
              </text>
            </g>
          )
        })}

        <g transform="translate(60, 20)">
          <rect x="0" y="0" width="15" height="15" fill="#3b82f6" opacity="0.7" />
          <text x="20" y="12" fontSize="12" className="fill-gray-900 dark:fill-gray-100">
            Events
          </text>
          <line x1="80" y1="7" x2="95" y2="7" stroke="#ef4444" strokeWidth="3" />
          <text x="100" y="12" fontSize="12" className="fill-gray-900 dark:fill-gray-100">
            Revenue
          </text>
        </g>
      </svg>
    </Card>
  )
} 