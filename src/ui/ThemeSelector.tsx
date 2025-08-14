import React from 'react'
import { useTheme } from '../lib/ThemeContext'
import { Card, Button } from '../components/components'

type DarkThemeVariant = 'slate' | 'blue' | 'emerald' | 'purple' | 'rose' | 'orange' | 'cyber'

export const ThemeSelector = () => {
  const { mode, setTheme, darkThemeVariant, setDarkThemeVariant } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)
  
  const darkThemes = [
    { 
      id: 'slate', 
      name: 'Slate Dark', 
      gradient: 'bg-gradient-dark',
      preview: 'from-slate-800 to-slate-700',
      description: 'Clean and modern slate theme'
    },
    { 
      id: 'blue', 
      name: 'Ocean Blue', 
      gradient: 'bg-gradient-dark-blue',
      preview: 'from-blue-800 to-purple-800',
      description: 'Deep ocean blue theme'
    },
    { 
      id: 'emerald', 
      name: 'Forest Green', 
      gradient: 'bg-gradient-dark-emerald',
      preview: 'from-emerald-800 to-emerald-700',
      description: 'Nature-inspired emerald theme'
    },
    { 
      id: 'purple', 
      name: 'Royal Purple', 
      gradient: 'bg-gradient-dark-purple',
      preview: 'from-purple-800 to-violet-800',
      description: 'Rich and vibrant purple theme'
    },
    { 
      id: 'rose', 
      name: 'Rose Gold', 
      gradient: 'bg-gradient-dark-rose',
      preview: 'from-rose-800 to-pink-800',
      description: 'Elegant rose gold theme'
    },
    { 
      id: 'orange', 
      name: 'Sunset Orange', 
      gradient: 'bg-gradient-dark-orange',
      preview: 'from-orange-800 to-red-700',
      description: 'Warm sunset orange theme'
    },
    { 
      id: 'cyber', 
      name: 'Cyberpunk', 
      gradient: 'bg-gradient-dark-cyber',
      preview: 'from-slate-900 via-cyan-900 to-slate-900',
      description: 'Futuristic cyberpunk theme'
    }
  ]
  
  const currentDarkTheme = darkThemes.find(t => t.id === darkThemeVariant) || darkThemes[0]
  
  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        size="small"
        className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700 shadow-md"
      >
        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${currentDarkTheme.preview}`}></div>
        Themes
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 z-50">
          <Card className="w-96 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Choose Theme</h3>
            
            {/* Light/Dark Toggle */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button
                  onClick={() => setTheme('light')}
                  variant={mode === 'light' ? 'primary' : 'secondary'}
                  size="small"
                  className="w-full"
                >
                  ☀️ Light
                </Button>
                <Button
                  onClick={() => setTheme('dark')}
                  variant={mode === 'dark' ? 'primary' : 'secondary'}
                  size="small"
                  className="w-full"
                >
                  🌙 Dark
                </Button>
              </div>
            </div>
            
            {/* Dark Theme Variants */}
            {mode === 'dark' && (
              <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Dark Theme Style:</h4>
                <div className="space-y-2">
                  {darkThemes.map((darkTheme) => (
                    <button
                      key={darkTheme.id}
                      onClick={() => setDarkThemeVariant(darkTheme.id as DarkThemeVariant)}
                      className={`w-full p-3 rounded-lg border-2 transition-all hover:scale-[1.02] ${
                        darkThemeVariant === darkTheme.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${darkTheme.preview} shadow-md`}></div>
                      <div className="text-left flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{darkTheme.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{darkTheme.description}</div>
                      </div>
                      {darkThemeVariant === darkTheme.id && (
                        <div className="w-5 h-5 text-purple-600 dark:text-purple-400">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={() => setIsOpen(false)}
                variant="secondary"
                size="small"
                className="w-full"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
