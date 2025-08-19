import React from 'react'
import { Dashboard } from './Dashboard'
import { ErrorBoundary } from './ErrorBoundary'
import { theme } from '../lib/theme'
import { ThemeProvider, useTheme } from '../lib/ThemeContext'

// Export theme for other components to use
export { theme }

const AppContent = () => {
  const { mode } = useTheme()

  // Apply dark class to document root when in dark mode
  React.useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [mode])

  const getBackgroundClass = () => {
    return mode === 'light' 
      ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700'
      : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
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
