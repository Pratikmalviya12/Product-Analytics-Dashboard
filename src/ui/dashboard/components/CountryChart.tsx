import React from 'react'
import { Card } from '../../components'

/**
 * Country Chart Component
 * 
 * @description A horizontal bar chart showing the top 5 countries by user activity with
 * color-coded indicators, percentage breakdowns, and animated progress bars.
 * 
 * @param {Object} props - Component properties
 * @param {any[]} props.events - Array of event objects containing country information
 * 
 * @features
 * - Top 5 countries ranked by activity volume
 * - Horizontal progress bars with percentage indicators
 * - Color-coded entries for visual distinction
 * - Responsive design with flexible layout
 * - Empty state handling for no data scenarios
 * - Smooth animations on data updates
 * - Dark/light theme support
 * 
 * @dataProcessing
 * - Aggregates events by country
 * - Sorts countries by activity count (descending)
 * - Limits display to top 5 performers
 * - Calculates percentage distribution
 * - Handles edge cases (no data, single country)
 * 
 * @visualization
 * - Color palette: Blue, Red, Green, Amber, Purple
 * - Progress bars show relative activity levels
 * - Percentage values aligned to the right
 * - Consistent spacing and typography
 * 
 * @example
 * ```tsx
 * <CountryChart events={geoEvents} />
 * ```
 */
export const CountryChart = ({ events }: { events: any[] }) => {
  const countryCounts = events.reduce((acc: Record<string, number>, event: any) => {
    acc[event.country] = (acc[event.country] || 0) + 1
    return acc
  }, {})

  const total = events.length
  const countries = Object.entries(countryCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']

  return (
    <Card className="glass-card">
      <h3 className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-5 flex items-center gap-2">🌍 Top Countries</h3>

      <div className="flex flex-col gap-3">
        {countries.map(([country, count], i) => {
          const percentage = (((count as number) / total) * 100).toFixed(1)

          return (
            <div key={country} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: colors[i % colors.length] }}></div>

              <div className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">{country}</div>

              <div className="flex items-center gap-2 min-w-20">
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden min-w-10">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%`, backgroundColor: colors[i % colors.length] }}
                  ></div>
                </div>

                <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold min-w-9 text-right">{percentage}%</div>
              </div>
            </div>
          )
        })}
      </div>

      {countries.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm p-5">No data available</div>
      )}
    </Card>
  )
} 