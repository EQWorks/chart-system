import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles'
import getColorScheme from './get-color-scheme'


const Legend = ({
  margin,
  keys,
  colors,
  position: [x, y],
}) => (
  <styles.LegendContainer margin={margin} x={x} y={y} >
    {
      keys.map((k, i) => (
        <styles.LegendItem key={i}>
          <styles.LegendColorBox color={colors[i]} rightAligned={x > 0.5} />
          <styles.LegendString rightAligned={x > 0.5}>
            {k}
          </styles.LegendString>
        </styles.LegendItem>
      ))
    }
  </styles.LegendContainer >
)

Legend.propTypes = {
  margin: PropTypes.number,
  keys: PropTypes.arrayOf(PropTypes.string),
  colors: PropTypes.arrayOf(PropTypes.string),
  position: PropTypes.arrayOf(PropTypes.number),
}

Legend.defaultProps = {
  margin: 0.05,
  keys: [],
  colors: getColorScheme('#0017ff', 12),
  position: [1, 0],
}

export default Legend
