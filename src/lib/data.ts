import { Event } from './types'
import { FULL_COUNTRY_NAMES, DEVICE_TYPES, PAGE_URLS, MIN_REVENUE, MAX_REVENUE, EVENT_TYPES } from '../constants'

// Optimized deterministic pseudo RNG using xorshift algorithm
function xorshift32(seed: number) {
  let state = seed
  return function() {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return (state >>> 0) / 0x100000000
  }
}

// Pre-compute reusable arrays for better performance
const COUNTRIES_SUBSET = FULL_COUNTRY_NAMES.slice(0, 12) // Use top 12 countries for variety
const DEVICES = [...DEVICE_TYPES]
const URLS = [...PAGE_URLS]
const EVENTS = [...EVENT_TYPES]

// Pre-generate user and session pools
const USER_POOL_SIZE = 20_000
const SESSION_POOL_SIZE = 60_000

export function generateEvents(seed: number, days = 30, count = 100_000): Event[] {
  const rand = xorshift32(seed)
  const now = Date.now()
  const start = now - days * 24 * 60 * 60 * 1000

  // Pre-generate user and session IDs for consistent relationships
  const users = Array.from({ length: USER_POOL_SIZE }, (_, i) => `u_${i}`)
  const sessions = Array.from({ length: SESSION_POOL_SIZE }, (_, i) => `s_${i}`)

  const events: Event[] = []
  
  // Batch process for better performance
  const batchSize = 1000
  for (let batch = 0; batch < Math.ceil(count / batchSize); batch++) {
    const batchEnd = Math.min((batch + 1) * batchSize, count)
    
    for (let i = batch * batchSize; i < batchEnd; i++) {
      const ts = Math.floor(start + rand() * (now - start))
      const url = URLS[Math.floor(rand() * URLS.length)]
      const eventType = EVENTS[Math.floor(rand() * EVENTS.length)]
      
      events.push({
        id: `evt_${i}_${ts}`, // More unique ID format
        userId: users[Math.floor(rand() * users.length)],
        sessionId: sessions[Math.floor(rand() * sessions.length)],
        timestamp: ts,
        event: eventType,
        url,
        device: DEVICES[Math.floor(rand() * DEVICES.length)],
        country: COUNTRIES_SUBSET[Math.floor(rand() * COUNTRIES_SUBSET.length)],
        revenue: eventType === 'purchase' 
          ? Math.floor(rand() * (MAX_REVENUE - MIN_REVENUE)) + MIN_REVENUE 
          : undefined
      })
    }
  }

  // Sort by timestamp descending for better UX (newest first)
  return events.sort((a, b) => b.timestamp - a.timestamp)
}
