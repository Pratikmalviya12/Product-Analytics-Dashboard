import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Filters } from '@/lib/types'

export type SavedView = {
  id: string
  name: string
  filters: Filters
  seed: number
  createdAt: number
}

type SavedViewsState = {
  views: SavedView[]
  addView: (name: string, filters: Filters, seed: number) => void
  removeView: (id: string) => void
  loadView: (view: SavedView) => void
}

export const useSavedViews = create<SavedViewsState>()(
  persist(
    (set, _get) => ({
      views: [],
      addView: (name, filters, seed) => {
        const view: SavedView = {
          id: crypto.randomUUID(),
          name,
          filters,
          seed,
          createdAt: Date.now(),
        }
        set(state => ({ views: [...state.views, view] }))
        
        // Update URL for sharing
        const params = new URLSearchParams()
        params.set('seed', seed.toString())
        if (filters.dateFrom) params.set('dateFrom', filters.dateFrom.toString())
        if (filters.dateTo) params.set('dateTo', filters.dateTo.toString())
        if (filters.country?.length) params.set('country', filters.country.join(','))
        if (filters.device?.length) params.set('device', filters.device.join(','))
        if (filters.event?.length) params.set('event', filters.event.join(','))
        
        const url = new URL(window.location.href)
        url.search = params.toString()
        window.history.replaceState({}, '', url.toString())
      },
      removeView: (id) => {
        set(state => ({ views: state.views.filter(v => v.id !== id) }))
      },
      loadView: (view) => {
        // This will be called from the Dashboard component to update UI state
        const params = new URLSearchParams()
        params.set('seed', view.seed.toString())
        if (view.filters.dateFrom) params.set('dateFrom', view.filters.dateFrom.toString())
        if (view.filters.dateTo) params.set('dateTo', view.filters.dateTo.toString())
        if (view.filters.country?.length) params.set('country', view.filters.country.join(','))
        if (view.filters.device?.length) params.set('device', view.filters.device.join(','))
        if (view.filters.event?.length) params.set('event', view.filters.event.join(','))
        
        const url = new URL(window.location.href)
        url.search = params.toString()
        window.history.replaceState({}, '', url.toString())
      },
    }),
    {
      name: 'saved-views-storage',
    }
  )
)

// Function to load state from URL
export function loadStateFromURL(): { seed: number; filters: Filters } {
  const params = new URLSearchParams(window.location.search)
  
  const seed = Number(params.get('seed')) || 42
  const filters: Filters = {
    dateFrom: params.get('dateFrom') ? Number(params.get('dateFrom')) : null,
    dateTo: params.get('dateTo') ? Number(params.get('dateTo')) : null,
    country: params.get('country')?.split(',').filter(Boolean),
    device: params.get('device')?.split(',').filter(Boolean) as any,
    event: params.get('event')?.split(',').filter(Boolean) as any,
  }
  
  return { seed, filters }
}
