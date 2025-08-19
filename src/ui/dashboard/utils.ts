export function generateEvents(seed: number, count = 50000) {
  const events: any[] = []
  const eventTypes = ['page_view', 'click', 'signup', 'purchase']
  const devices = ['desktop', 'mobile', 'tablet']
  const countries = ['US', 'UK', 'CA', 'DE', 'FR', 'JP', 'AU', 'BR']
  const pages = ['/home', '/product', '/checkout', '/about', '/contact', '/blog', '/pricing', '/login']

  let random = seed
  const nextRandom = () => {
    random = (random * 9301 + 49297) % 233280
    return random / 233280
  }

  const now = Date.now()

  for (let i = 0; i < count; i++) {
    const userId = `user_${Math.floor(nextRandom() * 1000)}`
    const sessionId = `session_${Math.floor(nextRandom() * 2000)}`
    const event = eventTypes[Math.floor(nextRandom() * eventTypes.length)]

    events.push({
      id: `event_${i}`,
      userId,
      sessionId,
      timestamp: now - Math.floor(nextRandom() * 30 * 24 * 60 * 60 * 1000),
      event,
      device: devices[Math.floor(nextRandom() * devices.length)],
      country: countries[Math.floor(nextRandom() * countries.length)],
      url: pages[Math.floor(nextRandom() * pages.length)],
      revenue: event === 'purchase' ? Math.floor(nextRandom() * 500) + 10 : 0,
    })
  }

  return events.sort((a, b) => b.timestamp - a.timestamp)
}

export const calculateKpis = (events: any[]) => {
  const users = new Set(events.map((e) => e.userId)).size
  const sessions = new Set(events.map((e) => e.sessionId)).size
  const purchases = events.filter((e) => e.event === 'purchase').length
  const revenue = events.reduce((sum, e) => sum + e.revenue, 0)

  return {
    users,
    sessions,
    purchases,
    conversion: users > 0 ? purchases / users : 0,
    revenue,
  }
}

export function formatCompact(num: number) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
} 