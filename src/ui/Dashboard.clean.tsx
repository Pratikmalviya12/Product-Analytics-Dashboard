import React from 'react'
import { useUI } from '../state/store'
import { useEvents } from '../features/events/useEvents'
import { getKpis } from '../features/events/kpis'
import { Charts } from '../features/charts/Charts'
import { EventsTable } from '../features/table/EventsTable'
import { FiltersBar } from '../features/filters/FiltersBar'
import { SavedViews } from '../features/savedViews/SavedViews'
import { CSVControls } from '../features/csv/CSVControls'
import { ThemeToggle } from './ThemeToggle'
import { CookieConsent } from '../components/privacy/CookieConsent'
import { trackDashboardEvents } from '../services/analytics'
import { Event } from '../lib/types'

export function Dashboard() {
  const { seed, setCustomEvents } = useUI()
  const eventsQuery = useEvents(seed)
  const events = eventsQuery.data || []
  const kpis = React.useMemo(() => getKpis(events), [events])

  const handleCSVImport = React.useCallback((importedEvents: Event[]) => {
    setCustomEvents(importedEvents)
    trackDashboardEvents.dataExported('csv', importedEvents.length)
  }, [setCustomEvents])

  React.useEffect(() => {
    // Track theme changes and data source usage
    trackDashboardEvents.dataSourceChanged('simulated')
  }, [])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Product Analytics Dashboard
            </h1>
            <p className="text-purple-100">
              Real-time insights into user behavior and engagement
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <SavedViews />
          <CSVControls events={events} />
        </div>

        {/* Filters */}
        <FiltersBar />

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-sm font-medium text-purple-100 mb-2">Total Events</h3>
            <p className="text-3xl font-bold text-white">{kpis.totalEvents.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-sm font-medium text-purple-100 mb-2">Unique Users</h3>
            <p className="text-3xl font-bold text-white">{kpis.uniqueUsers.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-sm font-medium text-purple-100 mb-2">Sessions</h3>
            <p className="text-3xl font-bold text-white">{kpis.sessions.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-sm font-medium text-purple-100 mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-white">${kpis.revenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">Analytics Overview</h2>
          <Charts events={events} />
        </div>

        {/* Events Table */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-xl font-bold text-white">Event Stream</h2>
            <p className="text-purple-100 text-sm">
              Real-time view of user interactions and events
            </p>
          </div>
          <EventsTable events={events} />
        </div>
      </div>

      {/* Privacy Compliance */}
      <CookieConsent />
    </div>
  )
}
