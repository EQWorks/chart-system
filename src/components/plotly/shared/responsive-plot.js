import React from 'react'
import PropTypes from 'prop-types'
import Plot from 'react-plotly.js'
import { useResizeDetector } from 'react-resize-detector'

// import { aggregate, aggregateJson } from '../shared/utils'
// import { parseData, getChartData, getLayers } from '../shared/utils/helpers'

const ResponsivePlot = ({ type, data, mode, layout, ...props }) => {

  const { width, height, ref } = useResizeDetector({
    // refreshMode: 'debounce', 
    // refreshRate: 1000
  })

  return (
    <div ref={ref}>
      <Plot
        data={data.map(obj => ({ type, mode, ...obj }))}
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
}

export default ResponsivePlot
