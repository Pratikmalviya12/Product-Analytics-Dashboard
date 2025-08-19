import React from 'react'
import { Card } from '../../components'

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
        return 'bg-gradient-to-br from-indigo-500 to-purple-600'
      case 'Sessions':
        return 'bg-gradient-to-br from-pink-500 to-rose-600'
      case 'Conversion Rate':
        return 'bg-gradient-to-br from-blue-500 to-cyan-600'
      case 'Revenue':
        return 'bg-gradient-to-br from-green-500 to-emerald-600'
      default:
        return 'bg-gradient-to-br from-indigo-500 to-purple-600'
    }
  }

  return (
    <Card className={`${getGradientClass(label)} text-white p-6 card-hover cursor-pointer group relative overflow-hidden`} hover={true}>
      <div className="absolute -top-5 -right-5 w-20 h-20 bg-white bg-opacity-10 rounded-full group-hover:scale-110 transition-transform duration-300"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-white text-opacity-90 font-medium uppercase tracking-wide">{label}</div>
          <div className="text-2xl opacity-80 group-hover:scale-110 transition-transform duration-300">{getIconForLabel(label)}</div>
        </div>

        <div className="text-4xl font-bold text-white mb-3 leading-none">{value}</div>

        <div className="flex items-center gap-2">
          <span className={`text-lg ${positive ? 'text-green-400' : 'text-red-400'}`}>{positive ? '↗️' : '↘️'}</span>
          <span className="text-sm text-white text-opacity-90 font-medium">{change} vs last period</span>
        </div>
      </div>
    </Card>
  )
} 