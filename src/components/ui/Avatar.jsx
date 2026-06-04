import clsx from 'clsx'

const colors = [
  'from-purple-500 to-indigo-600',
  'from-blue-500 to-cyan-600',
  'from-green-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-rose-600',
  'from-yellow-500 to-orange-600',
]

function getColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export default function Avatar({ initials, size = 'md', className }) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  }
  return (
    <div className={clsx(
      `rounded-full bg-gradient-to-br ${getColor(initials)} flex items-center justify-center font-semibold text-white shrink-0`,
      sizeClasses[size],
      className
    )}>
      {initials}
    </div>
  )
}
