import { create } from 'zustand'

export type Filters = {
  dateFrom: number | null
  dateTo: number | null
  country?: string[]
  device?: ('mobile' | 'desktop' | 'tablet')[]
  event?: ('page_view' | 'click' | 'signup' | 'purchase')[]
}

export type Event = {
  id: string
  userId: string
  sessionId: string
  timestamp: number
  event: 'page_view' | 'click' | 'signup' | 'purchase'
  url: string
  device: 'desktop' | 'mobile' | 'tablet'
  country: string
  revenue?: number
}

export type UIState = {
  filters: Filters
  setFilters: (p: Partial<Filters>) => void
  seed: number
  setSeed: (n: number) => void
  customEvents: Event[] | null
  setCustomEvents: (events: Event[] | null) => void
}

export const useUI = create<UIState>((set) => ({
  filters: { dateFrom: null, dateTo: null },
  setFilters: (p) => set((s) => ({ filters: { ...s.filters, ...p } })),
  seed: 42,
  setSeed: (n) => set({ seed: n }),
  customEvents: null,
  setCustomEvents: (events) => set({ customEvents: events }),
}))
