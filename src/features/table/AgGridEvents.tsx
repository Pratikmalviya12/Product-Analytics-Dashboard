import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef, CellClassRules } from 'ag-grid-community'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { Event } from '@/lib/types'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/formats'
import { useTheme } from '@/lib/ThemeContext'

import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-alpine.css'

// Register Community Modules once
ModuleRegistry.registerModules([AllCommunityModule])

export function AgGridEvents({ events }: { events: Event[] }) {
	const { mode } = useTheme()

	const purchaseCellRules: CellClassRules<Event> = {
		'ag-event-purchase': (p) => p.value === 'purchase',
	}
	const revenueCellRules: CellClassRules<Event> = {
		'ag-revenue-pos': (p) => !!p.value && (p.value as number) > 0,
	}

	const columnDefs = React.useMemo<ColDef<Event>[]>(() => [
		{ headerName: 'Time', field: 'timestamp', flex: 1, minWidth: 120,  sortable: true, valueFormatter: p => p.value ? format(new Date(p.value as number), 'MMM dd, HH:mm:ss') : '' },
		{ headerName: 'Event', field: 'event', flex: 1, minWidth: 120,  sortable: true, valueFormatter: p => (p.value as string).replace('_', ' ').replace(/^./, c => c.toUpperCase()), cellClassRules: purchaseCellRules },
		{ headerName: 'User ID', field: 'userId', flex: 1, minWidth: 120,  valueFormatter: p => String(p.value) },
		{ headerName: 'Session ID', field: 'sessionId', flex: 1, minWidth: 120,  valueFormatter: p => String(p.value) },
		{ headerName: 'Device', field: 'device', flex: 1, minWidth: 120, sortable: true, valueFormatter: p => String(p.value).replace(/^./, c => c.toUpperCase()) },
		{ headerName: 'Country', field: 'country', flex: 1, minWidth: 120, sortable: true },
		{ headerName: 'Revenue', field: 'revenue', flex: 1, minWidth: 120,  sortable: true, valueFormatter: p => p.value ? formatCurrency(p.value as number) : '—', cellClassRules: revenueCellRules },
	], [])

	const defaultColDef = React.useMemo<ColDef>(() => ({
		resizable: true,
		suppressHeaderMenuButton: true,
		cellClass: ['text-xs'],
		headerClass: ['text-xs'],
		suppressAutoSize: false,
	}), [])

	// Use Alpine theme (single CSS file available). We can customize dark mode via CSS variables later.
	const themeClass = mode === 'dark' ? 'ag-theme-alpine-dark' : 'ag-theme-alpine ag-custom-ag'

	return (
		<div className={`${themeClass}`} style={{ height: 480, minHeight: 480 }}>
			<AgGridReact<Event>
				rowData={events}
				columnDefs={columnDefs}
				defaultColDef={defaultColDef}
				domLayout="normal"
				rowHeight={30}
				pagination={true}
				paginationPageSize={50}
				paginationPageSizeSelector={[20, 50, 100, 200, 500, 1000]}
				rowClassRules={{ 'ag-row-purchase': (p) => p.data?.event === 'purchase' }}
				suppressHorizontalScroll={false}
				alwaysShowHorizontalScroll={false}
				suppressColumnVirtualisation={false}
			/>
		</div>
	)
}

export default AgGridEvents 