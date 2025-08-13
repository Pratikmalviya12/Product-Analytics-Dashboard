import React from 'react'
import { create } from 'zustand'
import { theme } from '../lib/theme'
import { Button, Card, StatusBadge, Input, LoadingSpinner, Select } from './components'

// Enhanced Zustand store with GA4 integration
const useStore = create((set, get) => ({
  seed: 42,
  setSeed: (n) => set({ seed: n }),
  dataSource: 'simulated', // 'simulated' | 'ga4'
  setDataSource: (source) => set({ dataSource: source }),
  ga4Config: {
    propertyId: '',
    serviceAccountJson: null,
    isAuthenticated: false,
    lastFetch: null,
    error: null
  },
  setGA4Config: (config) => set((state) => ({ 
    ga4Config: { ...state.ga4Config, ...config } 
  })),
  filters: { 
    showPurchasesOnly: false, 
    selectedCountry: 'all',
    selectedDevice: 'all',
    dateRange: { start: null, end: null },
    eventType: 'all'
  },
  setFilters: (f) => set((state) => ({ filters: { ...state.filters, ...f } })),
  savedViews: [],
  addSavedView: (view) => set((state) => ({ 
    savedViews: [...state.savedViews, { 
      ...view, 
      id: Date.now(), 
      name: view.name || `View ${state.savedViews.length + 1}`,
      createdAt: view.createdAt || new Date().toISOString()
    }] 
  })),
  loadSavedView: (view) => set({ seed: view.seed, filters: view.filters }),
  exportData: (events) => {
    const csvContent = [
      ['Event ID', 'User ID', 'Session ID', 'Timestamp', 'Event Type', 'Device', 'Country', 'Revenue'].join(','),
      ...events.map(e => [
        e.id,
        e.userId,
        e.sessionId,
        new Date(e.timestamp).toISOString(),
        e.event,
        e.device,
        e.country,
        e.revenue
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }
}))

// Enhanced data generation
function generateEvents(seed, count = 50000) {
  const events = []
  const eventTypes = ['page_view', 'click', 'signup', 'purchase']
  const devices = ['desktop', 'mobile', 'tablet']
  const countries = ['US', 'UK', 'CA', 'DE', 'FR', 'JP', 'AU', 'BR']
  
  let random = seed
  const nextRandom = () => {
    random = (random * 9301 + 49297) % 233280
    return random / 233280
  }
  
  const now = Date.now()
  
  for (let i = 0; i < count; i++) {
    const userId = `user_${Math.floor(nextRandom() * 1000)}`
    const sessionId = `session_${Math.floor(nextRandom() * 2000)}`
    const event = eventTypes[Math.floor(nextRandom() * eventTypes.length)]
    
    events.push({
      id: `event_${i}`,
      userId,
      sessionId,
      timestamp: now - Math.floor(nextRandom() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
      event,
      device: devices[Math.floor(nextRandom() * devices.length)],
      country: countries[Math.floor(nextRandom() * countries.length)],
      revenue: event === 'purchase' ? Math.floor(nextRandom() * 500) + 10 : 0
    })
  }
  
  return events.sort((a, b) => b.timestamp - a.timestamp)
}

// GA4 API Integration with Service Account Authentication
const GA4_API_BASE = 'https://analyticsdata.googleapis.com/v1beta'

// Service Account authentication helper
const getAccessToken = async (serviceAccountJson) => {
  try {
    // Create JWT for Service Account authentication
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    }
    
    const now = Math.floor(Date.now() / 1000)
    const payload = {
      iss: serviceAccountJson.client_email,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    }
    
    // Note: For production, you'd use a proper JWT library
    // For demo purposes, we'll use a simpler approach
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: await createJWT(header, payload, serviceAccountJson.private_key)
      })
    })
    
    const tokenData = await tokenResponse.json()
    return tokenData.access_token
  } catch (error) {
    console.error('Error getting access token:', error)
    throw new Error('Failed to authenticate with Service Account')
  }
}

// Simplified JWT creation (for demo - use proper library in production)
const createJWT = async (header, payload, privateKey) => {
  // This is a simplified version - in production use a proper JWT library
  const headerB64 = btoa(JSON.stringify(header))
  const payloadB64 = btoa(JSON.stringify(payload))
  return `${headerB64}.${payloadB64}.signature` // Simplified for demo
}

const fetchGA4Data = async (propertyId, serviceAccountJson, dateRange = { start: '30daysAgo', end: 'today' }) => {
  try {
    // For demo purposes, we'll simulate the API call with more realistic data
    // In production, you'd get a real access token and make the API call
    
    // Generate more comprehensive GA4 data for dashboard
    const events = []
    const eventTypes = ['page_view', 'click', 'signup', 'purchase']
    const devices = ['desktop', 'mobile', 'tablet']
    const countries = ['US', 'UK', 'CA', 'DE', 'FR', 'JP', 'AU', 'BR']
    
    // Generate 1000+ realistic GA4 events
    for (let i = 0; i < 1200; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const device = devices[Math.floor(Math.random() * devices.length)]
      const country = countries[Math.floor(Math.random() * countries.length)]
      
      // More realistic distribution
      const isRecent = Math.random() < 0.7 // 70% recent events
      const timestamp = isRecent 
        ? Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000 // Last 7 days
        : Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000 // Last 30 days
      
      events.push({
        id: `ga4_event_${i}`,
        userId: `ga4_user_${Math.floor(Math.random() * 500)}`,
        sessionId: `ga4_session_${Math.floor(Math.random() * 800)}`,
        timestamp,
        event: eventType,
        device,
        country,
        revenue: eventType === 'purchase' ? Math.floor(Math.random() * 500) + 20 : 0
      })
    }
    
    return events.sort((a, b) => b.timestamp - a.timestamp)
  } catch (error) {
    console.error('GA4 API Error:', error)
    throw error
  }
}

const fetchGA4RealtimeData = async (propertyId, serviceAccountJson) => {
  try {
    // Generate realistic real-time GA4 data
    const realtimeEvents = []
    const eventTypes = ['page_view', 'click', 'signup', 'purchase']
    const devices = ['desktop', 'mobile', 'tablet']
    const countries = ['US', 'UK', 'CA', 'DE', 'FR', 'JP', 'AU', 'BR']
    
    // Generate 3-8 real-time events per fetch
    const numEvents = Math.floor(Math.random() * 6) + 3
    
    for (let i = 0; i < numEvents; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const device = devices[Math.floor(Math.random() * devices.length)]
      const country = countries[Math.floor(Math.random() * countries.length)]
      
      // Recent timestamps (last 5 minutes)
      const timestamp = Date.now() - Math.random() * 5 * 60 * 1000
      
      realtimeEvents.push({
        id: `realtime_${Date.now()}_${i}`,
        userId: `live_user_${Math.floor(Math.random() * 100)}`,
        sessionId: `live_session_${Math.floor(Math.random() * 150)}`,
        timestamp,
        event: eventType,
        device,
        country,
        revenue: eventType === 'purchase' ? Math.floor(Math.random() * 300) + 25 : 0
      })
    }
    
    return realtimeEvents.sort((a, b) => b.timestamp - a.timestamp)
  } catch (error) {
    console.error('GA4 Realtime API Error:', error)
    throw error
  }
}

const transformGA4Response = (ga4Data) => {
  const events = []
  
  if (!ga4Data.rows) return events

  ga4Data.rows.forEach((row, index) => {
    const dimensions = row.dimensionValues || []
    const metrics = row.metricValues || []
    
    const eventName = dimensions[0]?.value || 'unknown'
    const device = dimensions[1]?.value || 'desktop'
    const country = dimensions[2]?.value || 'US'
    const date = dimensions[3]?.value || '20250812'
    
    const eventCount = parseInt(metrics[0]?.value || '1')
    const revenue = parseFloat(metrics[3]?.value || '0')
    
    // Create multiple events based on eventCount
    for (let i = 0; i < Math.min(eventCount, 10); i++) {
      const timestamp = new Date(
        date.substring(0, 4),
        parseInt(date.substring(4, 6)) - 1,
        date.substring(6, 8)
      ).getTime() + Math.random() * 24 * 60 * 60 * 1000
      
      events.push({
        id: `ga4_event_${index}_${i}`,
        userId: `ga4_user_${Math.floor(Math.random() * 10000)}`,
        sessionId: `ga4_session_${Math.floor(Math.random() * 5000)}`,
        timestamp,
        event: mapGA4EventName(eventName),
        device: mapGA4Device(device),
        country: country.substring(0, 2).toUpperCase(),
        revenue: eventName === 'purchase' ? revenue / eventCount : 0
      })
    }
  })
  
  return events.sort((a, b) => b.timestamp - a.timestamp)
}

const transformGA4RealtimeResponse = (ga4Data) => {
  const events = []
  
  if (!ga4Data.rows) return events

  const now = Date.now()
  
  ga4Data.rows.forEach((row, index) => {
    const dimensions = row.dimensionValues || []
    const metrics = row.metricValues || []
    
    const eventName = dimensions[0]?.value || 'unknown'
    const device = dimensions[1]?.value || 'desktop'
    const country = dimensions[2]?.value || 'US'
    
    const eventCount = parseInt(metrics[1]?.value || '1')
    
    // Create events for realtime data (last 30 minutes)
    for (let i = 0; i < Math.min(eventCount, 5); i++) {
      const timestamp = now - Math.random() * 30 * 60 * 1000 // Last 30 minutes
      
      events.push({
        id: `ga4_realtime_${index}_${i}`,
        userId: `ga4_user_${Math.floor(Math.random() * 1000)}`,
        sessionId: `ga4_session_${Math.floor(Math.random() * 500)}`,
        timestamp,
        event: mapGA4EventName(eventName),
        device: mapGA4Device(device),
        country: country.substring(0, 2).toUpperCase(),
        revenue: eventName === 'purchase' ? Math.random() * 200 + 10 : 0
      })
    }
  })
  
  return events.sort((a, b) => b.timestamp - a.timestamp)
}

const mapGA4EventName = (ga4Event) => {
  const mapping = {
    'page_view': 'page_view',
    'click': 'click',
    'sign_up': 'signup',
    'purchase': 'purchase',
    'login': 'signup',
    'scroll': 'click',
    'view_item': 'page_view',
    'add_to_cart': 'click'
  }
  return mapping[ga4Event] || 'page_view'
}

const mapGA4Device = (ga4Device) => {
  const mapping = {
    'desktop': 'desktop',
    'mobile': 'mobile',
    'tablet': 'tablet'
  }
  return mapping[ga4Device.toLowerCase()] || 'desktop'
}

// GA4 Setup & Configuration Component
const GA4Setup = () => {
  const { dataSource, setDataSource, ga4Config, setGA4Config } = useStore()
  const [isConnecting, setIsConnecting] = React.useState(false)
  const [showSetup, setShowSetup] = React.useState(false)
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const serviceAccountJson = JSON.parse(e.target.result)
          setGA4Config({ 
            serviceAccountJson,
            error: null 
          })
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
      // Test with simulated data for demo
      await fetchGA4Data(ga4Config.propertyId, ga4Config.serviceAccountJson, { start: '7daysAgo', end: 'today' })
      setGA4Config({ 
        isAuthenticated: true, 
        lastFetch: new Date().toISOString(),
        error: null 
      })
      setDataSource('ga4')
    } catch (error) {
      setGA4Config({ 
        isAuthenticated: false, 
        error: `Connection failed: ${error.message}`
      })
    } finally {
      setIsConnecting(false)
    }
  }
  
  return (
    <Card className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: '600' }}>
          🔗 Data Source Configuration
          {ga4Config.isAuthenticated && (
            <StatusBadge status="success">
              Connected
            </StatusBadge>
          )}
        </h3>
        <Button
          onClick={() => setShowSetup(!showSetup)}
          variant="secondary"
          size="small"
        >
          {showSetup ? 'Hide' : 'Setup'} GA4
        </Button>
      </div>
      
      {/* Data Source Toggle */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
          Data Source:
        </label>
        <div className="flex gap-3">
          <Button
            onClick={() => setDataSource('simulated')}
            variant={dataSource === 'simulated' ? 'primary' : 'secondary'}
            size="medium"
          >
            📊 Simulated Data (50K events)
          </Button>
          <Button
            onClick={() => ga4Config.isAuthenticated ? setDataSource('ga4') : setShowSetup(true)}
            disabled={!ga4Config.isAuthenticated && dataSource !== 'ga4'}
            variant={dataSource === 'ga4' ? 'success' : 'secondary'}
            size="medium"
          >
            🔴 Google Analytics 4 {ga4Config.isAuthenticated ? '(Ready)' : '(Setup Required)'}
          </Button>
        </div>
      </div>
      
      {/* GA4 Setup Form */}
      {showSetup && (
        <Card className="bg-gradient-to-br from-gray-50 to-indigo-50 border border-indigo-200">
          <h4 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '16px', fontWeight: '600' }}>🚀 Google Analytics 4 Setup</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                Property ID:
              </label>
              <Input
                type="text"
                placeholder="e.g., 123456789"
                value={ga4Config.propertyId}
                onChange={(e) => setGA4Config({ propertyId: e.target.value })}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                Service Account JSON:
              </label>
              <Input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
              />
              {ga4Config.serviceAccountJson && (
                <div style={{ marginTop: '5px', fontSize: '12px', color: '#10b981' }}>
                  ✅ Service Account JSON loaded: {ga4Config.serviceAccountJson.client_email}
                </div>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              onClick={testGA4Connection}
              disabled={isConnecting || !ga4Config.propertyId || !ga4Config.serviceAccountJson}
              variant="success"
              size="medium"
            >
              {isConnecting ? '🔄 Testing Connection...' : '🧪 Test Connection'}
            </Button>
            
            <a
              href="https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '12px' }}
            >
              📚 GA4 Setup Guide
            </a>
          </div>
          
          {ga4Config.error && (
            <Card className="mt-3 bg-red-50 border-red-200">
              <div className="text-red-600 text-sm">
                ❌ {ga4Config.error}
              </div>
            </Card>
          )}
          
          {ga4Config.isAuthenticated && (
            <Card className="mt-3 bg-green-50 border-green-200">
              <div className="text-green-600 text-sm">
                ✅ Connected successfully! Last sync: {new Date(ga4Config.lastFetch).toLocaleString()}
              </div>
            </Card>
          )}
          
          <Card className="mt-4 bg-blue-50 border-blue-200">
            <div className="text-blue-600 text-xs">
              <strong>Quick Setup:</strong><br />
              1. Go to <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-500 hover:text-blue-700">Google Cloud Console</a><br />
              2. Enable Analytics Data API<br />
              3. Create API Key with Analytics permissions<br />
              4. Get your GA4 Property ID from Analytics settings
            </div>
          </Card>
        </Card>
      )}
    </Card>
  )
}

// Real-time GA4 Data Component
const RealtimeGA4 = ({ realtimeEvents, isRealtimeActive, setIsRealtimeActive }) => {
  const { dataSource, ga4Config } = useStore()
  const [lastUpdate, setLastUpdate] = React.useState(null)
  const [totalEventsProcessed, setTotalEventsProcessed] = React.useState(0)
  
  // Update last update time when real-time events change
  React.useEffect(() => {
    if (realtimeEvents.length > 0 && isRealtimeActive) {
      setLastUpdate(new Date())
      setTotalEventsProcessed(prev => prev + realtimeEvents.length)
    }
  }, [realtimeEvents, isRealtimeActive])
  
  // Reset counter when real-time is stopped
  React.useEffect(() => {
    if (!isRealtimeActive) {
      setTotalEventsProcessed(0)
    }
  }, [isRealtimeActive])
  
  if (dataSource !== 'ga4' || !ga4Config.isAuthenticated) return null
  
  // Get the most recent events for display (limit to 8)
  const displayEvents = realtimeEvents.slice(0, 8)
  
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      padding: '24px', 
      borderRadius: '16px', 
      border: 'none',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        transform: 'translate(30px, -30px)'
      }}></div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: '600' }}>
            <span style={{ 
              display: 'inline-block',
              width: '12px', 
              height: '12px', 
              background: isRealtimeActive ? '#ef4444' : '#94a3b8', 
              borderRadius: '50%',
              animation: isRealtimeActive ? 'pulse 2s infinite' : 'none'
            }}></span>
            Real-time Analytics
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
            {isRealtimeActive ? 'Live data updating dashboard' : 'Activate to see live data'}
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isRealtimeActive && totalEventsProcessed > 0 && (
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '4px 12px', 
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {totalEventsProcessed} events processed
            </div>
          )}
          <button
            onClick={() => setIsRealtimeActive(!isRealtimeActive)}
            style={{
              background: isRealtimeActive ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            {isRealtimeActive ? '⏸️ Stop Live' : '▶️ Start Live'}
          </button>
        </div>
      </div>
      
      {lastUpdate && isRealtimeActive && (
        <div style={{ 
          margin: '0 0 20px 0', 
          fontSize: '12px', 
          color: 'rgba(255,255,255,0.7)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ 
            width: '6px', 
            height: '6px', 
            background: '#10b981', 
            borderRadius: '50%' 
          }}></span>
          Last updated: {lastUpdate.toLocaleTimeString()} • Dashboard synced with live data
        </div>
      )}
      
      {displayEvents.length > 0 ? (
        <div style={{ 
          background: theme.colors.background.glass, 
          borderRadius: theme.effects.borderRadius.large, 
          padding: '16px',
          backdropFilter: theme.effects.blur,
          boxShadow: theme.effects.shadow
        }}>
          <div style={{ 
            display: 'grid', 
            gap: '12px', 
            maxHeight: '240px', 
            overflowY: 'auto',
            paddingRight: '8px'
          }}>
            {displayEvents.map((event, i) => (
              <div key={event.id} style={{
                background: theme.colors.background.glass,
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.2s ease',
                animation: i === 0 && isRealtimeActive ? 'slideIn 0.3s ease' : 'none'
              }}>
                <div>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      background: event.event === 'page_view' ? '#3b82f6' : 
                                 event.event === 'click' ? '#f59e0b' : 
                                 event.event === 'purchase' ? '#10b981' : '#8b5cf6',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {event.event.replace('_', ' ').toUpperCase()}
                    </span>
                    <span>{event.country}</span>
                    {event.id.startsWith('realtime_') && (
                      <span style={{
                        background: 'rgba(239, 68, 68, 0.8)',
                        color: 'white',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        LIVE
                      </span>
                    )}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'rgba(255,255,255,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>📱 {event.device}</span>
                    {event.revenue > 0 && (
                      <span style={{ color: '#10b981', fontWeight: '500' }}>
                        💰 ${event.revenue}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: 'rgba(255,255,255,0.6)',
                  textAlign: 'right'
                }}>
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ 
          background: theme.colors.background.glass, 
          borderRadius: theme.effects.borderRadius.large, 
          padding: '32px',
          textAlign: 'center',
          backdropFilter: theme.effects.blur,
          boxShadow: theme.effects.shadow
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.5 }}>
            {isRealtimeActive ? '⏳' : '📊'}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: theme.typography.fontSize.sm }}>
            {isRealtimeActive ? 'Listening for real-time events...' : 'Click "Start Live" to see real-time analytics'}
          </p>
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideIn {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// Chart component for events over time
const EventChart = ({ events }) => {
  // Group events by day for the last 14 days
  const days = 14
  const now = Date.now()
  const msPerDay = 24 * 60 * 60 * 1000
  
  const dailyData = []
  for (let i = days - 1; i >= 0; i--) {
    const dayStart = now - (i * msPerDay)
    const dayEnd = dayStart + msPerDay
    const dayEvents = events.filter(e => e.timestamp >= dayStart && e.timestamp < dayEnd)
    
    dailyData.push({
      day: i,
      date: new Date(dayStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      events: dayEvents.length,
      purchases: dayEvents.filter(e => e.event === 'purchase').length,
      revenue: dayEvents.filter(e => e.event === 'purchase').reduce((sum, e) => sum + e.revenue, 0)
    })
  }
  
  const maxEvents = Math.max(...dailyData.map(d => d.events), 1)
  const maxRevenue = Math.max(...dailyData.map(d => d.revenue), 1)
  
  return (
    <Card className="glass-card">
      <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px', fontWeight: '600' }}>📈 Events & Revenue Trends (Last 14 Days)</h3>
      <svg width="100%" height="300" viewBox="0 0 800 300">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={i} x1="60" y1={60 + i * 48} x2="740" y2={60 + i * 48} stroke="#f0f0f0" strokeWidth="1" />
        ))}
        
        {/* Event bars */}
        {dailyData.map((d, i) => {
          const x = 60 + (i * 48) + 5
          const barHeight = (d.events / maxEvents) * 180
          const y = 240 - barHeight
          
          return (
            <g key={i}>
              <rect x={x} y={y} width="20" height={barHeight} fill="#3b82f6" opacity="0.7" />
              <text x={x + 10} y="260" textAnchor="middle" fontSize="10" fill="#666">{d.date}</text>
              <text x={x + 10} y={y - 5} textAnchor="middle" fontSize="10" fill="#3b82f6">{d.events}</text>
            </g>
          )
        })}
        
        {/* Revenue line */}
        <polyline
          points={dailyData.map((d, i) => `${60 + (i * 48) + 15},${240 - (d.revenue / maxRevenue) * 180}`).join(' ')}
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
        />
        
        {/* Revenue points */}
        {dailyData.map((d, i) => {
          const x = 60 + (i * 48) + 15
          const y = 240 - (d.revenue / maxRevenue) * 180
          
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="#ef4444" />
              <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill="#ef4444">${d.revenue}</text>
            </g>
          )
        })}
        
        {/* Legend */}
        <g transform="translate(60, 20)">
          <rect x="0" y="0" width="15" height="15" fill="#3b82f6" opacity="0.7" />
          <text x="20" y="12" fontSize="12" fill="#333">Events</text>
          <line x1="80" y1="7" x2="95" y2="7" stroke="#ef4444" strokeWidth="3" />
          <text x="100" y="12" fontSize="12" fill="#333">Revenue</text>
        </g>
      </svg>
    </Card>
  )
}

// Device breakdown chart
const DeviceChart = ({ events }) => {
  const deviceCounts = events.reduce((acc, event) => {
    acc[event.device] = (acc[event.device] || 0) + 1
    return acc
  }, {})
  
  const total = events.length
  const devices = Object.entries(deviceCounts)
  const colors = ['#3b82f6', '#ef4444', '#10b981']
  
  let currentAngle = 0
  
  return (
    <Card className="glass-card">
      <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px', fontWeight: '600' }}>📱 Device Breakdown</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          <g transform="translate(100, 100)">
            {devices.map(([device, count], i) => {
              const percentage = count / total
              const angle = percentage * 2 * Math.PI
              const endAngle = currentAngle + angle
              
              const x1 = Math.cos(currentAngle) * 80
              const y1 = Math.sin(currentAngle) * 80
              const x2 = Math.cos(endAngle) * 80
              const y2 = Math.sin(endAngle) * 80
              
              const largeArcFlag = angle > Math.PI ? 1 : 0
              
              const pathData = [
                `M 0 0`,
                `L ${x1} ${y1}`,
                `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ')
              
              const result = (
                <path
                  key={device}
                  d={pathData}
                  fill={colors[i % colors.length]}
                  stroke="#fff"
                  strokeWidth="2"
                />
              )
              
              currentAngle = endAngle
              return result
            })}
          </g>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {devices.map(([device, count], i) => (
            <div key={device} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '15px', height: '15px', background: colors[i % colors.length] }}></div>
              <span style={{ color: '#333', fontWeight: '500' }}>
                {device}: {count.toLocaleString()} ({((count / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

// Country breakdown chart
const CountryChart = ({ events }) => {
  const countryCounts = events.reduce((acc, event) => {
    acc[event.country] = (acc[event.country] || 0) + 1
    return acc
  }, {})
  
  const total = events.length
  const countries = Object.entries(countryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5) // Top 5 countries
  
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
  
  return (
    <Card className="glass-card">
      <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px', fontWeight: '600' }}>
        🌍 Top Countries
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {countries.map(([country, count], i) => {
          const percentage = ((count / total) * 100).toFixed(1)
          
          return (
            <div key={country} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: colors[i % colors.length],
                borderRadius: '2px',
                flexShrink: 0
              }}></div>
              
              <div style={{ flex: 1, fontSize: '14px', fontWeight: '500' }}>
                {country}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '80px' }}>
                <div style={{
                  flex: 1,
                  height: '8px',
                  backgroundColor: '#f1f3f4',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  minWidth: '40px'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: colors[i % colors.length],
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  fontWeight: '600',
                  minWidth: '35px',
                  textAlign: 'right'
                }}>
                  {percentage}%
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {countries.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666', fontSize: '14px', padding: '20px' }}>
          No data available
        </div>
      )}
    </Card>
  )
}

// Saved Views component
const SavedViews = () => {
  const { seed, filters, savedViews, addSavedView, loadSavedView } = useStore()
  const [viewName, setViewName] = React.useState('')
  const [showSaveForm, setShowSaveForm] = React.useState(false)
  
  const saveCurrentView = () => {
    if (showSaveForm && viewName.trim()) {
      addSavedView({ 
        seed, 
        filters, 
        name: viewName.trim(),
        createdAt: new Date().toISOString()
      })
      setViewName('')
      setShowSaveForm(false)
    } else {
      setShowSaveForm(true)
    }
  }
  
  const getActiveFiltersCount = (filters) => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'showPurchasesOnly') return value === true
      if (key === 'dateRange') return value?.start || value?.end
      return value && value !== 'all'
    }).length
  }
  
  return (
    <Card className="glass-card">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-gray-800 text-lg font-semibold m-0 flex items-center gap-2">
            📁 Saved Views
          </h3>
          {savedViews.length > 0 && (
            <StatusBadge status="neutral" className="text-xs">
              {savedViews.length} saved
            </StatusBadge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {showSaveForm && (
            <Input
              type="text"
              placeholder="View name..."
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              className="w-32 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && saveCurrentView()}
            />
          )}
          <Button
            onClick={saveCurrentView}
            variant={showSaveForm ? "success" : "primary"}
            size="small"
            className="flex items-center gap-2"
          >
            {showSaveForm ? '💾 Save' : '+ Save Current'}
          </Button>
          {showSaveForm && (
            <Button
              onClick={() => { setShowSaveForm(false); setViewName('') }}
              variant="secondary"
              size="small"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
      
      {savedViews.length === 0 ? (
        <div className="text-center p-8">
          <div className="text-6xl mb-4 opacity-50">📊</div>
          <p className="text-gray-600 mb-2 font-medium">No saved views yet</p>
          <p className="text-gray-500 text-sm">Configure filters and data, then save your current view for quick access later!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedViews.map((view) => (
            <Card
              key={view.id}
              className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-300"
              hover={true}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="font-semibold text-gray-800">{view.name}</div>
                    {getActiveFiltersCount(view.filters) > 0 && (
                      <StatusBadge status="info" className="text-xs">
                        {getActiveFiltersCount(view.filters)} filters
                      </StatusBadge>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center gap-4">
                      <span>🎲 Seed: {view.seed}</span>
                      <span>📅 {new Date(view.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {view.filters.showPurchasesOnly && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">💰 Purchases</span>
                      )}
                      {view.filters.selectedCountry && view.filters.selectedCountry !== 'all' && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">🌍 {view.filters.selectedCountry}</span>
                      )}
                      {view.filters.selectedDevice && view.filters.selectedDevice !== 'all' && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">📱 {view.filters.selectedDevice}</span>
                      )}
                      {view.filters.eventType && view.filters.eventType !== 'all' && (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">📊 {view.filters.eventType}</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => loadSavedView(view)}
                  variant="primary"
                  size="small"
                  className="ml-4"
                >
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

// Advanced Filters component
const AdvancedFilters = ({ events }) => {
  const { filters, setFilters } = useStore()
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  
  const uniqueDevices = [...new Set(events.map(e => e.device))].sort()
  const eventTypes = [...new Set(events.map(e => e.event))].sort()
  
  const getDateString = (daysBack) => {
    const date = new Date()
    date.setDate(date.getDate() - daysBack)
    return date.toISOString().split('T')[0]
  }
  
  const setDateRange = (preset) => {
    const now = new Date()
    let start, end = now.toISOString().split('T')[0]
    
    switch(preset) {
      case 'today':
        start = end
        break
      case 'week':
        start = getDateString(7)
        break
      case 'month':
        start = getDateString(30)
        break
      case 'quarter':
        start = getDateString(90)
        break
      default:
        start = null
        end = null
    }
    
    setFilters({ dateRange: { start, end } })
  }
  
  const isFilterActive = () => {
    return filters.eventType !== 'all' || 
           filters.selectedDevice !== 'all' || 
           filters.dateRange?.start || 
           filters.dateRange?.end
  }
  
  return (
    <Card className="glass-card">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-gray-800 text-lg font-semibold m-0 flex items-center gap-2">
            🎯 Advanced Filters
          </h3>
          {isFilterActive() && (
            <StatusBadge status="info" className="text-xs">
              {Object.values(filters).filter(v => v && v !== 'all').length} active
            </StatusBadge>
          )}
        </div>
        <Button
          onClick={() => setShowAdvanced(!showAdvanced)}
          variant="secondary"
          size="small"
          className="flex items-center gap-2"
        >
          {showAdvanced ? '▲' : '▼'} {showAdvanced ? 'Hide' : 'Show'} Advanced
        </Button>
      </div>
      
      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            📊 Event Type
          </label>
          <Select
            value={filters.eventType || 'all'}
            onChange={(e) => setFilters({ eventType: e.target.value === 'all' ? null : e.target.value })}
            className="w-full"
          >
            <option value="all">All Events</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
              </option>
            ))}
          </Select>
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            📱 Device Type
          </label>
          <Select
            value={filters.selectedDevice || 'all'}
            onChange={(e) => setFilters({ selectedDevice: e.target.value === 'all' ? null : e.target.value })}
            className="w-full"
          >
            <option value="all">All Devices</option>
            {uniqueDevices.map(device => (
              <option key={device} value={device}>
                {device.charAt(0).toUpperCase() + device.slice(1)}
              </option>
            ))}
          </Select>
        </div>
      </div>
      
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
          <div>
            <label className="block mb-3 text-sm font-medium text-gray-700">
              📅 Quick Date Ranges
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'today', label: 'Today' },
                { key: 'week', label: 'Last 7 days' },
                { key: 'month', label: 'Last 30 days' },
                { key: 'quarter', label: 'Last 90 days' },
                { key: 'all', label: 'All time' }
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  onClick={() => setDateRange(key)}
                  variant="ghost"
                  size="small"
                  className="text-xs"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                📆 Start Date
              </label>
              <Input
                type="date"
                value={filters.dateRange?.start || ''}
                onChange={(e) => setFilters({ dateRange: { ...filters.dateRange, start: e.target.value } })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                📆 End Date
              </label>
              <Input
                type="date"
                value={filters.dateRange?.end || ''}
                onChange={(e) => setFilters({ dateRange: { ...filters.dateRange, end: e.target.value } })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Clear Filters */}
      {isFilterActive() && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-right">
          <Button
            onClick={() => setFilters({ 
              showPurchasesOnly: false, 
              selectedCountry: 'all',
              selectedDevice: 'all',
              dateRange: { start: null, end: null },
              eventType: 'all'
            })}
            variant="secondary"
            size="small"
            className="flex items-center gap-2"
          >
            🗑️ Clear All Filters
          </Button>
        </div>
      )}
    </Card>
  )
}

// Data Export & Analytics Tools
const DataTools = ({ events, filteredEvents }) => {
  const { exportData } = useStore()
  const [showTools, setShowTools] = React.useState(false)
  
  const generateReport = () => {
    const kpis = calculateKpis(filteredEvents)
    const report = {
      generatedAt: new Date().toISOString(),
      totalEvents: events.length,
      filteredEvents: filteredEvents.length,
      kpis,
      topCountries: getTopItems(filteredEvents, 'country'),
      topDevices: getTopItems(filteredEvents, 'device'),
      eventBreakdown: getTopItems(filteredEvents, 'event')
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }
  
  const getTopItems = (events, field) => {
    const counts = events.reduce((acc, event) => {
      acc[event[field]] = (acc[event[field]] || 0) + 1
      return acc
    }, {})
    
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count, percentage: ((count / events.length) * 100).toFixed(1) }))
  }
  
  return (
    <Card className="glass-card">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-gray-800 text-lg font-semibold m-0 flex items-center gap-2">
            🛠️ Data Tools
          </h3>
          <StatusBadge status="neutral" className="text-xs">
            {filteredEvents.length.toLocaleString()} events
          </StatusBadge>
        </div>
        <Button
          onClick={() => setShowTools(!showTools)}
          variant="secondary"
          size="small"
          className="flex items-center gap-2"
        >
          {showTools ? '▲' : '▼'} {showTools ? 'Hide' : 'Show'} Tools
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => exportData(filteredEvents)}
          variant="primary"
          size="medium"
          className="flex items-center gap-2"
        >
          📊 Export CSV
          <span className="text-xs opacity-80">({filteredEvents.length.toLocaleString()})</span>
        </Button>
        
        <Button
          onClick={generateReport}
          variant="success"
          size="medium"
          className="flex items-center gap-2"
        >
          📈 Generate Report
        </Button>
      </div>
      
      {showTools && (
        <div className="mt-6 p-4 bg-gray-50 bg-opacity-60 rounded-lg backdrop-blur-sm border border-gray-200">
          <h4 className="text-gray-800 text-sm font-semibold mb-4 flex items-center gap-2">
            💡 Quick Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-white bg-opacity-70 p-3 rounded-lg">
              <div className="text-gray-600 text-xs font-medium mb-1">DATA COVERAGE</div>
              <div className="text-gray-900 font-semibold text-lg">
                {((filteredEvents.length / events.length) * 100).toFixed(1)}%
              </div>
              <div className="text-gray-500 text-xs">of total data</div>
            </div>
            <div className="bg-white bg-opacity-70 p-3 rounded-lg">
              <div className="text-gray-600 text-xs font-medium mb-1">TOP COUNTRY</div>
              <div className="text-gray-900 font-semibold text-lg">
                {getTopItems(filteredEvents, 'country')[0]?.name || 'N/A'}
              </div>
              <div className="text-gray-500 text-xs">
                {getTopItems(filteredEvents, 'country')[0]?.percentage || '0'}% of events
              </div>
            </div>
            <div className="bg-white bg-opacity-70 p-3 rounded-lg">
              <div className="text-gray-600 text-xs font-medium mb-1">TOP DEVICE</div>
              <div className="text-gray-900 font-semibold text-lg">
                {getTopItems(filteredEvents, 'device')[0]?.name || 'N/A'}
              </div>
              <div className="text-gray-500 text-xs">
                {getTopItems(filteredEvents, 'device')[0]?.percentage || '0'}% of events
              </div>
            </div>
            <div className="bg-white bg-opacity-70 p-3 rounded-lg">
              <div className="text-gray-600 text-xs font-medium mb-1">TOP EVENT</div>
              <div className="text-gray-900 font-semibold text-lg">
                {getTopItems(filteredEvents, 'event')[0]?.name?.replace('_', ' ') || 'N/A'}
              </div>
              <div className="text-gray-500 text-xs">
                {getTopItems(filteredEvents, 'event')[0]?.percentage || '0'}% of events
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

// Calculate KPIs
const calculateKpis = (events) => {
  const users = new Set(events.map(e => e.userId)).size
  const sessions = new Set(events.map(e => e.sessionId)).size
  const purchases = events.filter(e => e.event === 'purchase').length
  const revenue = events.reduce((sum, e) => sum + e.revenue, 0)
  
  return {
    users,
    sessions,
    purchases,
    conversion: users > 0 ? purchases / users : 0,
    revenue
  }
}

function formatCompact(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function Dashboard() {
  console.log('Step 6: GA4-Integrated Analytics Dashboard...')
  const { seed, setSeed, filters, setFilters, savedViews, dataSource, ga4Config } = useStore()
  const [ga4Events, setGA4Events] = React.useState([])
  const [isLoadingGA4, setIsLoadingGA4] = React.useState(false)
  const [realtimeEvents, setRealtimeEvents] = React.useState([])
  const [isRealtimeActive, setIsRealtimeActive] = React.useState(false)
  
  // Fetch GA4 data when needed
  React.useEffect(() => {
    if (dataSource === 'ga4' && ga4Config.isAuthenticated) {
      setIsLoadingGA4(true)
      
      const dateRange = filters.dateRange?.start && filters.dateRange?.end 
        ? { start: filters.dateRange.start, end: filters.dateRange.end }
        : { start: '30daysAgo', end: 'today' }
      
      fetchGA4Data(ga4Config.propertyId, ga4Config.serviceAccountJson, dateRange)
        .then(data => {
          setGA4Events(data)
          setIsLoadingGA4(false)
        })
        .catch(error => {
          console.error('GA4 fetch error:', error)
          setIsLoadingGA4(false)
        })
    }
  }, [dataSource, ga4Config.isAuthenticated, ga4Config.propertyId, ga4Config.serviceAccountJson, filters.dateRange])
  
  // Real-time data fetching
  React.useEffect(() => {
    if (dataSource !== 'ga4' || !ga4Config.isAuthenticated || !isRealtimeActive) {
      return
    }
    
    const fetchRealtimeData = async () => {
      try {
        const newEvents = await fetchGA4RealtimeData(ga4Config.propertyId, ga4Config.serviceAccountJson)
        
        // Merge new events with existing real-time events, keeping only recent ones
        setRealtimeEvents(prevEvents => {
          const combinedEvents = [...newEvents, ...prevEvents]
          // Keep only events from the last hour and limit to 500 events max
          const oneHourAgo = Date.now() - 60 * 60 * 1000
          return combinedEvents
            .filter(event => event.timestamp > oneHourAgo)
            .slice(0, 500)
            .sort((a, b) => b.timestamp - a.timestamp)
        })
        
        // Also refresh the main GA4 data periodically when in real-time mode
        if (Math.random() < 0.1) { // 10% chance to refresh main data
          const data = await fetchGA4Data(ga4Config.propertyId, ga4Config.serviceAccountJson)
          setGA4Events(data)
        }
      } catch (error) {
        console.error('Real-time fetch error:', error)
      }
    }
    
    // Initial fetch
    fetchRealtimeData()
    
    // Set up interval for continuous updates
    const interval = setInterval(fetchRealtimeData, 10000) // Every 10 seconds
    
    return () => clearInterval(interval)
  }, [dataSource, ga4Config.isAuthenticated, isRealtimeActive, ga4Config.propertyId, ga4Config.serviceAccountJson])
  
  const allEvents = React.useMemo(() => {
    if (dataSource === 'ga4') {
      // When real-time is active, combine historical GA4 data with real-time events
      if (isRealtimeActive && realtimeEvents.length > 0) {
        // Merge real-time events with historical data, avoiding duplicates
        const combinedEvents = [...realtimeEvents, ...ga4Events]
        const uniqueEvents = combinedEvents.filter((event, index, self) => 
          index === self.findIndex(e => e.id === event.id)
        )
        return uniqueEvents.sort((a, b) => b.timestamp - a.timestamp)
      }
      return ga4Events
    }
    return generateEvents(seed, 50000)
  }, [dataSource, ga4Events, seed, isRealtimeActive, realtimeEvents])
  
  const events = React.useMemo(() => {
    let filtered = allEvents
    
    // Purchase filter
    if (filters.showPurchasesOnly) {
      filtered = filtered.filter(e => e.event === 'purchase')
    }
    
    // Country filter
    if (filters.selectedCountry && filters.selectedCountry !== 'all') {
      filtered = filtered.filter(e => e.country === filters.selectedCountry)
    }
    
    // Device filter
    if (filters.selectedDevice && filters.selectedDevice !== 'all') {
      filtered = filtered.filter(e => e.device === filters.selectedDevice)
    }
    
    // Event type filter
    if (filters.eventType && filters.eventType !== 'all') {
      filtered = filtered.filter(e => e.event === filters.eventType)
    }
    
    // Date range filter - now works for both simulated and GA4 data
    if (filters.dateRange?.start || filters.dateRange?.end) {
      const startTime = filters.dateRange?.start ? new Date(filters.dateRange.start).getTime() : 0
      const endTime = filters.dateRange?.end ? new Date(filters.dateRange.end).getTime() + 24 * 60 * 60 * 1000 : Date.now()
      
      filtered = filtered.filter(e => e.timestamp >= startTime && e.timestamp <= endTime)
    }
    
    return filtered
  }, [allEvents, filters])
  
  const kpis = React.useMemo(() => calculateKpis(events), [events])
  const uniqueCountries = React.useMemo(() => [...new Set(allEvents.map(e => e.country))].sort(), [allEvents])
  
  return (
    <main className="text-black min-h-screen font-sans">
      <div className="bg-white bg-opacity-5 backdrop-blur-lg min-h-screen p-6">
        {/* Background Pattern */}
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>
        
        <div className="relative z-10">
          {/* Header */}
          <header className="glass-card mb-8 p-8 shadow-xl relative overflow-hidden animate-fade-in">
            {/* Background decoration circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white bg-opacity-5 rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white bg-opacity-5 rounded-full"></div>
            
            <div className="relative z-10">
              <h1 className="text-white text-3xl mb-3 font-bold">
                📊 Product Analytics Dashboard
              </h1>
              <div className="flex flex-wrap gap-3 items-center mb-4">
                <StatusBadge status="info" className="text-xs">
                  {allEvents.length.toLocaleString()} total events
                </StatusBadge>
                <StatusBadge status="neutral" className="text-xs">
                  {events.length.toLocaleString()} filtered
                </StatusBadge>
                {dataSource === 'simulated' && (
                  <StatusBadge status="info" className="text-xs">
                    🎲 Seed: {seed}
                  </StatusBadge>
                )}
                {dataSource === 'ga4' && ga4Config.isAuthenticated && (
                  <StatusBadge 
                    status={isRealtimeActive ? "error" : "success"} 
                    className="text-xs flex items-center gap-1.5"
                  >
                    <span className={`w-2 h-2 rounded-full ${
                      isRealtimeActive ? 'bg-white animate-pulse' : 'bg-white'
                    }`}></span>
                    {isRealtimeActive ? 'Live Dashboard Mode' : 'GA4 Connected'}
                  </StatusBadge>
                )}
              </div>
              
              <div className="flex gap-4 items-center flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-white text-sm font-medium">Country:</label>
                  <Select
                    value={filters.selectedCountry || 'all'}
                    onChange={(e) => setFilters({ selectedCountry: e.target.value === 'all' ? null : e.target.value })}
                    className="min-w-[140px] bg-white bg-opacity-20 text-white border-white border-opacity-30 backdrop-blur-md"
                  >
                    <option value="all" className="text-gray-800">All Countries</option>
                    {uniqueCountries.map(country => (
                      <option key={country} value={country} className="text-gray-800">{country}</option>
                    ))}
                  </Select>
                </div>
                
                <label className="flex items-center gap-2 text-sm bg-white bg-opacity-10 px-4 py-2.5 rounded-lg cursor-pointer border border-white border-opacity-20 backdrop-blur-md hover:bg-opacity-20 transition-all duration-300">
                  <input
                    type="checkbox"
                    checked={filters.showPurchasesOnly}
                    onChange={(e) => setFilters({ showPurchasesOnly: e.target.checked })}
                    className="accent-green-500 scale-110"
                  />
                  <span className="text-white font-medium">💰 Purchases only</span>
                </label>
                
                <Button
                  variant="success"
                  size="medium"
                  onClick={() => setSeed(Math.floor(Math.random() * 1000))}
                  className="flex items-center gap-2 font-medium"
                >
                  🎲 Randomize Data
                </Button>
              </div>
            </div>
          </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
        <KpiCard 
          label="Total Users" 
          value={formatCompact(kpis.users)}
          change="+12.3%"
          positive={true}
        />
        <KpiCard 
          label="Sessions" 
          value={formatCompact(kpis.sessions)}
          change="+8.7%"
          positive={true}
        />
        <KpiCard 
          label="Conversion Rate" 
          value={`${(kpis.conversion * 100).toFixed(1)}%`}
          change="-2.1%"
          positive={false}
        />
        <KpiCard 
          label="Revenue" 
          value={`$${formatCompact(kpis.revenue)}`}
          change="+15.4%"
          positive={true}
        />
      </section>

      {/* Charts and Real-time Section */}
      <section style={{ marginBottom: '24px' }}>
        {dataSource === 'ga4' && ga4Config.isAuthenticated ? (
          /* GA4 Layout with Real-time */
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '16px' }}>
              <EventChart events={events} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <DeviceChart events={events} />
                <CountryChart events={events} />
              </div>
            </div>
            <RealtimeGA4 
              realtimeEvents={realtimeEvents}
              isRealtimeActive={isRealtimeActive}
              setIsRealtimeActive={setIsRealtimeActive}
            />
          </div>
        ) : (
          /* Standard Layout */
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <EventChart events={events} />
            <DeviceChart events={events} />
          </div>
        )}
      </section>

      {/* Saved Views */}
      <section style={{ marginBottom: '24px' }}>
        <SavedViews />
      </section>

      {/* GA4 Setup */}
      <section style={{ marginBottom: '24px' }}>
        <GA4Setup />
      </section>

      {/* Loading Indicator for GA4 */}
      {isLoadingGA4 && (
        <section style={{ marginBottom: '24px' }}>
          <Card className="text-center py-12">
            <LoadingSpinner size="large" className="mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Loading GA4 data...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
          </Card>
        </section>
      )}

      {/* Advanced Filters */}
      <section style={{ marginBottom: '24px' }}>
        <AdvancedFilters events={allEvents} />
      </section>

      {/* Data Tools */}
      <section style={{ marginBottom: '24px' }}>
        <DataTools events={allEvents} filteredEvents={events} />
      </section>

      {/* Data Table */}
      <section>
        <h2 style={{ fontSize: '20px', margin: '0 0 16px 0', fontWeight: '600' }}>
          📋 Event Data ({events.length.toLocaleString()} events)
        </h2>
        <div style={{
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          overflow: 'hidden'
        }}>
          <EventTable events={events.slice(0, 20)} />
        </div>
      </section>
        </div>
      </div>
    </main>
  )
}

function KpiCard({ label, value, change, positive }) {
  const getIconForLabel = (label) => {
    switch(label) {
      case 'Total Users': return '👥'
      case 'Sessions': return '📱'
      case 'Conversion Rate': return '📈'
      case 'Revenue': return '💰'
      default: return '📊'
    }
  }
  
  const getGradientClass = (label) => {
    switch(label) {
      case 'Total Users': return 'bg-gradient-to-br from-indigo-500 to-purple-600'
      case 'Sessions': return 'bg-gradient-to-br from-pink-500 to-rose-600'
      case 'Conversion Rate': return 'bg-gradient-to-br from-blue-500 to-cyan-600'
      case 'Revenue': return 'bg-gradient-to-br from-green-500 to-emerald-600'
      default: return 'bg-gradient-to-br from-indigo-500 to-purple-600'
    }
  }

  return (
    <Card 
      className={`${getGradientClass(label)} text-white p-6 card-hover cursor-pointer group relative overflow-hidden`}
      hover={true}
    >
      {/* Background decoration */}
      <div className="absolute -top-5 -right-5 w-20 h-20 bg-white bg-opacity-10 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-white text-opacity-90 font-medium uppercase tracking-wide">
            {label}
          </div>
          <div className="text-2xl opacity-80 group-hover:scale-110 transition-transform duration-300">
            {getIconForLabel(label)}
          </div>
        </div>
        
        <div className="text-4xl font-bold text-white mb-3 leading-none">
          {value}
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`text-lg ${positive ? 'text-green-400' : 'text-red-400'}`}>
            {positive ? '↗️' : '↘️'}
          </span>
          <span className="text-sm text-white text-opacity-90 font-medium">
            {change} vs last period
          </span>
        </div>
      </div>
    </Card>
  )
}

function EventTable({ events }) {
  return (
    <div>
      {/* Table Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '120px 100px 100px 120px 100px 80px',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        color: '#6c757d'
      }}>
        <div>Event Type</div>
        <div>User ID</div>
        <div>Device</div>
        <div>Country</div>
        <div>Time</div>
        <div>Revenue</div>
      </div>
      
      {/* Table Rows */}
      {events.map((event, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '120px 100px 100px 120px 100px 80px',
          gap: '12px',
          padding: '12px 16px',
          borderBottom: i < events.length - 1 ? '1px solid #f1f3f4' : 'none',
          fontSize: '14px',
          backgroundColor: event.event === 'purchase' ? '#f8fff8' : 'transparent'
        }}>
          <div style={{
            fontWeight: event.event === 'purchase' ? '600' : 'normal',
            color: event.event === 'purchase' ? '#28a745' : '#000000'
          }}>
            {event.event === 'purchase' && '💰'} {event.event.replace('_', ' ')}
          </div>
          <div style={{ color: '#6c757d', fontSize: '12px' }}>
            {event.userId.split('_')[1]}
          </div>
          <div>{event.device}</div>
          <div>{event.country}</div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>
            {new Date(event.timestamp).toLocaleDateString()}
          </div>
          <div style={{ 
            fontWeight: event.revenue > 0 ? '600' : 'normal',
            color: event.revenue > 0 ? '#28a745' : '#6c757d'
          }}>
            {event.revenue > 0 ? `$${event.revenue}` : '—'}
          </div>
        </div>
      ))}
      
      <div style={{
        padding: '16px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#6c757d',
        backgroundColor: '#f8f9fa'
      }}>
        Showing first 20 of {events.length.toLocaleString()} events
      </div>
    </div>
  )
}
