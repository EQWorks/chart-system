import PropTypes from 'prop-types'
import React from 'react'

const DivBase = ({ margin, x, y, rightAligned, color, showLegend, legendPosition, ...props }) => <div {...props}></div>

DivBase.propTypes = {
  margin: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  rightAligned: PropTypes.bool,
  showLegend: PropTypes.bool,
  legendPosition: PropTypes.array,
  color: PropTypes.string,
}

export default DivBase
