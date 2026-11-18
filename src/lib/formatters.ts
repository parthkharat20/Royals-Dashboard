export const fmt = {
  pri:   (v?: number | null) => (v != null ? Number(v).toFixed(1) : '—'),
  pct:   (v?: number | null) => (v != null ? `${Number(v).toFixed(1)}%` : '—'),
  sr:    (v?: number | null) => (v != null ? Number(v).toFixed(2) : '—'),
  econ:  (v?: number | null) => (v != null ? Number(v).toFixed(2) : '—'),
  lift:  (v?: number | null) => {
    if (v == null) return '—'
    const num = Number(v)
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`
  },
  money: (v?: number | null) => (v != null ? `₹${Number(v).toFixed(1)} Cr` : '—'),
  big:   (v?: number | null) => {
    if (v == null) return '—'
    const num = Number(v)
    return num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toLocaleString()
  },
  rank:  (v?: number | null) => (v != null ? `#${v}` : '—'),
}
