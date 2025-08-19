import React from 'react'
import { Button, Card, Input, StatusBadge } from '../../components'
import { useDashboardStore } from '../store'
import { fetchGA4Data } from '../ga4'

export const GA4Setup = () => {
  const { dataSource, setDataSource, ga4Config, setGA4Config } = useDashboardStore()
  const [isConnecting, setIsConnecting] = React.useState(false)
  const [showSetup, setShowSetup] = React.useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const serviceAccountJson = JSON.parse(String(e.target?.result))
          setGA4Config({ serviceAccountJson, error: null })
        } catch (error) {
          setGA4Config({ error: 'Invalid JSON file format' })
        }
      }
      reader.readAsText(file)
    }
  }

  const testGA4Connection = async () => {
    if (!ga4Config.propertyId || !ga4Config.serviceAccountJson) {
      setGA4Config({ error: 'Please provide both Property ID and Service Account JSON' })
      return
    }

    setIsConnecting(true)
    setGA4Config({ error: null })

    try {
      await fetchGA4Data(ga4Config.propertyId, ga4Config.serviceAccountJson, { start: '7daysAgo', end: 'today' })
      setGA4Config({ isAuthenticated: true, lastFetch: new Date().toISOString(), error: null })
      setDataSource('ga4')
    } catch (error: any) {
      setGA4Config({ isAuthenticated: false, error: `Connection test completed: ${error.message}` })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Card className="glass-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-900 dark:text-gray-100 text-lg font-semibold m-0 flex items-center gap-2">
          🔗 Data Source Configuration
          {ga4Config.isAuthenticated && <StatusBadge status="success">Connected (Mock)</StatusBadge>}
        </h3>
        <Button onClick={() => setShowSetup(!showSetup)} variant="secondary" size="small">
          {showSetup ? 'Hide' : 'Setup'} GA4
        </Button>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Data Source:</label>
        <div className="flex gap-3">
          <Button onClick={() => setDataSource('simulated')} variant={dataSource === 'simulated' ? 'primary' : 'secondary'} size="medium">
            📊 Simulated Data (50K events)
          </Button>
          <Button
            onClick={() => {
              if (ga4Config.isAuthenticated) {
                setDataSource('ga4')
              } else {
                setShowSetup(true)
              }
            }}
            disabled={!ga4Config.isAuthenticated && dataSource !== 'ga4'}
            variant={dataSource === 'ga4' ? 'success' : 'secondary'}
            size="medium"
          >
            � Google Analytics 4 {ga4Config.isAuthenticated ? '(Mock Mode)' : '(Demo Setup)'}
          </Button>
        </div>
      </div>

      {showSetup && (
        <Card className="bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900 border border-indigo-200 dark:border-indigo-700">
          <div className="mb-4">
            <h4 className="text-gray-900 dark:text-gray-100 text-base font-semibold mb-2">🚀 GA4 Demo Setup</h4>
            <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>📘 Note:</strong> This is a demo implementation using realistic mock data. 
                Real GA4 integration requires a backend server due to security constraints.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Property ID:</label>
              <Input 
                type="text" 
                placeholder="e.g., 123456789" 
                value={ga4Config.propertyId} 
                onChange={(e: any) => setGA4Config({ propertyId: e.target.value })} 
              />
              <div className="mt-1 text-xs text-gray-500">
                Find in GA4: Admin → Data Streams → Web → Stream ID
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Service Account JSON:</label>
              <Input type="file" accept=".json" onChange={handleFileUpload} />
              {ga4Config.serviceAccountJson && (
                <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                  ✅ Mock Service Account: {ga4Config.serviceAccountJson.client_email || 'demo@example.com'}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button onClick={testGA4Connection} disabled={isConnecting || !ga4Config.propertyId || !ga4Config.serviceAccountJson} variant="success" size="medium">
              {isConnecting ? '🔄 Testing Connection...' : '🧪 Test Mock Connection'}
            </Button>

            <a
              href="https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs"
            >
              📚 Real GA4 Setup Guide
            </a>
          </div>

          {ga4Config.error && (
            <Card className="mt-3 bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700">
              <div className="text-red-600 dark:text-red-300 text-sm">❌ {ga4Config.error}</div>
            </Card>
          )}

          {ga4Config.isAuthenticated && (
            <Card className="mt-3 bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700">
              <div className="text-green-600 dark:text-green-300 text-sm">
                ✅ Mock GA4 connection successful! Switch to "Google Analytics 4" data source to see realistic analytics data.
                <br />
                <span className="text-xs">Last connected: {new Date(ga4Config.lastFetch!).toLocaleString()}</span>
              </div>
            </Card>
          )}

          <Card className="mt-4 bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700">
            <div className="text-blue-600 dark:text-blue-300 text-xs">
              <strong>🏗️ For Real GA4 Integration:</strong>
              <br />• Backend server required (Node.js/Python/etc.)
              <br />• Service account authentication with private keys
              <br />• GA4 Data API proxy endpoint for CORS handling
              <br />• See documentation for production setup
            </div>
          </Card>
        </Card>
      )}
    </Card>
  )
} 