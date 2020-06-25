import React, { useCallback } from 'react'
import PropTypes from 'prop-types'


const propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
  borderWidth: PropTypes.number.isRequired,
  borderColor: PropTypes.string.isRequired,
  trimLegendLabel: PropTypes.func.isRequired,
}

const LegendCircle = ({
  x, y, size, fill, borderWidth, borderColor, trimLegendLabel
}) => {

  const initRef = useCallback(trimLegendLabel, [])

  return (
    <circle
      r={size / 2}
      cx={x + size / 2}
      cy={y + size / 2}
      fill={fill}
      strokeWidth={borderWidth}
      stroke={borderColor}
      style={{
        pointerEvents: 'none',
      }}
      ref={initRef}
    />
  )
}

LegendCircle.propTypes = propTypes

export default LegendCircle
