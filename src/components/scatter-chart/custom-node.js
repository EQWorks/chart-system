import React from 'react'

import PropTypes from 'prop-types'

const propTypes = {
  node: PropTypes.object,
  id: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  size: PropTypes.number,
  color: PropTypes.string,
  blendMode: PropTypes.string,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
}

const CustomNode = ({
  node,
  x,
  y,
  size,
  color,
  blendMode,
  /**
   * onMouseEnter and onMouseLeave need to come through props into the node so it picks up event for
   * tooltip
   */
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  onClick,
}) => {
  return (
    <g transform={ `translate(${x},${y})` }>
      <circle
        r={ size / 2 }
        fill={ color }
        id={ node.data.serieId }
        style={{ mixBlendMode: blendMode, opacity: 1 }}
        onMouseEnter={ onMouseEnter }
        onMouseMove={ onMouseMove }
        onMouseLeave={ onMouseLeave }
        onClick={ onClick }
      />
    </g>
  )
}

CustomNode.propTypes = propTypes
export default CustomNode
