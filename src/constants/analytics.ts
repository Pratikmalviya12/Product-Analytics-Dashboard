// ===========================================================================
// GA4 ANALYTICS CONSTANTS
// ===========================================================================

export const GA4_API_BASE = 'https://analyticsdata.googleapis.com/v1beta'

export const DEFAULT_GA4_PROPERTY_ID = ''

export const GA4_DIMENSIONS = [
  'eventName',
  'deviceCategory',
  'country',
  'date',
  'hour',
  'pagePath',
  'source',
  'medium',
  'campaign'
] as const

export const GA4_METRICS = [
  'eventCount',
  'totalUsers',
  'sessions',
  'bounceRate',
  'sessionDuration',
  'totalRevenue',
  'purchaseRevenue',
  'itemRevenue'
] as const

// GA4 Data simulation constants
export const BASE_SESSIONS_MIN = 500
export const BASE_SESSIONS_RANGE = 200
export const USER_SESSION_RATIO_MIN = 0.7
export const USER_SESSION_RATIO_RANGE = 0.2
export const PAGEVIEWS_PER_SESSION_MIN = 2
export const PAGEVIEWS_PER_SESSION_RANGE = 3
export const BOUNCE_RATE_MIN = 0.3
export const BOUNCE_RATE_RANGE = 0.4
export const SESSION_DURATION_MIN = 120
export const SESSION_DURATION_RANGE = 300
export const CONVERSION_RATE_MIN = 0.02
export const CONVERSION_RATE_RANGE = 0.03
export const REVENUE_PER_CONVERSION_MIN = 50
export const REVENUE_PER_CONVERSION_RANGE = 200
export const WEEKEND_TRAFFIC_MULTIPLIER = 0.6
export const AUTH_DELAY_MIN = 1000
export const AUTH_DELAY_RANGE = 1000
export const REALTIME_DATA_WINDOW_MINUTES = 30

// Data variation constants for realistic simulation
export const HOURLY_VARIATION_AMPLITUDE = 0.3
export const RANDOM_VARIATION_MIN = 0.8
export const RANDOM_VARIATION_RANGE = 0.4
export const API_DELAY_MIN = 800
export const API_DELAY_RANGE = 1200
export const QUICK_API_DELAY_MIN = 200
export const QUICK_API_DELAY_RANGE = 300
export const MIN_REALTIME_EVENTS = 2
export const MAX_REALTIME_EVENTS = 12

// Probability constants for data simulation
export const AUTH_FAILURE_PROBABILITY = 0.1
export const PURCHASE_PROBABILITY = 0.05
export const ORGANIC_TRAFFIC_PROBABILITY = 0.5
export const SOCIAL_TRAFFIC_PROBABILITY = 0.3

// Mock token and string constants
export const MOCK_TOKEN_PREFIX = 'mock_access_token_'
export const DEFAULT_DATE_RANGE_START = '30daysAgo'
export const DEFAULT_DATE_RANGE_END = 'today'
export const TODAY_KEYWORD = 'today'
export const DAYS_AGO_SUFFIX = 'daysAgo'
export const DEFAULT_FALLBACK_DAYS = 30

// Date ranges for GA4 queries
export const DATE_RANGES = {
  last7Days: { start: '7daysAgo', end: 'today' },
  last30Days: { start: '30daysAgo', end: 'today' },
  last90Days: { start: '90daysAgo', end: 'today' },
  lastMonth: { start: '1monthAgo', end: 'today' },
  thisYear: { start: '2024-01-01', end: 'today' }
} as const
