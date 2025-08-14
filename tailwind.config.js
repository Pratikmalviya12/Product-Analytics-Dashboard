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
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
        'gradient-light': 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
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
