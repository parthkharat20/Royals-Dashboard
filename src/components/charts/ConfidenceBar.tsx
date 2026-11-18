export function ConfidenceBar({
  lower,
  value,
  upper,
  label,
  baselineValue,
  unit = '',
}: {
  lower: number
  value: number
  upper: number
  label: string
  baselineValue?: number
  unit?: string
}) {
  const minVal = Math.min(lower, baselineValue ?? lower)
  const maxVal = Math.max(upper, baselineValue ?? upper)
  const range = Math.max(maxVal - minVal, 1e-4)

  const toPct = (v: number) => {
    const p = ((v - minVal) / range) * 80 + 10 // pad 10% on both ends
    return Math.max(0, Math.min(100, p))
  }

  const leftPct = toPct(lower)
  const rightPct = toPct(upper)
  const pointPct = toPct(value)
  const basePct = baselineValue !== undefined ? toPct(baselineValue) : null

  return (
    <div className="space-y-1.5 py-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-text-secondary font-medium">{label}</span>
        <span className="font-mono tabular text-text-primary">
          <strong className="text-rr-pink">{value.toFixed(2)}{unit}</strong>
          <span className="text-text-muted ml-1.5">[{lower.toFixed(2)} – {upper.toFixed(2)}]</span>
        </span>
      </div>
      <div className="relative h-5 bg-surface-elevated rounded overflow-hidden border border-border-subtle">
        {/* 95% Confidence Interval band */}
        <div
          className="absolute top-1 bottom-1 bg-rr-pink/25 rounded border-x border-rr-pink/50"
          style={{ left: `${leftPct}%`, width: `${Math.max(2, rightPct - leftPct)}%` }}
          title={`95% CI: ${lower.toFixed(2)} to ${upper.toFixed(2)}`}
        />
        {/* Baseline marker if present */}
        {basePct !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-text-muted/60 z-10"
            style={{ left: `${basePct}%` }}
            title={`Baseline: ${baselineValue?.toFixed(2)}`}
          />
        )}
        {/* Shrunk Point Estimate */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-rr-pink z-20 shadow-[0_0_8px_rgba(232,62,140,0.8)]"
          style={{ left: `${pointPct}%` }}
          title={`Point Estimate: ${value.toFixed(2)}`}
        />
      </div>
      <div className="flex justify-between text-[10px] text-text-muted font-mono">
        <span>Lower: {lower.toFixed(1)}</span>
        {baselineValue !== undefined && <span>Baseline: {baselineValue.toFixed(1)}</span>}
        <span>Upper: {upper.toFixed(1)}</span>
      </div>
    </div>
  )
}
