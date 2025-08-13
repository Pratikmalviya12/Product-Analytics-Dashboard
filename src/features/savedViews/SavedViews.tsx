import React from 'react'
import { useSavedViews, SavedView } from './useSavedViews'
import { useUI } from '@/state/store'
import { format } from 'date-fns'

export function SavedViews() {
  const { views, addView, removeView, loadView } = useSavedViews()
  const { filters, seed, setFilters, setSeed } = useUI()
  const [showModal, setShowModal] = React.useState(false)
  const [viewName, setViewName] = React.useState('')

  const handleSaveView = () => {
    if (!viewName.trim()) return
    addView(viewName.trim(), filters, seed)
    setViewName('')
    setShowModal(false)
  }

  const handleLoadView = (view: SavedView) => {
    setSeed(view.seed)
    setFilters(view.filters)
    loadView(view)
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copied to clipboard!')
    })
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: '6px 12px',
          fontSize: 12,
          border: '1px solid var(--divider, #ccc)',
          borderRadius: 4,
          background: 'white',
          cursor: 'pointer',
        }}
      >
        Save View
      </button>
      
      <button
        onClick={handleShare}
        style={{
          padding: '6px 12px',
          fontSize: 12,
          border: '1px solid var(--divider, #ccc)',
          borderRadius: 4,
          background: 'white',
          cursor: 'pointer',
        }}
      >
        Share URL
      </button>

      {views.length > 0 && (
        <select
          onChange={(e) => {
            if (e.target.value) {
              const view = views.find(v => v.id === e.target.value)
              if (view) handleLoadView(view)
            }
          }}
          value=""
          style={{
            padding: '6px 12px',
            fontSize: 12,
            border: '1px solid var(--divider, #ccc)',
            borderRadius: 4,
            background: 'white',
          }}
        >
          <option value="">Load Saved View...</option>
          {views.map(view => (
            <option key={view.id} value={view.id}>
              {view.name} ({format(new Date(view.createdAt), 'MMM dd, HH:mm')})
            </option>
          ))}
        </select>
      )}

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false)
          }}
        >
          <div
            style={{
              background: 'white',
              padding: 24,
              borderRadius: 8,
              border: '1px solid var(--divider, #ccc)',
              minWidth: 300,
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16 }}>Save Current View</h3>
            <input
              type="text"
              placeholder="Enter view name..."
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--divider, #ccc)',
                borderRadius: 4,
                fontSize: 14,
                marginBottom: 16,
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveView()
                if (e.key === 'Escape') setShowModal(false)
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid var(--divider, #ccc)',
                  borderRadius: 4,
                  background: 'white',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveView}
                disabled={!viewName.trim()}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #007acc',
                  borderRadius: 4,
                  background: '#007acc',
                  color: 'white',
                  cursor: viewName.trim() ? 'pointer' : 'not-allowed',
                  opacity: viewName.trim() ? 1 : 0.5,
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
