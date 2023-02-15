import React from 'react'
import PropTypes from 'prop-types'

import Styles from './styles'
import getColorScheme from './get-color-scheme'

const Legend = ({
  margin,
  keys,
  colors,
  position: [x, y],
}) => (
  <Styles.LegendContainer margin={margin} x={x} y={y}>
    {
      keys.map((k, i) => (
        <Styles.LegendItem key={i}>
          <Styles.LegendColorBox color={colors[i]} />
          <Styles.LegendString>
            {k}
          </Styles.LegendString>
        </Styles.LegendItem>
      ))
    }
  </Styles.LegendContainer >
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
