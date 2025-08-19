import React from 'react'
import { theme } from '../lib/theme'
import { Button, Card, StatusBadge, Input, LoadingSpinner, Select } from './components'
import { ThemeToggle } from './ThemeToggle'
import { AgGridEvents } from '../features/table/AgGridEvents'
import { trackDashboardEvents } from '../services/analytics'
import { useDashboardStore } from './dashboard/store'
import { generateEvents, calculateKpis, formatCompact } from './dashboard/utils'
import { fetchGA4Data, fetchGA4RealtimeData } from './dashboard/ga4'
import { EventChart } from './dashboard/components/EventChart'
import { DeviceChart } from './dashboard/components/DeviceChart'
import { CountryChart } from './dashboard/components/CountryChart'
import { GA4Setup } from './dashboard/components/GA4Setup'
import { RealtimeGA4 } from './dashboard/components/RealtimeGA4'
import { SavedViews } from './dashboard/components/SavedViews'
import { AdvancedFilters } from './dashboard/components/AdvancedFilters'
import { KpiCard } from './dashboard/components/KpiCard'

export function Dashboard() {
  const { seed, setSeed, filters, setFilters, dataSource, ga4Config } = useDashboardStore()
  const [ga4Events, setGA4Events] = React.useState<any[]>([])
  const [isLoadingGA4, setIsLoadingGA4] = React.useState(false)
  const [realtimeEvents, setRealtimeEvents] = React.useState<any[]>([])
  const [isRealtimeActive, setIsRealtimeActive] = React.useState(false)

  React.useEffect(() => {
    trackDashboardEvents.dataSourceChanged(dataSource)
  }, [])

  React.useEffect(() => {
    if (dataSource === 'ga4' && ga4Config.isAuthenticated) {
      setIsLoadingGA4(true)

      const dateRange = filters.dateRange?.start && filters.dateRange?.end
        ? { start: filters.dateRange.start, end: filters.dateRange.end }
        : { start: '30daysAgo', end: 'today' }

      fetchGA4Data(ga4Config.propertyId, ga4Config.serviceAccountJson, dateRange)
        .then((data) => {
          setGA4Events(data)
          setIsLoadingGA4(false)
        })
        .catch((error) => {
          console.error('GA4 fetch error:', error)
          setIsLoadingGA4(false)
        })
    }
  }, [dataSource, ga4Config.isAuthenticated, ga4Config.propertyId, ga4Config.serviceAccountJson, filters.dateRange])

  React.useEffect(() => {
    if (dataSource !== 'ga4' || !ga4Config.isAuthenticated || !isRealtimeActive) {
      return
    }

    const fetchRealtimeData = async () => {
      try {
        const newEvents = await fetchGA4RealtimeData(ga4Config.propertyId, ga4Config.serviceAccountJson)

        setRealtimeEvents((prevEvents) => {
          const combinedEvents = [...newEvents, ...prevEvents]
          const oneHourAgo = Date.now() - 60 * 60 * 1000
          return combinedEvents
            .filter((event) => event.timestamp > oneHourAgo)
            .slice(0, 500)
            .sort((a, b) => b.timestamp - a.timestamp)
        })

        if (Math.random() < 0.1) {
          const data = await fetchGA4Data(ga4Config.propertyId, ga4Config.serviceAccountJson)
          setGA4Events(data)
        }
      } catch (error) {
        console.error('Real-time fetch error:', error)
      }
    }

    fetchRealtimeData()

    const interval = setInterval(fetchRealtimeData, 10000)

    return () => clearInterval(interval)
  }, [dataSource, ga4Config.isAuthenticated, isRealtimeActive, ga4Config.propertyId, ga4Config.serviceAccountJson])

  const allEvents = React.useMemo(() => {
    if (dataSource === 'ga4') {
      if (isRealtimeActive && realtimeEvents.length > 0) {
        const combinedEvents = [...realtimeEvents, ...ga4Events]
        const uniqueEvents = combinedEvents.filter((event, index, self) => index === self.findIndex((e) => e.id === event.id))
        return uniqueEvents.sort((a, b) => b.timestamp - a.timestamp)
      }
      return ga4Events
    }
    return generateEvents(seed, 50000)
  }, [dataSource, ga4Events, seed, isRealtimeActive, realtimeEvents])

  const events = React.useMemo(() => {
    let filtered = allEvents

    if (filters.showPurchasesOnly) {
      filtered = filtered.filter((e) => e.event === 'purchase')
    }

    if (filters.selectedCountry && filters.selectedCountry !== 'all') {
      filtered = filtered.filter((e) => e.country === filters.selectedCountry)
    }

    if (filters.selectedDevice && filters.selectedDevice !== 'all') {
      filtered = filtered.filter((e) => e.device === filters.selectedDevice)
    }

    if (filters.eventType && filters.eventType !== 'all') {
      filtered = filtered.filter((e) => e.event === filters.eventType)
    }

    if (filters.dateRange?.start || filters.dateRange?.end) {
      const startTime = filters.dateRange?.start ? new Date(filters.dateRange.start).getTime() : 0
      const endTime = filters.dateRange?.end ? new Date(filters.dateRange.end).getTime() + 24 * 60 * 60 * 1000 : Date.now()

      filtered = filtered.filter((e) => e.timestamp >= startTime && e.timestamp <= endTime)
    }

    return filtered
  }, [allEvents, filters])

  const kpis = React.useMemo(() => calculateKpis(events), [events])
  const uniqueCountries = React.useMemo(() => [...new Set(allEvents.map((e) => e.country))].sort(), [allEvents])

  return (
    <main className="text-black min-h-screen font-sans">
      <div className="bg-white bg-opacity-5 backdrop-blur-lg min-h-screen p-6">
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        ></div>

        <div className="relative z-10">
          <header className="glass-card mb-8 p-8 shadow-xl relative overflow-hidden animate-fade-in">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white bg-opacity-5 rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white bg-opacity-5 rounded-full"></div>

            <div className="absolute top-4 right-4 z-20">
              <ThemeToggle />
            </div>

            <div className="relative z-10">
              <h1 className="text-white dark:text-white text-3xl mb-3 font-bold">📊 Product Analytics Dashboard</h1>
              <div className="flex flex-wrap gap-3 items-center mb-4">
                <StatusBadge status="info" className="text-xs">{allEvents.length.toLocaleString()} total events</StatusBadge>
                <StatusBadge status="neutral" className="text-xs">{events.length.toLocaleString()} filtered</StatusBadge>
                {dataSource === 'simulated' && (
                  <StatusBadge status="info" className="text-xs">🎲 Seed: {seed}</StatusBadge>
                )}
                {dataSource === 'ga4' && ga4Config.isAuthenticated && (
                  <StatusBadge status={isRealtimeActive ? 'error' : 'success'} className="text-xs flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isRealtimeActive ? 'bg-white animate-pulse' : 'bg-white'}`}></span>
                    {isRealtimeActive ? 'Live Dashboard Mode' : 'GA4 Connected'}
                  </StatusBadge>
                )}
              </div>

              <div className="flex gap-4 items-center flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-white text-sm font-medium">Country:</label>
                  <Select
                    value={filters.selectedCountry || 'all'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters({ selectedCountry: e.target.value === 'all' ? null : e.target.value })}
                    className="min-w-[140px] bg-white bg-opacity-20 text-white border-white border-opacity-30 backdrop-blur-md"
                  >
                    <option value="all" className="text-gray-800">
                      All Countries
                    </option>
                    {uniqueCountries.map((country) => (
                      <option key={country} value={country} className="text-gray-800">
                        {country}
                      </option>
                    ))}
                  </Select>
                </div>

                <label className="flex items-center gap-2 text-sm bg-white bg-opacity-10 px-4 py-2.5 rounded-lg cursor-pointer border border-white border-opacity-20 backdrop-blur-md hover:bg-opacity-20 transition-all duration-300">
                  <Input
                    type="checkbox"
                    checked={filters.showPurchasesOnly}
                    onChange={(e: any) => setFilters({ showPurchasesOnly: e.target.checked })}
                    className="accent-green-500 scale-110"
                  />
                  <span className="text-white font-medium">💰 Purchases only</span>
                </label>

                <Button variant="success" size="medium" onClick={() => setSeed(Math.floor(Math.random() * 1000))} className="flex items-center gap-2 font-medium">
                  🎲 Randomize Data
                </Button>
              </div>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
            <KpiCard label="Total Users" value={formatCompact(kpis.users)} change="+12.3%" positive={true} />
            <KpiCard label="Sessions" value={formatCompact(kpis.sessions)} change="+8.7%" positive={true} />
            <KpiCard label="Conversion Rate" value={`${(kpis.conversion * 100).toFixed(1)}%`} change="-2.1%" positive={false} />
            <KpiCard label="Revenue" value={`$${formatCompact(kpis.revenue)}`} change="+15.4%" positive={true} />
          </section>

          <section className="mb-6">
            {dataSource === 'ga4' && ga4Config.isAuthenticated ? (
              <div className="grid grid-cols-3 gap-5 mb-5">
                <div className="col-span-2 grid grid-rows-2 gap-4">
                  <EventChart events={events} />
                  <div className="grid grid-cols-2 gap-4">
                    <DeviceChart events={events} />
                    <CountryChart events={events} />
                  </div>
                </div>
                <RealtimeGA4 realtimeEvents={realtimeEvents} isRealtimeActive={isRealtimeActive} setIsRealtimeActive={setIsRealtimeActive} />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <EventChart events={events} />
                </div>
                <DeviceChart events={events} />
              </div>
            )}
          </section>

          <section className="mb-6">
            <SavedViews />
          </section>

          <section className="mb-6">
            <GA4Setup />
          </section>

          {isLoadingGA4 && (
            <section className="mb-6">
              <Card className="text-center py-12">
                <LoadingSpinner size="large" className="mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium">Loading GA4 data...</p>
                <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
              </Card>
            </section>
          )}

          <section className="mb-6">
            <AdvancedFilters events={allEvents} />
          </section>

          <section className="mb-6">
            <DataTools events={allEvents} filteredEvents={events} />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">📋 Event Data ({events.length.toLocaleString()} events)</h2>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 overflow-hidden">
              <AgGridEvents events={events} />
            </div>
          </section>
        </div>
      </div>

    </main>
  )
}


const DataTools = ({ events, filteredEvents }: { events: any[]; filteredEvents: any[] }) => {
  const { exportData } = useDashboardStore() as any
  const [showTools, setShowTools] = React.useState(false)

  const generateReport = () => {
    const kpis = calculateKpis(filteredEvents)
    const report = {
      generatedAt: new Date().toISOString(),
      totalEvents: events.length,
      filteredEvents: filteredEvents.length,
      kpis,
      topCountries: getTopItems(filteredEvents, 'country'),
      topDevices: getTopItems(filteredEvents, 'device'),
      eventBreakdown: getTopItems(filteredEvents, 'event'),
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getTopItems = (events: any[], field: string) => {
    const counts = events.reduce((acc: Record<string, number>, event: any) => {
      acc[event[field]] = (acc[event[field]] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([name, count]) => ({ name, count, percentage: (((count as number) / events.length) * 100).toFixed(1) }))
  }

  return (
    <Card className="glass-card">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-gray-800 dark:text-gray-100 text-lg font-semibold m-0 flex items-center gap-2">🛠️ Data Tools</h3>
          <StatusBadge status="neutral" className="text-xs">{filteredEvents.length.toLocaleString()} events</StatusBadge>
        </div>
        <Button onClick={() => setShowTools(!showTools)} variant="secondary" size="small" className="flex items-center gap-2">
          {showTools ? '▲' : '▼'} {showTools ? 'Hide' : 'Show'} Tools
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => exportData(filteredEvents)} variant="primary" size="medium" className="flex items-center gap-2">
          📊 Export CSV
          <span className="text-xs opacity-80">({filteredEvents.length.toLocaleString()})</span>
        </Button>

        <Button onClick={generateReport} variant="success" size="medium" className="flex items-center gap-2">
          📈 Generate Report
        </Button>
      </div>

      {showTools && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 bg-opacity-60 dark:bg-opacity-60 rounded-lg backdrop-blur-sm border border-gray-200 dark:border-gray-600">
          <h4 className="text-gray-800 dark:text-gray-100 text-sm font-semibold mb-4 flex items-center gap-2">💡 Quick Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-white dark:bg-gray-700 bg-opacity-70 dark:bg-opacity-70 p-3 rounded-lg">
              <div className="text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">DATA COVERAGE</div>
              <div className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{((filteredEvents.length / events.length) * 100).toFixed(1)}%</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">of total data</div>
            </div>
            <div className="bg-white dark:bg-gray-700 bg-opacity-70 dark:bg-opacity-70 p-3 rounded-lg">
              <div className="text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">TOP COUNTRY</div>
              <div className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{getTopItems(filteredEvents, 'country')[0]?.name || 'N/A'}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">{getTopItems(filteredEvents, 'country')[0]?.percentage || '0'}% of events</div>
            </div>
            <div className="bg-white dark:bg-gray-700 bg-opacity-70 dark:bg-opacity-70 p-3 rounded-lg">
              <div className="text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">TOP DEVICE</div>
              <div className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{getTopItems(filteredEvents, 'device')[0]?.name || 'N/A'}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">{getTopItems(filteredEvents, 'device')[0]?.percentage || '0'}% of events</div>
            </div>
            <div className="bg-white dark:bg-gray-700 bg-opacity-70 dark:bg-opacity-70 p-3 rounded-lg">
              <div className="text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">TOP EVENT</div>
              <div className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{getTopItems(filteredEvents, 'event')[0]?.name?.replace('_', ' ') || 'N/A'}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">{getTopItems(filteredEvents, 'event')[0]?.percentage || '0'}% of events</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export default Dashboard
