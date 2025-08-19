// ===========================================================================
// UI AND THEME CONSTANTS
// ===========================================================================

export const THEME_MODES = ['light', 'dark'] as const

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#ef4444', 
  success: '#10b981',
  warning: '#f59e0b',
  info: '#8b5cf6',
  neutral: '#6b7280'
} as const

export const DEVICE_COLORS = {
  desktop: '#8884d8',
  mobile: '#82ca9d', 
  tablet: '#ffc658'
} as const

// Pagination constants
export const ITEMS_PER_PAGE = 10
export const PAGINATION_SIZES = [10, 25, 50, 100]
export const MAX_VISIBLE_PAGES = 5
export const TABLE_PAGE_SIZES = [20, 50, 100, 200, 500, 1000] as const
export const DEFAULT_PAGE_SIZE = 50

// Chart display constants
export const CHART_DAYS_DEFAULT = 14
export const MS_PER_DAY = 24 * 60 * 60 * 1000
export const CHART_SVG_WIDTH = 800
export const CHART_SVG_HEIGHT = 300
export const CHART_MARGIN_LEFT = 60
export const CHART_BAR_WIDTH = 48
export const CHART_BAR_SPACING = 5
export const CHART_MAX_HEIGHT = 180
export const CHART_BASE_Y = 240

// Format constants
export const CURRENCY_SYMBOL = '$'
export const CURRENCY_LOCALE = 'en-US'
export const DATE_FORMAT = 'MMM dd, HH:mm:ss'

// Theme variant constants
export const DARK_THEME_VARIANTS = ['slate', 'blue', 'emerald', 'purple', 'rose', 'orange', 'cyber'] as const
export type DarkThemeVariant = typeof DARK_THEME_VARIANTS[number]

// LocalStorage keys
export const THEME_MODE_STORAGE_KEY = 'theme-mode'
export const DARK_THEME_VARIANT_STORAGE_KEY = 'dark-theme-variant'
export const DEFAULT_DARK_THEME_VARIANT = 'slate'

// System theme detection
export const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)'
