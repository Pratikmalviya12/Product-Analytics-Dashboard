// GA4 Mock Data Generator - Simulates realistic analytics data
// Note: Real GA4 integration requires a backend server due to CORS and security constraints

export const GA4_API_BASE = 'https://analyticsdata.googleapis.com/v1beta'

// Generate realistic GA4-style mock data
const generateRealisticTimeSeries = (days: number = 30) => {
  const data = []
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - days)
  
  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)
    
    // Simulate realistic patterns
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const baseTraffic = isWeekend ? 0.6 : 1.0
    const hourlyVariation = Math.sin((i / days) * Math.PI * 2) * 0.3 + 1
    const randomVariation = 0.8 + Math.random() * 0.4
    
    const sessions = Math.floor(baseTraffic * hourlyVariation * randomVariation * (500 + Math.random() * 200))
    const users = Math.floor(sessions * (0.7 + Math.random() * 0.2))
    const pageViews = Math.floor(sessions * (2 + Math.random() * 3))
    const bounceRate = 0.3 + Math.random() * 0.4
    
    data.push({
      date: date.toISOString().split('T')[0],
      sessions,
      users,
      pageViews,
      bounceRate: Math.round(bounceRate * 100) / 100,
      avgSessionDuration: Math.floor(120 + Math.random() * 300),
      conversions: Math.floor(sessions * (0.02 + Math.random() * 0.03)),
      revenue: Math.floor(sessions * (0.02 + Math.random() * 0.03) * (50 + Math.random() * 200))
    })
  }
  
  return data
}

// Simulate GA4 authentication check (mock)
export const getAccessToken = async (serviceAccountJson: any) => {
  // Simulate authentication delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
  
  if (!serviceAccountJson || !serviceAccountJson.client_email) {
    throw new Error('Invalid service account configuration')
  }
  
  // Simulate some authentication failures for realism
  if (Math.random() < 0.1) {
    throw new Error('Authentication failed: Invalid credentials')
  }
  
  return 'mock_access_token_' + Date.now()
}

// Mock GA4 data fetching with realistic simulation
export const fetchGA4Data = async (propertyId: string, serviceAccountJson: any, dateRange = { start: '30daysAgo', end: 'today' }) => {
  try {
    console.log('🔄 Simulating GA4 data fetch...', { propertyId, dateRange })
    
    if (!propertyId || !serviceAccountJson) {
      throw new Error('Property ID and service account are required')
    }

    // Simulate authentication
    const accessToken = await getAccessToken(serviceAccountJson)
    console.log('✅ Mock authentication successful')
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))
    
    // Generate realistic mock data
    const days = calculateDaysBetween(dateRange.start, dateRange.end)
    const timeSeriesData = generateRealisticTimeSeries(days)
    
    // Convert to event format expected by the dashboard
    const events = generateEventsFromTimeSeries(timeSeriesData)
    
    console.log(`✅ Generated ${events.length} mock GA4 events for ${days} days`)
    return events
    
  } catch (error) {
    console.error('❌ GA4 data fetch failed:', error)
    throw error
  }
}

// Helper function to calculate days between dates
const calculateDaysBetween = (start: string, end: string) => {
  if (start.includes('daysAgo')) {
    return parseInt(start.replace('daysAgo', '')) || 30
  }
  
  const startDate = new Date(start)
  const endDate = end === 'today' ? new Date() : new Date(end)
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Convert time series data to event format
const generateEventsFromTimeSeries = (timeSeriesData: any[]): any[] => {
  const events: any[] = []
  const eventTypes = ['page_view', 'click', 'scroll', 'search', 'purchase', 'signup']
  const devices = ['desktop', 'mobile', 'tablet']
  const countries = ['US', 'GB', 'CA', 'DE', 'FR', 'AU', 'JP', 'IN', 'BR', 'MX']
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge']
  
  timeSeriesData.forEach((dayData, dayIndex) => {
    const date = new Date(dayData.date)
    
    // Generate events for this day
    for (let i = 0; i < dayData.sessions; i++) {
      const eventTime = new Date(date)
      eventTime.setHours(Math.floor(Math.random() * 24))
      eventTime.setMinutes(Math.floor(Math.random() * 60))
      
      events.push({
        id: `ga4_${Date.now()}_${i}_${dayIndex}`,
        timestamp: eventTime.getTime(),
        event: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)], // Keep both for compatibility
        userId: `user_${Math.floor(Math.random() * 10000)}`,
        sessionId: `session_${Date.now()}_${i}`,
        device: devices[Math.floor(Math.random() * devices.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        revenue: Math.random() < 0.05 ? Math.floor(Math.random() * 500) + 10 : 0,
        properties: {
          page_title: `Page ${Math.floor(Math.random() * 50) + 1}`,
          source: Math.random() < 0.5 ? 'organic' : 'direct',
          medium: Math.random() < 0.3 ? 'social' : 'organic',
          campaign: Math.random() < 0.2 ? `campaign_${Math.floor(Math.random() * 10)}` : null,
          ga4_session_id: `ga4_session_${Date.now()}_${i}`,
          engagement_time_msec: Math.floor(Math.random() * 300000) + 1000
        }
      })
    }
  })
  
  return events.sort((a, b) => b.timestamp - a.timestamp)
}

// Mock GA4 real-time data fetching
export const fetchGA4RealtimeData = async (propertyId: string, serviceAccountJson: any): Promise<any[]> => {
  try {
    console.log('🔄 Simulating GA4 real-time data fetch...')
    
    if (!propertyId || !serviceAccountJson) {
      throw new Error('Property ID and service account are required')
    }

    // Simulate authentication
    await getAccessToken(serviceAccountJson)
    
    // Simulate API delay for real-time data (shorter)
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
    
    // Generate realistic real-time events (last few minutes)
    const realtimeEvents: any[] = []
    const eventTypes = ['page_view', 'click', 'scroll', 'search', 'purchase']
    const devices = ['desktop', 'mobile', 'tablet']
    const countries = ['US', 'GB', 'CA', 'DE', 'FR', 'AU', 'JP', 'IN']
    
    const now = Date.now()
    const eventsCount = Math.floor(Math.random() * 10) + 2 // 2-12 events
    
    for (let i = 0; i < eventsCount; i++) {
      const timestamp = now - Math.floor(Math.random() * 300000) // Last 5 minutes
      
      realtimeEvents.push({
        id: `realtime_${timestamp}_${i}`,
        timestamp,
        event: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)], // Keep both for compatibility
        userId: `user_${Math.floor(Math.random() * 1000)}`,
        sessionId: `session_${timestamp}_${i}`,
        device: devices[Math.floor(Math.random() * devices.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        revenue: Math.random() < 0.1 ? Math.floor(Math.random() * 200) + 10 : 0,
        properties: {
          page_title: `Page ${Math.floor(Math.random() * 20) + 1}`,
          source: Math.random() < 0.6 ? 'organic' : 'direct',
          is_realtime: true,
          active_users: Math.floor(Math.random() * 50) + 10
        }
      })
    }
    
    console.log(`✅ Generated ${realtimeEvents.length} real-time mock events`)
    return realtimeEvents.sort((a, b) => b.timestamp - a.timestamp)
    
  } catch (error) {
    console.error('❌ GA4 real-time data fetch failed:', error)
    return []
  }
}

// Legacy transformation functions (kept for compatibility)
export const transformGA4Response = (ga4Data: any) => {
  const events: any[] = []
  if (!ga4Data.rows) return events

  ga4Data.rows.forEach((row: any, index: number) => {
    const dimensions = row.dimensionValues || []
    const metrics = row.metricValues || []

    const eventName = dimensions[0]?.value || 'unknown'
    const device = dimensions[1]?.value || 'desktop'
    const country = dimensions[2]?.value || 'US'
    const date = dimensions[3]?.value || '20250812'

    const eventCount = parseInt(metrics[0]?.value || '1')
    const revenue = parseFloat(metrics[3]?.value || '0')

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
        revenue: eventName === 'purchase' ? revenue / eventCount : 0,
      })
    }
  })

  return events.sort((a, b) => b.timestamp - a.timestamp)
}

export const transformGA4RealtimeResponse = (ga4Data: any) => {
  const events: any[] = []
  if (!ga4Data.rows) return events

  const now = Date.now()

  ga4Data.rows.forEach((row: any, index: number) => {
    const dimensions = row.dimensionValues || []
    const metrics = row.metricValues || []

    const eventName = dimensions[0]?.value || 'unknown'
    const device = dimensions[1]?.value || 'desktop'
    const country = dimensions[2]?.value || 'US'

    const eventCount = parseInt(metrics[1]?.value || '1')

    for (let i = 0; i < Math.min(eventCount, 5); i++) {
      const timestamp = now - Math.random() * 30 * 60 * 1000

      events.push({
        id: `ga4_realtime_${index}_${i}`,
        userId: `ga4_user_${Math.floor(Math.random() * 1000)}`,
        sessionId: `ga4_session_${Math.floor(Math.random() * 500)}`,
        timestamp,
        event: mapGA4EventName(eventName),
        device: mapGA4Device(device),
        country: country.substring(0, 2).toUpperCase(),
        revenue: eventName === 'purchase' ? Math.random() * 200 + 10 : 0,
      })
    }
  })

  return events.sort((a, b) => b.timestamp - a.timestamp)
}

export const mapGA4EventName = (ga4Event: string) => {
  const mapping: Record<string, string> = {
    page_view: 'page_view',
    click: 'click',
    sign_up: 'signup',
    purchase: 'purchase',
    login: 'signup',
    scroll: 'click',
    view_item: 'page_view',
    add_to_cart: 'click',
  }
  return mapping[ga4Event] || 'page_view'
}

export const mapGA4Device = (ga4Device: string) => {
  const mapping: Record<string, string> = {
    desktop: 'desktop',
    mobile: 'mobile',
    tablet: 'tablet',
  }
  return mapping[ga4Device.toLowerCase()] || 'desktop'
}