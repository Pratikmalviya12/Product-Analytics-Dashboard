import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  DARK_THEME_VARIANTS, 
  DarkThemeVariant,
  THEME_MODE_STORAGE_KEY,
  DARK_THEME_VARIANT_STORAGE_KEY,
  DEFAULT_DARK_THEME_VARIANT,
  DARK_MODE_MEDIA_QUERY
} from '../constants/ui'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  darkThemeVariant: DarkThemeVariant
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
  setDarkThemeVariant: (variant: DarkThemeVariant) => void
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
    const savedTheme = localStorage.getItem('theme-mode')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia(DARK_MODE_MEDIA_QUERY).matches) {
      return 'dark'
    }
    
    return 'light'
  })

  const [darkThemeVariant, setDarkThemeVariant] = useState<DarkThemeVariant>(() => {
    const savedVariant = localStorage.getItem(DARK_THEME_VARIANT_STORAGE_KEY)
    if (savedVariant && DARK_THEME_VARIANTS.includes(savedVariant as DarkThemeVariant)) {
      return savedVariant as DarkThemeVariant
    }
    return DEFAULT_DARK_THEME_VARIANT
  })

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem(THEME_MODE_STORAGE_KEY, mode)
  }, [mode])

  // Update localStorage when dark theme variant changes
  useEffect(() => {
    localStorage.setItem(DARK_THEME_VARIANT_STORAGE_KEY, darkThemeVariant)
  }, [darkThemeVariant])

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
    darkThemeVariant,
    toggleTheme,
    setTheme,
    setDarkThemeVariant
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}
