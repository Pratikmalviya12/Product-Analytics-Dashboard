import { Event } from '../../lib/types'
import memoize from 'memoize-one'
import { extent } from 'd3-array'

export type Kpis = {
  users: number
  sessions: number
  conversion: number
  revenue: number
  dateFrom: number | undefined
  dateTo: number | undefined
}

export const getKpis = memoize((events: Event[]): Kpis => {
  if (!events.length) {
    return { users: 0, sessions: 0, conversion: 0, revenue: 0, dateFrom: undefined, dateTo: undefined }
  }
  const users = new Set<string>()
  const sessions = new Set<string>()
  const usersWhoConverted = new Set<string>()
  let revenue = 0

  for (const event of events) {
    users.add(event.userId)
    sessions.add(event.sessionId)
    if (event.event === 'signup' || event.event === 'purchase') {
      usersWhoConverted.add(event.userId)
    }
    if (event.event === 'purchase' && event.revenue) {
      revenue += event.revenue
    }
  }

  const [dateFrom, dateTo] = extent(events, (d) => d.timestamp)

  return {
    users: users.size,
    sessions: sessions.size,
    conversion: users.size > 0 ? usersWhoConverted.size / users.size : 0,
    revenue,
    dateFrom,
    dateTo,
  }
})
