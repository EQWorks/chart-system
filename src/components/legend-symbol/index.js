import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import { trimLegendLabel  } from '../../shared/utils'


const propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
  borderWidth: PropTypes.number.isRequired,
  borderColor: PropTypes.string.isRequired,
  legendLabelContainerWidth: PropTypes.number.isRequired,
}

const LegendCircle = ({
  x, y, size, fill, borderWidth, borderColor, legendLabelContainerWidth
}) => {

  const initRef = useCallback(trimLegendLabel({ legendLabelContainerWidth }), [])

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
