import { motion } from 'framer-motion'

export function PressureGauge({
  value,
  max = 100,
  size = 130,
  label,
}: {
  value: number
  max?: number
  size?: number
  label?: string
}) {
  const safeVal = Math.max(0, Math.min(value, max))
  const pct = safeVal / max
  const strokeWidth = 9
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  // 270 degree arc (0.75 of circle)
  const arcLength = circumference * 0.75
  const strokeDashoffset = arcLength * (1 - pct)

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-[135deg]">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#E83E8C" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Filled Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-mono text-stat font-bold text-text-primary tabular leading-none">
          {safeVal.toFixed(1)}
        </span>
        {label && (
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
