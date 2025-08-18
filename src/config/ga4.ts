// GA4 Configuration
// Replace these values with your actual GA4 property details

export const GA4_CONFIG = {
  // Your GA4 Measurement ID (from Google Analytics dashboard)
  // Format: G-XXXXXXXXXX
  MEASUREMENT_ID: import.meta.env.VITE_GA4_MEASUREMENT_ID || 'GA_MEASUREMENT_ID',
  
  // Your GA4 Property ID (for Data API access)
  // Format: properties/123456789
  PROPERTY_ID: import.meta.env.VITE_GA4_PROPERTY_ID || '',
  
  // Configuration options
  CONFIG: {
    // Enable enhanced measurement for automatic tracking
    enhanced_measurement: true,
    
    // Privacy and compliance settings
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    
    // Custom parameters
    custom_map: {
      'custom_parameter_1': 'dashboard_version',
      'custom_parameter_2': 'user_segment'
    },
    
    // Enable debug mode in development
    debug_mode: import.meta.env.DEV,
    
    // Send page view automatically
    send_page_view: true
  },
  
  // Data API configuration for backend access
  DATA_API: {
    // Your service account key file (for server-side access)
    SERVICE_ACCOUNT_KEY_PATH: './ga4-service-account.json',
    
    // Scopes required for GA4 Data API
    SCOPES: ['https://www.googleapis.com/auth/analytics.readonly'],
    
    // Default date ranges for data fetching
    DEFAULT_DATE_RANGES: {
      last7Days: { start: '7daysAgo', end: 'today' },
      last30Days: { start: '30daysAgo', end: 'today' },
      last90Days: { start: '90daysAgo', end: 'today' },
      lastMonth: { start: '1monthAgo', end: 'today' },
      thisYear: { start: '2024-01-01', end: 'today' }
    },
    
    // Common dimensions to fetch
    DIMENSIONS: [
      'eventName',
      'deviceCategory',
      'country',
      'date',
      'hour',
      'pagePath',
      'source',
      'medium',
      'campaign'
    ],
    
    // Common metrics to fetch
    METRICS: [
      'eventCount',
      'totalUsers',
      'sessions',
      'bounceRate',
      'sessionDuration',
      'totalRevenue',
      'purchaseRevenue',
      'itemRevenue'
    ]
  },
  
  // Custom events for your dashboard
  CUSTOM_EVENTS: {
    // Dashboard-specific events
    DASHBOARD_VIEW: 'dashboard_view',
    FILTER_APPLIED: 'filter_applied',
    DATA_EXPORTED: 'data_exported',
    CHART_INTERACTION: 'chart_interaction',
    SAVED_VIEW_CREATED: 'saved_view_created',
    SAVED_VIEW_LOADED: 'saved_view_loaded',
    
    // GA4 integration events
    GA4_CONNECTED: 'ga4_connected',
    GA4_DATA_FETCHED: 'ga4_data_fetched',
    REALTIME_ENABLED: 'realtime_enabled',
    
    // User engagement events
    THEME_CHANGED: 'theme_changed',
    SETTINGS_CHANGED: 'settings_changed',
    HELP_VIEWED: 'help_viewed',
    
    // Error tracking events
    API_ERROR: 'api_error',
    DATA_LOAD_ERROR: 'data_load_error',
    AUTHENTICATION_ERROR: 'authentication_error'
  },
  
  // Custom dimensions for enhanced tracking
  CUSTOM_DIMENSIONS: {
    USER_SEGMENT: 'user_segment',
    DASHBOARD_VERSION: 'dashboard_version',
    DATA_SOURCE: 'data_source',
    FILTER_COUNT: 'filter_count',
    CHART_TYPE: 'chart_type'
  },
  
  // Enhanced ecommerce parameters (if tracking purchases/revenue)
  ECOMMERCE: {
    CURRENCY: 'USD',
    PURCHASE_EVENTS: ['purchase', 'refund'],
    VALUE_PARAMETERS: ['value', 'revenue', 'purchase_revenue']
  }
};

// Utility function to check if GA4 is properly configured
export const isGA4Configured = (): boolean => {
  return GA4_CONFIG.MEASUREMENT_ID !== 'GA_MEASUREMENT_ID' && 
         GA4_CONFIG.MEASUREMENT_ID.startsWith('G-');
};

// Utility function to get current environment
export const getEnvironment = (): 'development' | 'production' => {
  return import.meta.env.DEV ? 'development' : 'production';
};

export default GA4_CONFIG;
