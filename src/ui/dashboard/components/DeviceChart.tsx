import React from 'react'
import { Card } from '../../components'

export const DeviceChart = ({ events }: { events: any[] }) => {
  const deviceCounts = events.reduce((acc: Record<string, number>, event: any) => {
    acc[event.device] = (acc[event.device] || 0) + 1
    return acc
  }, {})

  const total = events.length
  const devices = Object.entries(deviceCounts)
  const colors = ['#3b82f6', '#ef4444', '#10b981']

  let currentAngle = 0

  return (
    <Card className="glass-card">
      <h3 className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-5 flex items-center gap-2">📱 Device Breakdown</h3>
      <div className="flex items-center gap-8">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <g transform="translate(100, 100)">
            {devices.map(([device, count], i) => {
              const percentage = (count as number) / total
              const angle = percentage * 2 * Math.PI
              const endAngle = currentAngle + angle

              const x1 = Math.cos(currentAngle) * 80
              const y1 = Math.sin(currentAngle) * 80
              const x2 = Math.cos(endAngle) * 80
              const y2 = Math.sin(endAngle) * 80

              const largeArcFlag = angle > Math.PI ? 1 : 0

              const pathData = [`M 0 0`, `L ${x1} ${y1}`, `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`, 'Z'].join(' ')

              const result = (
                <path
                  key={device}
                  d={pathData}
                  fill={colors[i % colors.length]}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="stroke-white dark:stroke-gray-800"
                />
              )

              currentAngle = endAngle
              return result
            })}
          </g>
        </svg>
        <div className="flex flex-col gap-3">
          {devices.map(([device, count], i) => (
            <div key={device} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: colors[i % colors.length] }}></div>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {device}: {(count as number).toLocaleString()} ({(((count as number) / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
} 