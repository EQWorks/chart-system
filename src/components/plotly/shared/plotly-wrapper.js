import React from 'react'
import PropTypes from 'prop-types'

import Plotly from 'plotly.js-basic-dist-min'
import createPlotlyComponent from 'react-plotly.js/factory'


const Plot = createPlotlyComponent(Plotly)

const PlotlyWrapper = ({ data, layout, ...props }) => {
  return (
    <Plot
      data={data}
      layout={{
        autosize: true,
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        modebar: {
          bgcolor: 'transparent',
          color: 'black',
          activecolor: 'black',
        },
        ...layout,
      }}
      {...props}
    />
  )
}

PlotlyWrapper.propTypes = {
  data: PropTypes.array,
  layout: PropTypes.object,
}
PlotlyWrapper.defaultProps = {
  data: [],
  layout: {},
}

export default PlotlyWrapper
