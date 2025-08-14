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
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <h3 className="m-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
          Events ({events.length.toLocaleString()})
        </h3>
      </div>
      
      <div className="overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      width: header.getSize(),
                    }}
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
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
          className="h-96 overflow-auto"
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            <table className="w-full border-collapse">
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
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          style={{
                            width: cell.column.getSize(),
                          }}
                          className="px-3 py-2 text-xs text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700"
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
