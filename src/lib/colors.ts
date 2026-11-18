/** Plotly-compatible color constants */
export const COLORS = {
  canvas:    '#0A0E1A',
  surface:   '#111827',
  elevated:  '#1E2640',
  pink:      '#E83E8C',
  pinkHover: '#D81B60',
  blue:      '#2563EB',
  gold:      '#FBBF24',
  success:   '#059669',
  warning:   '#D97706',
  danger:    '#DC2626',
  textPri:   '#F8FAFC',
  textSec:   '#94A3B8',
  textMuted: '#64748B',
  borderSub: 'rgba(255,255,255,0.08)',
  borderStr: 'rgba(255,255,255,0.15)',
  chart: [
    '#E83E8C', '#FBBF24', '#2563EB', '#059669', '#8B5CF6',
    '#F59E0B', '#EC4899', '#06B6D4', '#10B981', '#F43F5E'
  ],
} as const

/** Plotly dark layout defaults — spread into every chart's layout */
export const PLOTLY_LAYOUT_DEFAULTS = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor:  'rgba(0,0,0,0)',
  font: { family: 'Source Sans 3, sans-serif', color: '#94A3B8', size: 12 },
  margin: { t: 40, r: 24, b: 48, l: 56 },
  xaxis: {
    gridcolor: 'rgba(255,255,255,0.06)',
    zerolinecolor: 'rgba(255,255,255,0.1)',
    tickfont: { family: 'JetBrains Mono', color: '#94A3B8', size: 11 }
  },
  yaxis: {
    gridcolor: 'rgba(255,255,255,0.06)',
    zerolinecolor: 'rgba(255,255,255,0.1)',
    tickfont: { family: 'JetBrains Mono', color: '#94A3B8', size: 11 }
  },
  hoverlabel: {
    bgcolor: '#1E2640',
    bordercolor: '#E83E8C',
    font: { family: 'Source Sans 3', size: 13, color: '#F8FAFC' }
  },
}
