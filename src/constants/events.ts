// ===========================================================================
// EVENT AND DATA GENERATION CONSTANTS
// ===========================================================================

export const EVENT_TYPES = ['page_view', 'click', 'signup', 'purchase'] as const

// Extended event types for GA4 simulation
export const GA4_EVENT_TYPES = ['page_view', 'click', 'scroll', 'search', 'purchase', 'signup'] as const

// GA4 realtime event types (subset)
export const GA4_REALTIME_EVENT_TYPES = ['page_view', 'click', 'scroll', 'search', 'purchase'] as const

export const DEVICE_TYPES = ['desktop', 'mobile', 'tablet'] as const

// Browser types for simulation
export const BROWSER_TYPES = ['Chrome', 'Safari', 'Firefox', 'Edge'] as const

// Traffic sources for simulation
export const TRAFFIC_SOURCES = ['organic', 'direct', 'social'] as const

export const PAGE_URLS = [
  '/home', 
  '/product', 
  '/checkout', 
  '/about', 
  '/contact', 
  '/blog', 
  '/pricing', 
  '/login',
  '/docs',
  '/signup'
] as const

// Data generation settings
export const DEFAULT_SEED = 42
export const DEFAULT_DAYS = 30
export const DEFAULT_EVENT_COUNT = 1000
export const MAX_DAYS_BACK = 30
export const MIN_REVENUE = 10
export const MAX_REVENUE = 500

// Validation constants
export const MIN_SEED_VALUE = 1
export const MAX_SEED_VALUE = 999999
export const MIN_EVENT_COUNT = 100
export const MAX_EVENT_COUNT = 1000000
export const MIN_DAYS = 1
export const MAX_DAYS = 365
