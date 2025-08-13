import React from 'react'
import { Event } from '@/lib/types'
import { exportToCSV, importFromCSV } from '@/lib/csv'

type CSVControlsProps = {
  events: Event[]
  onImport: (events: Event[]) => void
}

export function CSVControls({ events, onImport }: CSVControlsProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [importing, setImporting] = React.useState(false)

  const handleExport = () => {
    exportToCSV(events, `events-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    try {
      const importedEvents = await importFromCSV(file)
      onImport(importedEvents)
      alert(`Successfully imported ${importedEvents.length} events`)
    } catch (error) {
      alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button
        onClick={handleExport}
        disabled={events.length === 0}
        style={{
          padding: '6px 12px',
          fontSize: 12,
          border: '1px solid var(--divider, #ccc)',
          borderRadius: 4,
          background: 'white',
          cursor: events.length > 0 ? 'pointer' : 'not-allowed',
          opacity: events.length > 0 ? 1 : 0.5,
        }}
      >
        Export CSV
      </button>
      
      <button
        onClick={handleImportClick}
        disabled={importing}
        style={{
          padding: '6px 12px',
          fontSize: 12,
          border: '1px solid var(--divider, #ccc)',
          borderRadius: 4,
          background: 'white',
          cursor: importing ? 'not-allowed' : 'pointer',
          opacity: importing ? 0.5 : 1,
        }}
      >
        {importing ? 'Importing...' : 'Import CSV'}
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}
