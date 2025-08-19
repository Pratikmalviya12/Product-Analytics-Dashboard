import React from 'react'
import { useDashboardStore } from '../store'
import { Card } from '../../components'

/**
 * Realtime GA4 Component
 * 
 * @description A live data visualization component that displays real-time Google Analytics 4 events
 * with streaming updates, event processing stats, and interactive controls for managing live data flow.
 * 
 * @param {Object} props - Component properties
 * @param {any[]} props.realtimeEvents - Array of real-time events from GA4 Realtime API
 * @param {boolean} props.isRealtimeActive - Whether real-time streaming is currently active
 * @param {Function} props.setIsRealtimeActive - Function to toggle real-time streaming on/off
 * 
 * @features
 * - Live event streaming with real-time updates
 * - Event processing counter and statistics
 * - Visual status indicators (pulsing dot, status text)
 * - Toggle controls for starting/stopping live updates
 * - Recent events list with timestamps
 * - Gradient background with decorative elements
 * - Last update timestamp tracking
 * - Event count limiting for performance
 * 
 * @stateManagement
 * - Tracks last update timestamp automatically
 * - Maintains total processed events counter
 * - Resets counters when streaming stops
 * - Integrates with dashboard store for GA4 config
 * 
 * @conditionalRendering
 * - Only shows when GA4 is configured and authenticated
 * - Adapts display based on streaming status
 * - Shows different UI states for active/inactive modes
 * 
 * @example
 * ```tsx
 * <RealtimeGA4 
 *   realtimeEvents={liveEvents}
 *   isRealtimeActive={isStreaming}
 *   setIsRealtimeActive={setStreaming}
 * />
 * ```
 */
export const RealtimeGA4 = ({ realtimeEvents, isRealtimeActive, setIsRealtimeActive }: { realtimeEvents: any[]; isRealtimeActive: boolean; setIsRealtimeActive: (v: boolean) => void }) => {
  const { dataSource, ga4Config } = useDashboardStore()
  const [lastUpdate, setLastUpdate] = React.useState<Date | null>(null)
  const [totalEventsProcessed, setTotalEventsProcessed] = React.useState(0)

  React.useEffect(() => {
    if (realtimeEvents.length > 0 && isRealtimeActive) {
      setLastUpdate(new Date())
      setTotalEventsProcessed((prev) => prev + realtimeEvents.length)
    }
  }, [realtimeEvents, isRealtimeActive])

  React.useEffect(() => {
    if (!isRealtimeActive) {
      setTotalEventsProcessed(0)
    }
  }, [isRealtimeActive])

  if (dataSource !== 'ga4' || !ga4Config.isAuthenticated) return null

  const displayEvents = realtimeEvents.slice(0, 8)

  return (
    <Card className="glass-card bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 dark:from-indigo-700 dark:via-purple-700 dark:to-indigo-800 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 dark:bg-white/5 rounded-full transform translate-x-8 -translate-y-8"></div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 relative z-10">
        <div>
          <h3 className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-1 flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full transition-all duration-300 ${isRealtimeActive ? 'bg-red-500 animate-pulse' : 'bg-gray-400 dark:bg-gray-500'}`}></span>
            📡 Real-time Analytics
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {isRealtimeActive ? 'Live data updating dashboard' : 'Activate to see live data'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {isRealtimeActive && totalEventsProcessed > 0 && (
            <div className="bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-lg text-xs font-medium text-gray-800 dark:text-gray-200">
              {totalEventsProcessed} events processed
            </div>
          )}
          <button
            onClick={() => setIsRealtimeActive(!isRealtimeActive)}
            className={`${
              isRealtimeActive 
                ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700' 
                : 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
            } text-white border-0 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500`}
          >
            {isRealtimeActive ? '⏸️ Stop Live' : '▶️ Start Live'}
          </button>
        </div>
      </div>

      {lastUpdate && isRealtimeActive && (
        <div className="mb-6 text-xs text-gray-700 dark:text-gray-300 flex items-center gap-2 bg-white/80 dark:bg-gray-700/80 rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          <span className="font-medium">Last updated: {lastUpdate.toLocaleTimeString()}</span>
          <span className="text-gray-500 dark:text-gray-400">•</span>
          <span>Dashboard synced with live data</span>
        </div>
      )}

      {displayEvents.length > 0 ? (
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-4 border border-gray-300 dark:border-gray-600">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-gray-900 dark:text-gray-100 font-medium text-sm">Recent Events</h4>
            <span className="text-gray-600 dark:text-gray-400 text-xs">
              Showing {displayEvents.length} of {realtimeEvents.length}
            </span>
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {displayEvents.map((event) => (
              <div key={event.id} className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-white text-xs font-semibold shadow-sm ${
                          event.event === 'page_view' 
                            ? 'bg-blue-500' 
                            : event.event === 'click' 
                            ? 'bg-amber-500' 
                            : event.event === 'purchase' 
                            ? 'bg-green-500' 
                            : 'bg-purple-500'
                        }`}
                      >
                        {event.event.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium text-sm truncate">
                        {event.country}
                      </span>
                      {event.id.startsWith('realtime_') && (
                        <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-semibold animate-pulse shadow-sm">
                          LIVE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        📱 <span className="font-medium">{event.device}</span>
                      </span>
                      {event.revenue > 0 && (
                        <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                          💰 <span>${event.revenue}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-right font-mono shrink-0">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-8 text-center border border-gray-300 dark:border-gray-600">
          <div className="text-4xl mb-4 opacity-60 dark:opacity-50">
            {isRealtimeActive ? '⏳' : '📊'}
          </div>
          <h4 className="text-gray-900 dark:text-gray-100 font-semibold text-base mb-2">
            {isRealtimeActive ? 'Listening for Events' : 'Real-time Analytics'}
          </h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {isRealtimeActive ? 'Waiting for real-time events to appear...' : 'Click "Start Live" to begin monitoring real-time analytics'}
          </p>
        </div>
      )}
    </Card>
  )
} 