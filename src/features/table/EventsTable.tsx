import React from 'react'
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	SortingState,
} from '@tanstack/react-table'
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
		size: 120,
	}),
	columnHelper.accessor('sessionId', {
		header: 'Session ID',
		cell: (info) => info.getValue().slice(0, 8) + '...',
		size: 140,
	}),
	columnHelper.accessor('url', {
		header: 'URL',
		size: 180,
	}),
	columnHelper.accessor('device', {
		header: 'Device',
		cell: (info) => info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1),
		size: 100,
	}),
	columnHelper.accessor('country', {
		header: 'Country',
		size: 100,
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

	const headerGroups = table.getHeaderGroups()
	const rowModel = table.getRowModel()

	const columnSizes = React.useMemo(() => (columns as any[]).map((c: any) => c.size ?? 120), [])

	const headerCellClass = 'box-border px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 select-none'
	const bodyCellClass = 'box-border px-3 py-2 text-xs text-gray-900 dark:text-gray-100 whitespace-nowrap overflow-hidden text-ellipsis'

	return (
		<div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
			<div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
				<h3 className="m-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
					Events ({events.length.toLocaleString()})
				</h3>
			</div>

			<div className="h-96 overflow-auto">
				<table className="w-full table-fixed border-collapse">
					<colgroup>
						{columnSizes.map((size, idx) => (
							<col key={idx} style={{ width: size }} />
						))}
					</colgroup>
					<thead className="sticky top-0 z-10 bg-white dark:bg-gray-800">
						{headerGroups.map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className={`${headerCellClass} border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700`}
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
					<tbody>
						{rowModel.rows.map((row) => (
							<tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className={`${bodyCellClass} border-b border-gray-100 dark:border-gray-700`}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default EventsTable
