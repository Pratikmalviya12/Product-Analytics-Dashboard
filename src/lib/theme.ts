// Global theme configuration for consistent design system
export const theme = {
  colors: {
    primary: {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      dark: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
      light: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)'
    },
    text: {
      primary: '#ffffff',
      secondary: '#e5e7eb',
      muted: '#9ca3af',
      dark: '#1f2937'
    },
    background: {
      glass: 'rgba(255, 255, 255, 0.1)',
      glassHover: 'rgba(255, 255, 255, 0.15)',
      overlay: 'rgba(255, 255, 255, 0.05)',
      card: 'rgba(255, 255, 255, 0.9)',
      input: 'rgba(255, 255, 255, 0.9)'
    },
    border: {
      glass: 'rgba(255, 255, 255, 0.2)',
      light: 'rgba(255, 255, 255, 0.3)',
      medium: 'rgba(255, 255, 255, 0.4)',
      dark: 'rgba(255, 255, 255, 0.5)'
    },
    accent: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },
  effects: {
    blur: {
      sm: 'blur(4px)',
      md: 'blur(8px)',
      lg: 'blur(12px)',
      xl: 'blur(16px)'
    },
    shadow: {
      sm: '0 2px 8px rgba(0,0,0,0.1)',
      md: '0 4px 16px rgba(0,0,0,0.1)',
      lg: '0 8px 32px rgba(0,0,0,0.15)',
      xl: '0 16px 64px rgba(0,0,0,0.2)'
    },
    borderRadius: {
      sm: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px'
    }
  },
  animation: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    hover: 'transform 0.2s ease-out',
    focus: 'all 0.2s ease-out'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px'
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  }
}

// Utility function to get theme values
export const getThemeValue = (path: string) => {
  return path.split('.').reduce((obj, key) => obj?.[key], theme)
}

// Common component class combinations
export const themeClasses = {
  glass: 'bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20',
  glassCard: 'bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl shadow-lg',
  button: {
    base: 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:transform hover:-translate-y-0.5',
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white focus:ring-indigo-500 shadow-lg',
    secondary: 'bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 border border-white border-opacity-30 focus:ring-indigo-500 shadow-lg backdrop-blur-md'
  },
  input: 'bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-30 focus:border-indigo-500 focus:ring-indigo-200 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2',
  text: {
    primary: 'text-white font-medium',
    secondary: 'text-gray-200',
    muted: 'text-gray-300'
  }
}
