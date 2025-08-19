import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  THEME_MODE_STORAGE_KEY,
  DARK_MODE_MEDIA_QUERY
} from '../constants/ui'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem(THEME_MODE_STORAGE_KEY)
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia(DARK_MODE_MEDIA_QUERY).matches) {
      return 'dark'
    }
    
    return 'light'
  })

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem(THEME_MODE_STORAGE_KEY, mode)
  }, [mode])

  // Apply theme class to document
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [mode])

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light')
  }

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode)
  }

  const contextValue: ThemeContextType = {
    mode,
    toggleTheme,
    setTheme
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}
