import React from 'react'
import { Button, Card, Input, Select, StatusBadge } from '../../components'
import { useDashboardStore } from '../store'

export const AdvancedFilters = ({ events }: { events: any[] }) => {
  const { filters, setFilters } = useDashboardStore() as any
  const [showAdvanced, setShowAdvanced] = React.useState(false)

  const uniqueDevices = [...new Set(events.map((e: any) => e.device).filter(Boolean))].sort()
  const eventTypes = [...new Set(events.map((e: any) => e.event || e.type).filter(Boolean))].sort()

  const getDateString = (daysBack: number) => {
    const date = new Date()
    date.setDate(date.getDate() - daysBack)
    return date.toISOString().split('T')[0]
  }

  const setDateRange = (preset: string) => {
    const now = new Date()
    let start: string | null
    let end: string | null = now.toISOString().split('T')[0]

    switch (preset) {
      case 'today':
        start = end
        break
      case 'week':
        start = getDateString(7)
        break
      case 'month':
        start = getDateString(30)
        break
      case 'quarter':
        start = getDateString(90)
        break
      default:
        start = null
        end = null
    }

    setFilters({ dateRange: { start, end } })
  }

  const isFilterActive = () => {
    return filters.eventType !== 'all' || filters.selectedDevice !== 'all' || filters.dateRange?.start || filters.dateRange?.end
  }

  return (
    <Card className="glass-card">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-gray-800 dark:text-gray-100 text-lg font-semibold m-0 flex items-center gap-2">🎯 Advanced Filters</h3>
          {isFilterActive() && (
            <StatusBadge status="info" className="text-xs">
              {Object.values(filters).filter((v: any) => v && v !== 'all').length} active
            </StatusBadge>
          )}
        </div>
        <Button onClick={() => setShowAdvanced(!showAdvanced)} variant="secondary" size="small" className="flex items-center gap-2">
          {showAdvanced ? '▲' : '▼'} {showAdvanced ? 'Hide' : 'Show'} Advanced
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">📊 Event Type</label>
          <Select value={filters.eventType || 'all'} onChange={(e: any) => setFilters({ eventType: e.target.value === 'all' ? null : e.target.value })} className="w-full">
            <option value="all">All Events</option>
            {eventTypes.map((type: string) => (
              <option key={type} value={type}>
                {type && typeof type === 'string' ? type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ') : type}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">📱 Device Type</label>
          <Select value={filters.selectedDevice || 'all'} onChange={(e: any) => setFilters({ selectedDevice: e.target.value === 'all' ? null : e.target.value })} className="w-full">
            <option value="all">All Devices</option>
            {uniqueDevices.map((device: string) => (
              <option key={device} value={device}>
                {device && typeof device === 'string' ? device.charAt(0).toUpperCase() + device.slice(1) : device}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {showAdvanced && (
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4 space-y-4">
          <div>
            <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">📅 Quick Date Ranges</label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'today', label: 'Today' },
                { key: 'week', label: 'Last 7 days' },
                { key: 'month', label: 'Last 30 days' },
                { key: 'quarter', label: 'Last 90 days' },
                { key: 'all', label: 'All time' },
              ].map(({ key, label }) => (
                <Button key={key} onClick={() => setDateRange(key)} variant="ghost" size="small" className="text-xs">
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">📆 Start Date</label>
              <Input type="date" value={filters.dateRange?.start || ''} onChange={(e: any) => setFilters({ dateRange: { ...filters.dateRange, start: e.target.value } })} className="w-full" />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">📆 End Date</label>
              <Input type="date" value={filters.dateRange?.end || ''} onChange={(e: any) => setFilters({ dateRange: { ...filters.dateRange, end: e.target.value } })} className="w-full" />
            </div>
          </div>
        </div>
      )}

      {isFilterActive() && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 text-right">
          <Button
            onClick={() =>
              setFilters({
                showPurchasesOnly: false,
                selectedCountry: 'all',
                selectedDevice: 'all',
                dateRange: { start: null, end: null },
                eventType: 'all',
              })
            }
            variant="secondary"
            size="small"
            className="flex items-center gap-2"
          >
            🗑️ Clear All Filters
          </Button>
        </div>
      )}
    </Card>
  )
} 