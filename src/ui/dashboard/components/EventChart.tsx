import React from 'react'
import { Card } from '../../components'

export const EventChart = ({ events }: { events: any[] }) => {
  const days = 14
  const now = Date.now()
  const msPerDay = 24 * 60 * 60 * 1000

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
        📈 Events & Revenue Trends (Last 14 Days)
      </h3>
      <svg width="100%" height="300" viewBox="0 0 800 300">
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="60"
            y1={60 + i * 48}
            x2="740"
            y2={60 + i * 48}
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-200 dark:text-gray-700"
          />
        ))}

        {dailyData.map((d, i) => {
          const x = 60 + i * 48 + 5
          const barHeight = (d.events / maxEvents) * 180
          const y = 240 - barHeight

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
          points={dailyData.map((d, i) => `${60 + i * 48 + 15},${240 - (d.revenue / maxRevenue) * 180}`).join(' ')}
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
        />

        {dailyData.map((d, i) => {
          const x = 60 + i * 48 + 15
          const y = 240 - (d.revenue / maxRevenue) * 180

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