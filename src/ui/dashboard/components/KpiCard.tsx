import React from 'react'
import { Card } from '../../components'

/**
 * KPI Card Component
 * 
 * @description A visually appealing card component for displaying Key Performance Indicators (KPIs)
 * with gradient backgrounds, icons, and change indicators. Each KPI type has its own color scheme
 * and corresponding emoji icon.
 * 
 * @param {Object} props - Component properties
 * @param {string} props.label - The KPI label/name (e.g., "Total Users", "Revenue")
 * @param {string|number} props.value - The current KPI value to display
 * @param {string} props.change - The change percentage from previous period (e.g., "+12.3%")
 * @param {boolean} props.positive - Whether the change is positive (affects color and arrow direction)
 * 
 * @features
 * - Unique gradient backgrounds for each KPI type
 * - Contextual emoji icons based on KPI label
 * - Positive/negative change indicators with arrows
 * - Hover animations with scale effects
 * - Responsive text sizing and spacing
 * - Dark/light theme support
 * - Decorative background elements
 * 
 * @kpiTypes
 * - Total Users: Purple gradient with 👥 icon
 * - Sessions: Pink gradient with 📱 icon  
 * - Conversion Rate: Blue gradient with 📈 icon
 * - Revenue: Green gradient with 💰 icon
 * 
 * @example
 * ```tsx
 * <KpiCard 
 *   label="Total Users" 
 *   value="1,234" 
 *   change="+12.3%" 
 *   positive={true} 
 * />
 * ```
 */
export function KpiCard({ label, value, change, positive }: { label: string; value: string | number; change: string; positive: boolean }) {
  const getIconForLabel = (label: string) => {
    switch (label) {
      case 'Total Users':
        return '👥'
      case 'Sessions':
        return '📱'
      case 'Conversion Rate':
        return '📈'
      case 'Revenue':
        return '💰'
      default:
        return '📊'
    }
  }

  const getGradientClass = (label: string) => {
    switch (label) {
      case 'Total Users':
        return 'bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500'
      case 'Sessions':
        return 'bg-gradient-to-br from-pink-500 to-rose-600 dark:from-pink-400 dark:to-rose-500'
      case 'Conversion Rate':
        return 'bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-400 dark:to-cyan-500'
      case 'Revenue':
        return 'bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500'
      default:
        return 'bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500'
    }
  }

  return (
    <Card className={`${getGradientClass(label)} text-white dark:text-gray-100 p-6 card-hover cursor-pointer group relative overflow-hidden shadow-lg hover:shadow-xl border border-white/20 dark:border-gray-600/30`} hover={true}>
      <div className="absolute -top-5 -right-5 w-20 h-20 bg-white/20 dark:bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-white/95 dark:text-gray-200 font-medium uppercase tracking-wide">{label}</div>
          <div className="text-2xl opacity-90 group-hover:scale-110 transition-transform duration-300">{getIconForLabel(label)}</div>
        </div>

        <div className="text-4xl font-bold text-white dark:text-gray-100 mb-3 leading-none drop-shadow-sm">{value}</div>

        <div className="flex items-center gap-2">
          <span className={`text-lg ${positive ? 'text-green-200 dark:text-green-300' : 'text-red-200 dark:text-red-300'}`}>{positive ? '↗️' : '↘️'}</span>
          <span className="text-sm text-white/95 dark:text-gray-200 font-medium">{change} vs last period</span>
        </div>
      </div>
    </Card>
  )
} 