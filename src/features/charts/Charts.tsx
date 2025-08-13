import React from 'react'
import { Event } from '@/lib/types'
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { format } from 'date-fns'
import memoize from 'memoize-one'

type ChartData = {
  daily: Array<{ date: string; users: number; sessions: number; events: number }>
  byDevice: Array<{ name: string; value: number; color: string }>
  byEvent: Array<{ name: string; value: number }>
}

const prepareChartData = memoize((events: Event[]): ChartData => {
  // Daily metrics
  const dailyMap = new Map<string, { users: Set<string>; sessions: Set<string>; events: number }>()
  
  events.forEach(event => {
    const dateKey = format(new Date(event.timestamp), 'MMM dd')
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, { users: new Set(), sessions: new Set(), events: 0 })
    }
    const day = dailyMap.get(dateKey)!
    day.users.add(event.userId)
    day.sessions.add(event.sessionId)
    day.events++
  })

  const daily = Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      users: data.users.size,
      sessions: data.sessions.size,
      events: data.events
    }))
    .sort((a, b) => new Date(`2024 ${a.date}`).getTime() - new Date(`2024 ${b.date}`).getTime())

  // Device breakdown
  const deviceMap = new Map<string, number>()
  events.forEach(event => {
    deviceMap.set(event.device, (deviceMap.get(event.device) || 0) + 1)
  })

  const deviceColors = { desktop: '#8884d8', mobile: '#82ca9d', tablet: '#ffc658' }
  const byDevice = Array.from(deviceMap.entries()).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: deviceColors[name as keyof typeof deviceColors] || '#666'
  }))

  // Event type breakdown
  const eventMap = new Map<string, number>()
  events.forEach(event => {
    eventMap.set(event.event, (eventMap.get(event.event) || 0) + 1)
  })

  const byEvent = Array.from(eventMap.entries()).map(([name, value]) => ({
    name: name.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    value
  }))

  return { daily, byDevice, byEvent }
})

type ChartsProps = {
  events: Event[]
}

export function Charts({ events }: ChartsProps) {
  const chartData = React.useMemo(() => prepareChartData(events), [events])

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* Daily Trends */}
      <div style={{ height: 300, padding: 16, border: '1px solid var(--divider, #ccc)', borderRadius: 8 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 600 }}>Daily Trends</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData.daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #ccc', 
                borderRadius: 4,
                fontSize: 12
              }} 
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="users" 
              stackId="1" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.6}
              name="Users"
            />
            <Area 
              type="monotone" 
              dataKey="sessions" 
              stackId="1" 
              stroke="#82ca9d" 
              fill="#82ca9d" 
              fillOpacity={0.6}
              name="Sessions"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Device Breakdown */}
        <div style={{ height: 300, padding: 16, border: '1px solid var(--divider, #ccc)', borderRadius: 8 }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 600 }}>Device Breakdown</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.byDevice}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.byDevice.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ccc', 
                  borderRadius: 4,
                  fontSize: 12
                }} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Event Types */}
        <div style={{ height: 300, padding: 16, border: '1px solid var(--divider, #ccc)', borderRadius: 8 }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 600 }}>Event Types</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.byEvent}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ccc', 
                  borderRadius: 4,
                  fontSize: 12
                }} 
              />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
