
import React from 'react'
import PropTypes from 'prop-types'
import { BoxLegendSvg } from '@nivo/legends'


const propTypes = {
  legends: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
}

const BoxLegend = ({ legends, height, width }) => (
  <React.Fragment>
    {legends.map((legend) => (
      <BoxLegendSvg
        key={legend.id}
        {...legend}
        containerHeight={height}
        containerWidth={width}
      />
    ))}
  </React.Fragment>
)

BoxLegend.propTypes = propTypes

export default BoxLegend
