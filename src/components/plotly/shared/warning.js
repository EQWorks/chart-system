import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles'


const Warning = ({ message }) => (
  <styles.LegendContainer x={1} y={1}>
    <styles.Warning>
      <b>
        Warning
      </b>
      {message}
    </styles.Warning>
  </styles.LegendContainer >
)

Warning.propTypes = {
  message: PropTypes.message,
}

Warning.defaultProps = {
  message: null,
}

export default Warning
