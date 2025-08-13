import { Event } from './types'
import { v4 as uuidv4 } from 'uuid'

// Deterministic pseudo RNG
function mulberry32(a: number) {
  return function() {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function generateEvents(seed: number, days = 30, count = 100_000): Event[] {
  const rand = mulberry32(seed)
  const now = Date.now()
  const start = now - days * 24 * 60 * 60 * 1000

  const countries = ['US', 'IN', 'DE', 'GB', 'CA', 'AU', 'BR', 'FR']
  const devices = ['desktop', 'mobile', 'tablet'] as const
  const urls = ['/home', '/pricing', '/docs', '/blog', '/checkout', '/signup']
  const events: Event[] = []

  let users = Array.from({ length: 20_000 }, (_, i) => `u_${i}`)
  let sessions = Array.from({ length: 60_000 }, (_, i) => `s_${i}`)

  for (let i = 0; i < count; i++) {
    const ts = Math.floor(start + rand() * (now - start))
    const url = urls[Math.floor(rand() * urls.length)]
    const device = devices[Math.floor(rand() * devices.length)]
    const country = countries[Math.floor(rand() * countries.length)]
    const eventRoll = rand()
    const event: Event['event'] = eventRoll < 0.7 ? 'page_view' : eventRoll < 0.9 ? 'click' : eventRoll < 0.97 ? 'signup' : 'purchase'

    const revenue = event === 'purchase' ? Math.round(10 + rand() * 200) : undefined
    const userId = users[Math.floor(rand() * users.length)]
    const sessionId = sessions[Math.floor(rand() * sessions.length)]

    events.push({ id: uuidv4(), userId, sessionId, timestamp: ts, event, url, device, country, revenue })
  }
  return events.sort((a, b) => a.timestamp - b.timestamp)
}
