import PropTypes from 'prop-types'
import React from 'react'
import './tooltip.css'


const Tooltip = ({ width, height, left, top, children }) => {
  return (
    <div className='tooltip' style={{ width: width, height: height, position: 'absolute', left: left, top: top }}>
      {children}
    </div>
  )
}

Tooltip.propTypes = {
  children: PropTypes.node,
  height: PropTypes.number,
  left: PropTypes.number,
  top: PropTypes.number,
  width: PropTypes.number,
}

export default Tooltip
