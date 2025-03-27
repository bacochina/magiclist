import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  } | null
  color?: string
}

export function StatCard({ title, value, icon, trend, color = 'border-gray-700' }: StatCardProps) {
  return (
    <div className={`bg-gray-800/60 rounded-xl border ${color} p-6 shadow-lg`}>
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-gray-700/50 rounded-full">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <h2 className="text-3xl font-bold text-white">{value}</h2>
          {trend && (
            <p className={`text-sm mt-1 ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 