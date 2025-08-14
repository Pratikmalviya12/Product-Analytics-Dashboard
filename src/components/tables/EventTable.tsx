import React from 'react'
import { useTheme } from '../../lib/ThemeContext'
import { Card } from '../components'

export const EventTable = ({ events }) => {
  const { theme } = useTheme()
  
  // Safety check for events array
  if (!events || !Array.isArray(events) || events.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 text-sm">
        No events to display
      </div>
    )
  }
  
  return (
    <div className="overflow-hidden">
      {/* Table Header */}
      <div 
        className="grid grid-cols-6 gap-3 px-4 py-3 text-xs font-semibold uppercase border-b
          bg-gray-50 border-gray-200 text-gray-600
          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
      >
        <div>Event Type</div>
        <div>User ID</div>
        <div>Device</div>
        <div>Country</div>
        <div>Time</div>
        <div>Revenue</div>
      </div>
      
      {/* Table Rows */}
      {events.map((event, i) => (
        <div 
          key={i} 
          className={`grid grid-cols-6 gap-3 px-4 py-3 text-sm border-b last:border-b-0
            border-gray-200 dark:border-gray-700 ${
            event.event === 'purchase' 
              ? 'bg-green-50 dark:bg-green-500/10' 
              : 'bg-white dark:bg-gray-800'
          }`}
        >
          <div 
            className={`${event.event === 'purchase' ? 'font-semibold text-green-500' : 'text-gray-900 dark:text-gray-100'}`}
          >
            {event.event === 'purchase' && '💰 '}{(event.event || '').replace('_', ' ')}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {typeof event.userId === 'string' && event.userId.includes('_') 
              ? event.userId.split('_')[1] 
              : event.userId || 'N/A'}
          </div>
          <div className="text-gray-900 dark:text-gray-100">{event.device || 'Unknown'}</div>
          <div className="text-gray-900 dark:text-gray-100">{event.country || 'Unknown'}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {event.timestamp ? new Date(event.timestamp).toLocaleDateString() : 'N/A'}
          </div>
          <div 
            className={`${event.revenue && event.revenue > 0 ? 'font-semibold text-green-500' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {event.revenue && event.revenue > 0 ? `$${event.revenue}` : '—'}
          </div>
        </div>
      ))}
      
      <div 
        className="py-4 text-center text-sm
          text-gray-500 bg-gray-50
          dark:text-gray-400 dark:bg-gray-800"
      >
        Showing first 20 of {events.length.toLocaleString()} events
      </div>
    </div>
  )
}
