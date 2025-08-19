/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#667eea',
          600: '#5a6fd8',
          700: '#4f60c4',
          800: '#764ba2',
          900: '#4c1d95',
        },
        accent: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
        light: {
          bg: '#f8fafc',
          surface: '#ffffff',
          card: '#ffffff',
          border: '#e2e8f0',
          text: {
            primary: '#1e293b',
            secondary: '#64748b',
            muted: '#94a3b8',
          }
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
        'gradient-light': 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
        'gradient-light-blue': 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)',
        'gradient-light-indigo': 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%)',
        'gradient-light-purple': 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 50%, #c4b5fd 100%)',
        'gradient-light-emerald': 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)',
        'gradient-light-amber': 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
        'gradient-light-rose': 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)',
        'gradient-light-sky': 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)',
        'gradient-light-slate': 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
        'gradient-dark-slate': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        'gradient-dark-blue': 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
        'gradient-dark-emerald': 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
        'gradient-dark-purple': 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #8b5cf6 100%)',
        'gradient-dark-rose': 'linear-gradient(135deg, #9f1239 0%, #e11d48 50%, #f43f5e 100%)',
        'gradient-dark-orange': 'linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #f97316 100%)',
        'gradient-dark-cyber': 'linear-gradient(135deg, #0c0a1e 0%, #1a0b3d 50%, #2d1b69 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s infinite',
      }
    },
  },
  plugins: [],
}
