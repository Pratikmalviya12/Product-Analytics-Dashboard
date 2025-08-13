import React from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Event } from '@/lib/types'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/formats'

const columnHelper = createColumnHelper<Event>()

const columns = [
  columnHelper.accessor('timestamp', {
    header: 'Time',
    cell: (info) => format(new Date(info.getValue()), 'MMM dd, HH:mm:ss'),
    size: 140,
  }),
  columnHelper.accessor('event', {
    header: 'Event',
    cell: (info) => {
      const value = info.getValue()
      return value.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    },
    size: 100,
  }),
  columnHelper.accessor('userId', {
    header: 'User ID',
    cell: (info) => info.getValue().slice(0, 8) + '...',
    size: 100,
  }),
  columnHelper.accessor('sessionId', {
    header: 'Session ID',
    cell: (info) => info.getValue().slice(0, 8) + '...',
    size: 100,
  }),
  columnHelper.accessor('url', {
    header: 'URL',
    size: 120,
  }),
  columnHelper.accessor('device', {
    header: 'Device',
    cell: (info) => info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1),
    size: 80,
  }),
  columnHelper.accessor('country', {
    header: 'Country',
    size: 80,
  }),
  columnHelper.accessor('revenue', {
    header: 'Revenue',
    cell: (info) => {
      const value = info.getValue()
      return value ? formatCurrency(value) : '—'
    },
    size: 100,
  }),
]

type EventsTableProps = {
  events: Event[]
}

export function EventsTable({ events }: EventsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'timestamp', desc: true }])
  
  const table = useReactTable({
    data: events,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const { rows } = table.getRowModel()

  const parentRef = React.useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  })

  return (
    <div style={{ border: '1px solid var(--divider, #ccc)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding: 16, borderBottom: '1px solid var(--divider, #ccc)', background: '#fafafa' }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
          Events ({events.length.toLocaleString()})
        </h3>
      </div>
      
      <div style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      padding: '8px 12px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 600,
                      borderBottom: '1px solid var(--divider, #ccc)',
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' ↑',
                        desc: ' ↓',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        </table>
        
        <div
          ref={parentRef}
          style={{
            height: '400px',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {virtualizer.getVirtualItems().map(virtualRow => {
                  const row = rows[virtualRow.index]
                  return (
                    <tr
                      key={row.id}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          style={{
                            width: cell.column.getSize(),
                            padding: '8px 12px',
                            fontSize: 12,
                            borderBottom: '1px solid #f0f0f0',
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
