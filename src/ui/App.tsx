import React from 'react'
import { Dashboard } from './Dashboard'
import { theme } from '../lib/theme'

// Export theme for other components to use
export { theme }

export function App() {
  console.log('App component rendering...')
  
  return (
    <div 
      role="application" 
      aria-label="Product Analytics Dashboard"
      className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 font-sans"
    >
      <Dashboard />
    </div>
  )
}
