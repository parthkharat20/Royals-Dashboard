export const fmt = {
  pri: (v?: number | null) => (v != null ? Number(v).toFixed(1) : '—'),

  pct: (v?: number | null) => {
    if (v == null) return '—'
    let num = Number(v)
    if (isNaN(num)) return '—'
    if (num > 0 && num <= 1.0) {
      num = num * 100
    }
    return `${num.toFixed(1)}%`
  },

  sr: (v?: number | null) => (v != null ? Number(v).toFixed(2) : '—'),

  econ: (v?: number | null) => (v != null ? Number(v).toFixed(2) : '—'),

  lift: (v?: number | null) => {
    if (v == null) return '—'
    let num = Number(v)
    if (isNaN(num)) return '—'
    // If value is stored as a multiplier ratio (e.g. 1.309 or 1.250), convert to percentage delta
    if (num > 0.1 && num < 3.5) {
      num = (num - 1) * 100
    }
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`
  },

  money: (v?: number | null) => (v != null ? `₹${Number(v).toFixed(1)} Cr` : '—'),

  big: (v?: number | null) => {
    if (v == null) return '—'
    const num = Number(v)
    if (isNaN(num)) return '—'
    return num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toLocaleString()
  },

  rank: (v?: number | null) => (v != null ? `#${v}` : '—'),

  /** Converts legal balls to standard cricket overs notation (e.g. 133 balls -> 22.1 ov) */
  cricketOvers: (balls?: number | null, decimalOvers?: number | null) => {
    if (balls != null && !isNaN(balls)) {
      const full = Math.floor(balls / 6)
      const rem = balls % 6
      return `${full}.${rem} ov`
    }
    if (decimalOvers != null && !isNaN(decimalOvers)) {
      const totalBalls = Math.round(decimalOvers * 6)
      const full = Math.floor(totalBalls / 6)
      const rem = totalBalls % 6
      return `${full}.${rem} ov`
    }
    return '—'
  },

  /** Formats overs alongside total legal balls (e.g. "22.1 ov (133b)") */
  oversWithBalls: (balls?: number | null, decimalOvers?: number | null) => {
    if (balls != null && !isNaN(balls)) {
      const full = Math.floor(balls / 6)
      const rem = balls % 6
      return `${full}.${rem} ov (${balls}b)`
    }
    if (decimalOvers != null && !isNaN(decimalOvers)) {
      const totalBalls = Math.round(decimalOvers * 6)
      const full = Math.floor(totalBalls / 6)
      const rem = totalBalls % 6
      return `${full}.${rem} ov (${totalBalls}b)`
    }
    return '—'
  },

  /** Formats match record with percentage (e.g. 12/15 -> "12/15 (80.0%)") */
  recordWithPct: (won?: number | null, total?: number | null, pct?: number | null) => {
    if (won == null || total == null || total === 0) return '—'
    const rate = pct != null ? (pct > 1.0 ? pct : pct * 100) : (won / total) * 100
    return `${won}/${total} (${rate.toFixed(1)}%)`
  },
}
