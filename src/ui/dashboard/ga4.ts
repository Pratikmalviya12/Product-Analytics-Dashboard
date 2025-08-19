// GA4 Mock Data Generator - Simulates realistic analytics data
// Note: Real GA4 integration requires a backend server due to CORS and security constraints

import { getCountryName } from '../../utils/countryUtils'
import {
  BASE_SESSIONS_MIN,
  BASE_SESSIONS_RANGE,
  USER_SESSION_RATIO_MIN,
  USER_SESSION_RATIO_RANGE,
  PAGEVIEWS_PER_SESSION_MIN,
  PAGEVIEWS_PER_SESSION_RANGE,
  BOUNCE_RATE_MIN,
  BOUNCE_RATE_RANGE,
  SESSION_DURATION_MIN,
  SESSION_DURATION_RANGE,
  CONVERSION_RATE_MIN,
  CONVERSION_RATE_RANGE,
  REVENUE_PER_CONVERSION_MIN,
  REVENUE_PER_CONVERSION_RANGE,
  WEEKEND_TRAFFIC_MULTIPLIER,
  AUTH_DELAY_MIN,
  AUTH_DELAY_RANGE,
  REALTIME_DATA_WINDOW_MINUTES,
  HOURLY_VARIATION_AMPLITUDE,
  RANDOM_VARIATION_MIN,
  RANDOM_VARIATION_RANGE,
  API_DELAY_MIN,
  API_DELAY_RANGE,
  QUICK_API_DELAY_MIN,
  QUICK_API_DELAY_RANGE,
  MIN_REALTIME_EVENTS,
  MAX_REALTIME_EVENTS,
  MS_PER_DAY,
  AUTH_FAILURE_PROBABILITY,
  PURCHASE_PROBABILITY,
  ORGANIC_TRAFFIC_PROBABILITY,
  SOCIAL_TRAFFIC_PROBABILITY,
  MOCK_TOKEN_PREFIX,
  DEFAULT_DATE_RANGE_START,
  DEFAULT_DATE_RANGE_END,
  TODAY_KEYWORD,
  DAYS_AGO_SUFFIX,
  DEFAULT_FALLBACK_DAYS,
  MIN_REVENUE,
  MAX_REVENUE
} from '../../constants'
import { 
  GA4_EVENT_TYPES,
  GA4_REALTIME_EVENT_TYPES,
  DEVICE_TYPES,
  BROWSER_TYPES,
  TRAFFIC_SOURCES
} from '../../constants/events'
import { 
  GA4_SIMULATION_COUNTRIES,
  GA4_REALTIME_COUNTRIES
} from '../../constants/countries'

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
    const baseTraffic = isWeekend ? WEEKEND_TRAFFIC_MULTIPLIER : 1.0
    const hourlyVariation = Math.sin((i / days) * Math.PI * 2) * HOURLY_VARIATION_AMPLITUDE + 1
    const randomVariation = RANDOM_VARIATION_MIN + Math.random() * RANDOM_VARIATION_RANGE
    
    const sessions = Math.floor(baseTraffic * hourlyVariation * randomVariation * (BASE_SESSIONS_MIN + Math.random() * BASE_SESSIONS_RANGE))
    const users = Math.floor(sessions * (USER_SESSION_RATIO_MIN + Math.random() * USER_SESSION_RATIO_RANGE))
    const pageViews = Math.floor(sessions * (PAGEVIEWS_PER_SESSION_MIN + Math.random() * PAGEVIEWS_PER_SESSION_RANGE))
    const bounceRate = BOUNCE_RATE_MIN + Math.random() * BOUNCE_RATE_RANGE
    
    data.push({
      date: date.toISOString().split('T')[0],
      sessions,
      users,
      pageViews,
      bounceRate: Math.round(bounceRate * 100) / 100,
      avgSessionDuration: Math.floor(SESSION_DURATION_MIN + Math.random() * SESSION_DURATION_RANGE),
      conversions: Math.floor(sessions * (CONVERSION_RATE_MIN + Math.random() * CONVERSION_RATE_RANGE)),
      revenue: Math.floor(sessions * (CONVERSION_RATE_MIN + Math.random() * CONVERSION_RATE_RANGE) * (REVENUE_PER_CONVERSION_MIN + Math.random() * REVENUE_PER_CONVERSION_RANGE))
    })
  }
  
  return data
}

// Mock function for getAccessToken
const getAccessToken = async (serviceAccountJson: any): Promise<string> => {
  // Simulate authentication delay
  await new Promise(resolve => setTimeout(resolve, AUTH_DELAY_MIN + Math.random() * AUTH_DELAY_RANGE))
  
  if (!serviceAccountJson || !serviceAccountJson.client_email) {
    throw new Error('Invalid service account configuration')
  }
  
  // Simulate some authentication failures for realism
  if (Math.random() < AUTH_FAILURE_PROBABILITY) {
    throw new Error('Authentication failed: Invalid credentials')
  }
  
  return MOCK_TOKEN_PREFIX + Date.now()
}

// Mock GA4 data fetching with realistic simulation
export const fetchGA4Data = async (propertyId: string, serviceAccountJson: any, dateRange = { start: DEFAULT_DATE_RANGE_START, end: DEFAULT_DATE_RANGE_END }) => {
  try {
    console.log('🔄 Simulating GA4 data fetch...', { propertyId, dateRange })
    
    if (!propertyId || !serviceAccountJson) {
      throw new Error('Property ID and service account are required')
    }

    // Simulate authentication
    const accessToken = await getAccessToken(serviceAccountJson)
    console.log('✅ Mock authentication successful')
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, API_DELAY_MIN + Math.random() * API_DELAY_RANGE))
    
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
  if (start.includes(DAYS_AGO_SUFFIX)) {
    return parseInt(start.replace(DAYS_AGO_SUFFIX, '')) || DEFAULT_FALLBACK_DAYS
  }
  
  const startDate = new Date(start)
  const endDate = end === TODAY_KEYWORD ? new Date() : new Date(end)
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  return Math.ceil(diffTime / MS_PER_DAY)
}

// Convert time series data to event format
const generateEventsFromTimeSeries = (timeSeriesData: any[]): any[] => {
  const events: any[] = []
  const eventTypes = [...GA4_EVENT_TYPES]
  const devices = [...DEVICE_TYPES]
  const countries = [...GA4_SIMULATION_COUNTRIES]
  const browsers = [...BROWSER_TYPES]
  
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
        revenue: Math.random() < PURCHASE_PROBABILITY ? Math.floor(Math.random() * MAX_REVENUE) + MIN_REVENUE : 0,
        properties: {
          page_title: `Page ${Math.floor(Math.random() * 50) + 1}`,
          source: Math.random() < ORGANIC_TRAFFIC_PROBABILITY ? TRAFFIC_SOURCES[0] : TRAFFIC_SOURCES[1],
          medium: Math.random() < SOCIAL_TRAFFIC_PROBABILITY ? TRAFFIC_SOURCES[2] : TRAFFIC_SOURCES[0],
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
    await new Promise(resolve => setTimeout(resolve, QUICK_API_DELAY_MIN + Math.random() * QUICK_API_DELAY_RANGE))
    
    // Generate realistic real-time events (last few minutes)
    const realtimeEvents: any[] = []
    const eventTypes = [...GA4_REALTIME_EVENT_TYPES]
    const devices = [...DEVICE_TYPES]
    const countries = [...GA4_REALTIME_COUNTRIES]
    
    const now = Date.now()
    const eventsCount = Math.floor(Math.random() * (MAX_REALTIME_EVENTS - MIN_REALTIME_EVENTS + 1)) + MIN_REALTIME_EVENTS
    
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
    const country = dimensions[2]?.value || 'United States'
    const date = dimensions[3]?.value || '20250812'

    const eventCount = parseInt(metrics[0]?.value || '1')
    const revenue = parseFloat(metrics[3]?.value || '0')

    for (let i = 0; i < Math.min(eventCount, 10); i++) {
      const timestamp = new Date(
        date.substring(0, 4),
        parseInt(date.substring(4, 6)) - 1,
        date.substring(6, 8)
      ).getTime() + Math.random() * MS_PER_DAY

      events.push({
        id: `ga4_event_${index}_${i}`,
        userId: `ga4_user_${Math.floor(Math.random() * 10000)}`,
        sessionId: `ga4_session_${Math.floor(Math.random() * 5000)}`,
        timestamp,
        event: mapGA4EventName(eventName),
        device: mapGA4Device(device),
        country: getCountryName(country),
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
    const country = dimensions[2]?.value || 'United States'

    const eventCount = parseInt(metrics[1]?.value || '1')

    for (let i = 0; i < Math.min(eventCount, 5); i++) {
      const timestamp = now - Math.random() * REALTIME_DATA_WINDOW_MINUTES * 60 * 1000

      events.push({
        id: `ga4_realtime_${index}_${i}`,
        userId: `ga4_user_${Math.floor(Math.random() * 1000)}`,
        sessionId: `ga4_session_${Math.floor(Math.random() * 500)}`,
        timestamp,
        event: mapGA4EventName(eventName),
        device: mapGA4Device(device),
        country: getCountryName(country),
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