import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Plot from 'react-plotly.js'
import { styled, setup } from 'goober'
import { useResizeDetector } from 'react-resize-detector'


setup(React.createElement)
const Wrapper = styled('div')`
  height: 100%;
  width: 100%;
`
const ResponsivePlot = ({ type, data, layout, subPlots, ...props }) => {
  const { width, ref } = useResizeDetector({})

  const doSubPlots = useMemo(() => data.length > 1 && subPlots, [data.length, subPlots])
  const subPlotRows = useMemo(() => Math.ceil(data.length / 2), [data.length])
  const subPlotColumns = 2

  return (
    <Wrapper ref={ref} >
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
        config={{ responsive: true }}
        layout={{
          width,
          autosize: true,
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
          ...layout,
        }}
        style={{ height: 'inherit' }}
        {...props}
      />
    </Wrapper>
  )
}

ResponsivePlot.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  layout: PropTypes.object,
  subPlots: PropTypes.bool,
}

ResponsivePlot.defaultProps = {
  layout: {},
  subPlots: false,
}

export default ResponsivePlot
