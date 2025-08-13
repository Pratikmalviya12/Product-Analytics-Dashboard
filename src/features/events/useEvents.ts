import { useQuery } from '@tanstack/react-query'
import { Event } from '../../lib/types'
import { useUI } from '../../state/store'

export function useEvents(seed: number) {
  const customEvents = useUI((s) => s.customEvents)
  
  return useQuery({
    queryKey: ['events', seed, customEvents ? 'custom' : 'generated'],
    queryFn: async (): Promise<Event[]> => {
      if (customEvents) {
        return customEvents
      }
      
      const res = await fetch(`/api/events?seed=${seed}&days=30&count=120000`)
      if (!res.ok) throw new Error('Failed to fetch events')
      const json = await res.json()
      return json.data
    },
  })
}
