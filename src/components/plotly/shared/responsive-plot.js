import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Plot from 'react-plotly.js'
import { useResizeDetector } from 'react-resize-detector'

// import { aggregate, aggregateJson } from '../shared/utils'
// import { parseData, getChartData, getLayers } from '../shared/utils/helpers'

const ResponsivePlot = ({ type, data, layout, subPlots, ...props }) => {

  const { width, height, ref } = useResizeDetector({
    // refreshMode: 'debounce', 
    // refreshRate: 1000
  })

  const doSubPlots = useMemo(() => data.length > 1 && subPlots, [data.length, subPlots])
  const subPlotRows = useMemo(() => Math.ceil(data.length / 2), [data.length])
  const subPlotColumns = 2

  return (
    <div ref={ref}>
      <Plot
        data={
          doSubPlots ?
            data.map((obj, i) => ({
              type,
              xaxis: `x${i + 1}`,
              yaxis: `y${i + 1}`,
              ...obj,
            }))
            :
            data.map(obj => ({ type, ...obj }))
        }
        layout={{
          width,
          height,
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          modebar: {
            bgcolor: 'transparent',
            color: 'black',
            activecolor: 'black',
          },
          legend: {
            orientation: 'h',
            yanchor: 'bottom',
            xanchor: 'right',
            y: 1,
            x: 1,
          },
          ...doSubPlots && {
            grid: {
              rows: subPlotRows,
              columns: subPlotColumns,
              pattern: 'independent',
            },
          },
          // margin: {
          //   't': 1,
          //   'b': 1,
          //   'l': 1,
          //   'r': 1,
          // },
          ...layout,
        }}
        style={{ width: '100%', height: '100%' }}
        {...props}
      />
    </div>
  )
}

ResponsivePlot.propTypes = {
  config: PropTypes.object,
  data: PropTypes.array,
  layout: PropTypes.object,
  subPlots: PropTypes.bool,
}

export default ResponsivePlot
