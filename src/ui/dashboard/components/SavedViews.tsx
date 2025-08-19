import React from 'react'
import { Button, Card, Input, StatusBadge } from '../../components'
import { useDashboardStore } from '../store'

/**
 * Saved Views Component
 * 
 * @description A view management system that allows users to save and restore dashboard configurations
 * including filters, seed values, and data source settings for quick access to common analytics views.
 * 
 * @features
 * - Save current dashboard state as named views
 * - Quick restore of saved configurations
 * - View management with creation timestamps
 * - Active filters counting and display
 * - Inline view name editing
 * - Delete functionality for view cleanup
 * - Empty state with helpful messaging
 * - Responsive grid layout for view cards
 * 
 * @stateManagement
 * - Integrates with useDashboardStore for persistence
 * - Tracks current filters and seed values
 * - Manages saved view collection
 * - Handles view creation and deletion
 * 
 * @viewContents
 * Each saved view includes:
 * - Dashboard seed value for data reproducibility
 * - All active filter configurations
 * - View name and creation timestamp
 * - Active filters count for quick identification
 * 
 * @userExperience
 * - Inline form for quick view naming
 * - Visual indicators for view status
 * - Quick load/restore functionality
 * - Confirmation flows for destructive actions
 * 
 * @example
 * ```tsx
 * <SavedViews />
 * ```
 */
export const SavedViews = () => {
  const { seed, filters, savedViews, addSavedView, loadSavedView } = useDashboardStore() as any
  const [viewName, setViewName] = React.useState('')
  const [showSaveForm, setShowSaveForm] = React.useState(false)

  const saveCurrentView = () => {
    if (showSaveForm && viewName.trim()) {
      addSavedView({ seed, filters, name: viewName.trim(), createdAt: new Date().toISOString() })
      setViewName('')
      setShowSaveForm(false)
    } else {
      setShowSaveForm(true)
    }
  }

  const getActiveFiltersCount = (filters: any) => {
    return Object.entries(filters).filter(([key, value]: [string, any]) => {
      if (key === 'showPurchasesOnly') return value === true
      if (key === 'dateRange') return value?.start || value?.end
      return value && value !== 'all'
    }).length
  }

  return (
    <Card className="glass-card">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-gray-800 dark:text-gray-100 text-lg font-semibold m-0 flex items-center gap-2">📁 Saved Views</h3>
          {savedViews.length > 0 && <StatusBadge status="neutral" className="text-xs">{savedViews.length} saved</StatusBadge>}
        </div>

        <div className="flex items-center gap-2">
          {showSaveForm && (
            <Input
              type="text"
              placeholder="View name..."
              value={viewName}
              onChange={(e: any) => setViewName(e.target.value)}
              className="w-32 text-sm"
              onKeyPress={(e: any) => e.key === 'Enter' && saveCurrentView()}
            />
          )}
          <Button onClick={saveCurrentView} variant={showSaveForm ? 'success' : 'primary'} size="small" className="flex items-center gap-2">
            {showSaveForm ? '💾 Save' : '+ Save Current'}
          </Button>
          {showSaveForm && (
            <Button onClick={() => { setShowSaveForm(false); setViewName('') }} variant="secondary" size="small">Cancel</Button>
          )}
        </div>
      </div>

      {savedViews.length === 0 ? (
        <div className="text-center p-8">
          <div className="text-6xl mb-4 opacity-50">📊</div>
          <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium">No saved views yet</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Configure filters and data, then save your current view for quick access later!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedViews.map((view: any) => (
            <Card key={view.id} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900 dark:hover:to-indigo-900 hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300" hover={true}>
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="font-semibold text-gray-800 dark:text-gray-100">{view.name}</div>
                    {getActiveFiltersCount(view.filters) > 0 && <StatusBadge status="info" className="text-xs">{getActiveFiltersCount(view.filters)} filters</StatusBadge>}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                    <div className="flex items-center gap-4">
                      <span>🎲 Seed: {view.seed}</span>
                      <span>📅 {new Date(view.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {view.filters.showPurchasesOnly && (
                        <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-1 rounded">💰 Purchases</span>
                      )}
                      {view.filters.selectedCountry && view.filters.selectedCountry !== 'all' && (
                        <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded">🌍 {view.filters.selectedCountry}</span>
                      )}
                      {view.filters.selectedDevice && view.filters.selectedDevice !== 'all' && (
                        <span className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100 px-2 py-1 rounded">📱 {view.filters.selectedDevice}</span>
                      )}
                      {view.filters.eventType && view.filters.eventType !== 'all' && (
                        <span className="bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-100 px-2 py-1 rounded">📊 {view.filters.eventType}</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button onClick={() => loadSavedView(view)} variant="primary" size="small" className="ml-4">
                  Load View
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  )
} 