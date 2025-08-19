import React from 'react'
import { useDashboardStore } from '../store'

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
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 dark:bg-white/5 rounded-full transform translate-x-8 -translate-y-8"></div>

      <div className="flex justify-between items-center mb-5 relative z-10">
        <div>
          <h3 className="m-0 mb-1 text-white flex items-center gap-2 text-lg font-semibold">
            <span className={`inline-block w-3 h-3 rounded-full ${isRealtimeActive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></span>
            Real-time Analytics
          </h3>
          <p className="m-0 text-sm text-white/80">{isRealtimeActive ? 'Live data updating dashboard' : 'Activate to see live data'}</p>
        </div>

        <div className="flex items-center gap-3">
          {isRealtimeActive && totalEventsProcessed > 0 && (
            <div className="bg-white/20 dark:bg-white/10 px-3 py-1 rounded-full text-xs font-medium">{totalEventsProcessed} events processed</div>
          )}
          <button
            onClick={() => setIsRealtimeActive(!isRealtimeActive)}
            className={`${isRealtimeActive ? 'bg-red-500/90 hover:bg-red-500' : 'bg-green-500/90 hover:bg-green-500'} text-white border-0 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium flex items-center gap-2 transition-all duration-200 hover:scale-105`}
          >
            {isRealtimeActive ? '⏸️ Stop Live' : '▶️ Start Live'}
          </button>
        </div>
      </div>

      {lastUpdate && isRealtimeActive && (
        <div className="mb-5 text-xs text-white/70 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          Last updated: {lastUpdate.toLocaleTimeString()} • Dashboard synced with live data
        </div>
      )}

      {displayEvents.length > 0 ? (
        <div className="bg-white/10 dark:bg-gray-800/20 rounded-xl p-4 backdrop-blur-sm border border-white/10 dark:border-gray-700/20">
          <div className="grid gap-3 max-h-60 overflow-y-auto pr-2">
            {displayEvents.map((event) => (
              <div key={event.id} className="bg-white/10 dark:bg-gray-800/30 p-3 rounded-lg flex justify-between items-center border border-white/10 dark:border-gray-700/20 transition-all duration-200 animate-in slide-in-from-top">
                <div>
                  <div className="text-sm font-medium mb-1 flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-white text-xs font-semibold ${
                        event.event === 'page_view' ? 'bg-blue-500' : event.event === 'click' ? 'bg-amber-500' : event.event === 'purchase' ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                    >
                      {event.event.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-white">{event.country}</span>
                    {event.id.startsWith('realtime_') && <span className="bg-red-500/80 text-white px-1.5 py-0.5 rounded-full text-xs font-semibold">LIVE</span>}
                  </div>
                  <div className="text-xs text-white/70 flex items-center gap-2">
                    <span>📱 {event.device}</span>
                    {event.revenue > 0 && <span className="text-green-400 font-medium">💰 ${event.revenue}</span>}
                  </div>
                </div>
                <div className="text-xs text-white/60 text-right">{new Date(event.timestamp).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white/10 dark:bg-gray-800/20 rounded-xl p-8 text-center backdrop-blur-sm border border-white/10 dark:border-gray-700/20">
          <div className="text-5xl mb-3 opacity-50">{isRealtimeActive ? '⏳' : '📊'}</div>
          <p className="text-white/80 m-0 text-sm">{isRealtimeActive ? 'Listening for real-time events...' : 'Click "Start Live" to see real-time analytics'}</p>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideIn {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
} 