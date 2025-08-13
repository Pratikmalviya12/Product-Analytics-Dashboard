import Papa from 'papaparse'
import { Event } from '@/lib/types'

export function exportToCSV(events: Event[], filename = 'events.csv') {
  const csv = Papa.unparse(events, {
    header: true,
    transform: (value, field) => {
      if (field === 'timestamp') {
        return new Date(value as number).toISOString()
      }
      return value
    }
  })
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function importFromCSV(file: File): Promise<Event[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transform: (value, field) => {
        if (field === 'timestamp') {
          const timestamp = new Date(value).getTime()
          return isNaN(timestamp) ? Date.now() : timestamp
        }
        if (field === 'revenue') {
          const revenue = parseFloat(value)
          return isNaN(revenue) ? undefined : revenue
        }
        return value
      },
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`))
          return
        }
        
        const events = results.data as Event[]
        
        // Validate required fields
        const validEvents = events.filter(event => 
          event.id && 
          event.userId && 
          event.sessionId && 
          event.timestamp && 
          event.event &&
          event.url &&
          event.device &&
          event.country
        )
        
        if (validEvents.length === 0) {
          reject(new Error('No valid events found in CSV'))
          return
        }
        
        resolve(validEvents)
      },
      error: (error) => {
        reject(error)
      }
    })
  })
}
