import createPlotlyComponent from 'react-plotly.js/factory'
import Plotly from 'plotly.js-dist-min'
import { PLOTLY_LAYOUT_DEFAULTS } from '@/lib/colors'

// Create typed component with plotly.js-dist-min
const Plot = createPlotlyComponent(Plotly)

export function ChartWrapper({
  data,
  layout,
  height = 380,
  className = '',
}: {
  data: any[]
  layout?: Record<string, any>
  height?: number
  className?: string
}) {
  const mergedLayout = {
    ...PLOTLY_LAYOUT_DEFAULTS,
    ...layout,
    height,
    autosize: true,
  }

  return (
    <div className={`bg-surface rounded border border-border-subtle p-3 overflow-hidden ${className}`}>
      <Plot
        data={data}
        layout={mergedLayout}
        config={{
          displayModeBar: false,
          responsive: true,
        }}
        useResizeHandler
        style={{ width: '100%', height: `${height}px` }}
      />
    </div>
  )
}
