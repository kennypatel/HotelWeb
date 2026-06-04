import clsx from 'clsx'

const variants = {
  green: 'bg-green-500/15 text-green-400 border border-green-500/20',
  red: 'bg-red-500/15 text-red-400 border border-red-500/20',
  yellow: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  purple: 'bg-apollo-purple/15 text-apollo-purple-light border border-apollo-purple/20',
  gray: 'bg-white/5 text-slate-400 border border-white/10',
  orange: 'bg-orange-500/15 text-orange-400 border border-orange-500/20',
}

export default function Badge({ children, variant = 'gray', className }) {
  return (
    <span className={clsx('badge', variants[variant], className)}>
      {children}
    </span>
  )
}
