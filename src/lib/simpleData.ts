// Simple data generation without complex dependencies
export type SimpleEvent = {
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

export function generateSimpleEvents(seed: number = 42, count: number = 1000): SimpleEvent[] {
  const events: SimpleEvent[] = []
  const eventTypes: SimpleEvent['event'][] = ['page_view', 'click', 'signup', 'purchase']
  const devices: SimpleEvent['device'][] = ['desktop', 'mobile', 'tablet']
  const countries = ['US', 'UK', 'CA', 'DE', 'FR', 'JP', 'AU']
  const urls = ['/', '/about', '/pricing', '/signup', '/login', '/dashboard']
  
  // Simple seeded random
  let random = seed
  const nextRandom = () => {
    random = (random * 9301 + 49297) % 233280
    return random / 233280
  }
  
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  
  for (let i = 0; i < count; i++) {
    const userId = `user_${Math.floor(nextRandom() * 100)}`
    const sessionId = `session_${Math.floor(nextRandom() * 200)}`
    const event = eventTypes[Math.floor(nextRandom() * eventTypes.length)]
    
    events.push({
      id: `event_${i}`,
      userId,
      sessionId,
      timestamp: now - Math.floor(nextRandom() * dayMs * 30), // Last 30 days
      event,
      url: urls[Math.floor(nextRandom() * urls.length)],
      device: devices[Math.floor(nextRandom() * devices.length)],
      country: countries[Math.floor(nextRandom() * countries.length)],
      revenue: event === 'purchase' ? Math.floor(nextRandom() * 200) + 10 : undefined
    })
  }
  
  return events.sort((a, b) => b.timestamp - a.timestamp)
}

export function calculateSimpleKpis(events: SimpleEvent[]) {
  const users = new Set(events.map(e => e.userId)).size
  const sessions = new Set(events.map(e => e.sessionId)).size
  const purchases = events.filter(e => e.event === 'purchase').length
  const revenue = events
    .filter(e => e.event === 'purchase' && e.revenue)
    .reduce((sum, e) => sum + (e.revenue || 0), 0)
  
  return {
    users,
    sessions,
    conversion: users > 0 ? purchases / users : 0,
    revenue
  }
}

export function formatCompact(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function formatCurrency(num: number): string {
  return `$${num.toLocaleString()}`
}

export function formatPercent(num: number): string {
  return `${(num * 100).toFixed(1)}%`
}
