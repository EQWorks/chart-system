import React from 'react'
import PropTypes from 'prop-types'

import Plotly from 'plotly.js-basic-dist-min'
import createPlotlyComponent from 'react-plotly.js/factory'
import styles from '../shared/styles'


const Plot = createPlotlyComponent(Plotly)

const PlotlyWrapper = ({ data, layout, style, ...props }) => {
  return (
    <>
      <styles.Plot>
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
          style={{
            width: '100%',
            height: '100%',
            ...style,
          }}
          {...props}
        />
      </styles.Plot>
    </>
  )
}

PlotlyWrapper.propTypes = {
  data: PropTypes.array,
  layout: PropTypes.object,
  style: PropTypes.object,
}
PlotlyWrapper.defaultProps = {
  data: [],
  layout: {},
  style: {},
}

export default PlotlyWrapper
