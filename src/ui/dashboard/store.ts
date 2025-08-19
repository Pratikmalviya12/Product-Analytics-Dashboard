import { create } from 'zustand'

export type DataSourceType = 'simulated' | 'ga4'

interface DateRange {
  start: string | null
  end: string | null
}

interface FiltersState {
  showPurchasesOnly: boolean
  selectedCountry: string | null | 'all'
  selectedDevice: string | null | 'all'
  dateRange: DateRange
  eventType: string | null | 'all'
}

interface SavedView {
  id: number
  name: string
  seed: number
  filters: FiltersState
  createdAt: string
}

interface GA4Config {
  propertyId: string
  serviceAccountJson: any | null
  isAuthenticated: boolean
  lastFetch: string | null
  error: string | null
}

interface StoreState {
  seed: number
  setSeed: (n: number) => void
  dataSource: DataSourceType
  setDataSource: (source: DataSourceType) => void
  ga4Config: GA4Config
  setGA4Config: (config: Partial<GA4Config>) => void
  filters: FiltersState
  setFilters: (f: Partial<FiltersState>) => void
  savedViews: SavedView[]
  addSavedView: (view: Partial<SavedView> & { seed: number; filters: FiltersState }) => void
  loadSavedView: (view: SavedView) => void
  exportData: (events: any[]) => void
}

export const useDashboardStore = create<StoreState>((set, get) => ({
  seed: 42,
  setSeed: (n) => set({ seed: n }),
  dataSource: 'simulated',
  setDataSource: (source) => set({ dataSource: source }),
  ga4Config: {
    propertyId: '',
    serviceAccountJson: null,
    isAuthenticated: false,
    lastFetch: null,
    error: null,
  },
  setGA4Config: (config) => set((state) => ({
    ga4Config: { ...state.ga4Config, ...config },
  })),
  filters: {
    showPurchasesOnly: false,
    selectedCountry: 'all',
    selectedDevice: 'all',
    dateRange: { start: null, end: null },
    eventType: 'all',
  },
  setFilters: (f) => set((state) => ({ filters: { ...state.filters, ...f } })),
  savedViews: [],
  addSavedView: (view) => set((state) => ({
    savedViews: [
      ...state.savedViews,
      {
        ...view,
        id: Date.now(),
        name: view.name || `View ${state.savedViews.length + 1}`,
        createdAt: view.createdAt || new Date().toISOString(),
      } as SavedView,
    ],
  })),
  loadSavedView: (view) => set({ seed: view.seed, filters: view.filters }),
  exportData: (events) => {
    const csvContent = [
      ['Event ID', 'User ID', 'Session ID', 'Timestamp', 'Event Type', 'Device', 'Country', 'Revenue'].join(','),
      ...events.map((e) => [
        e.id,
        e.userId,
        e.sessionId,
        new Date(e.timestamp).toISOString(),
        e.event,
        e.device,
        e.country,
        e.revenue,
      ].join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  },
})) 