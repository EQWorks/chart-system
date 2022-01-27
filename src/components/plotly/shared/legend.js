import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles'
import getColorScheme from './get-color-scheme'


const Legend = ({
  keys,
  colors,
  position: [x, y],
}) => (
  <styles.LegendContainer x={x} y={y} >
    <styles.Legend>
      {
        keys.map((k, i) => (
          <styles.LegendRow key={i}>
            <styles.LegendColorBox color={colors[i]} rightAligned={x > 0.5} />
            <styles.LegendString rightAligned={x > 0.5}>
              {k}
            </styles.LegendString>
          </styles.LegendRow>
        ))
      }
    </styles.Legend>
  </styles.LegendContainer >
)

Legend.propTypes = {
  keys: PropTypes.arrayOf(PropTypes.string),
  colors: PropTypes.arrayOf(PropTypes.string),
  position: PropTypes.arrayOf(PropTypes.number),
}

Legend.defaultProps = {
  keys: [],
  colors: getColorScheme('#0017ff', 12),
  position: [1, 0],
}

export default Legend
