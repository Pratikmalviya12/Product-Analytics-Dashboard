import React from 'react'
import { Dashboard } from './Dashboard'
import { ErrorBoundary } from './ErrorBoundary'
import { theme } from '../lib/theme'
import { ThemeProvider, useTheme } from '../lib/ThemeContext'

// Export theme for other components to use
export { theme }

const AppContent = () => {
  const { mode, darkThemeVariant } = useTheme()

  // Apply dark class to document root when in dark mode
  React.useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [mode])

  const getBackgroundClass = () => {
    if (mode === 'light') {
      return 'bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700'
    }
    
    switch (darkThemeVariant) {
      case 'slate':
        return 'bg-gradient-dark-slate'
      case 'blue':
        return 'bg-gradient-dark-blue'
      case 'emerald':
        return 'bg-gradient-dark-emerald'
      case 'purple':
        return 'bg-gradient-dark-purple'
      case 'rose':
        return 'bg-gradient-dark-rose'
      case 'orange':
        return 'bg-gradient-dark-orange'
      case 'cyber':
        return 'bg-gradient-dark-cyber'
      default:
        return 'bg-gradient-dark-slate'
    }
  }

  return (
    <div 
      role="application" 
      aria-label="Product Analytics Dashboard"
      className={`min-h-screen ${getBackgroundClass()} font-sans transition-all duration-500`}
    >
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </div>
  )
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
