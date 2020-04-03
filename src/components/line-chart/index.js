import React from 'react'
import PropTypes from 'prop-types'

import ResponsiveLineChart from './responsive-line'
import designSystemColors from '../../shared/constants/design-system-colors'


const propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  axisBottomLegendLabel: PropTypes.string,
  axisLeftLegendLabel: PropTypes.string
}

const LineChart = ({ data, axisBottomLegendLabel, axisLeftLegendLabel}) => {
  const colors = [
    designSystemColors.blue70,
    designSystemColors.yellow70,
    designSystemColors.pink70,
    designSystemColors.purple70,
    designSystemColors.teal70
  ]

  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

  const dataWithColor = data.map(datum => ({
    ...datum,
    color: getRandomColor()
  }))

  return (
    <ResponsiveLineChart data={dataWithColor} axisBottomLegendLabel={axisBottomLegendLabel} axisLeftLegendLabel={axisLeftLegendLabel} />
  )
}

export default LineChart
LineChart.propTypes = propTypes
