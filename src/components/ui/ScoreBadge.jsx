import clsx from 'clsx'

export default function ScoreBadge({ score }) {
  const color = score >= 90 ? 'text-green-400' : score >= 70 ? 'text-yellow-400' : 'text-red-400'
  const bg = score >= 90 ? 'bg-green-500/10' : score >= 70 ? 'bg-yellow-500/10' : 'bg-red-500/10'
  return (
    <div className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold', color, bg)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', score >= 90 ? 'bg-green-400' : score >= 70 ? 'bg-yellow-400' : 'bg-red-400')} />
      {score}
    </div>
  )
}
