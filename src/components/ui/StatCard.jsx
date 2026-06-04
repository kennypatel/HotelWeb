import clsx from 'clsx'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ label, value, change, changeLabel, icon: Icon, color = 'purple' }) {
  const colorMap = {
    purple: 'bg-apollo-purple/10 text-apollo-purple-light',
    green: 'bg-green-500/10 text-green-400',
    blue: 'bg-blue-500/10 text-blue-400',
    orange: 'bg-orange-500/10 text-orange-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
  }
  const isPositive = change >= 0

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
        {Icon && (
          <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', colorMap[color])}>
            <Icon size={15} />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {change !== undefined && (
        <div className="flex items-center gap-1">
          {isPositive ? (
            <TrendingUp size={12} className="text-green-400" />
          ) : (
            <TrendingDown size={12} className="text-red-400" />
          )}
          <span className={clsx('text-xs font-medium', isPositive ? 'text-green-400' : 'text-red-400')}>
            {isPositive ? '+' : ''}{change}%
          </span>
          {changeLabel && <span className="text-xs text-slate-500">{changeLabel}</span>}
        </div>
      )}
    </div>
  )
}
