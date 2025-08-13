export type Event = {
  id: string
  userId: string
  sessionId: string
  timestamp: number // epoch ms
  event: 'page_view' | 'click' | 'signup' | 'purchase'
  url: string
  device: 'desktop' | 'mobile' | 'tablet'
  country: string
  revenue?: number
}

export type Filters = {
  dateFrom: number | null
  dateTo: number | null
  country?: string[]
  device?: Array<Event['device']>
  event?: Array<Event['event']>
  // comparison range can be encoded via saved view/query string
}

export type KPI = {
  users: number
  sessions: number
  conversion: number
  revenue: number
}
