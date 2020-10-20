
import React from 'react'
import PropTypes from 'prop-types'
import { BoxLegendSvg } from '@nivo/legends'


const propTypes = {
  legends: PropTypes.array.isRequired,
  innerHeight: PropTypes.number.isRequired,
  innerWidth: PropTypes.number.isRequired,
}

const BoxLegend = ({ legends, innerHeight, innerWidth }) =>  (
  <React.Fragment>
    {legends.map((legend) => (
      <BoxLegendSvg
        key={legend.id}
        {...legend}
        containerHeight={innerHeight}
        containerWidth={innerWidth}
      />
    ))}
  </React.Fragment>
)

BoxLegend.propTypes = propTypes

export default BoxLegend
