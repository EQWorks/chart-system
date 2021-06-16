import PropTypes from 'prop-types'
import React from 'react'
import Plot from 'react-plotly.js'

const Bar = ({ data, layout, config }) => {
  return <Plot data={data} layout={layout} config={config} /> 
}

Bar.propTypes = {
  config: PropTypes.object,
  data: PropTypes.array,
  layout: PropTypes.object,
}

export default Bar
