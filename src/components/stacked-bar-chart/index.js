import React from 'react'

import PropTypes from 'prop-types'
import { ResponsiveBar } from '@nivo/bar'

import Tooltip from '../tooltip'

import designSystemColors from '../../shared/constants/design-system-colors'

import { getCommonProps } from '../../shared/utils'


// sets common props for Nivo ResponsiveBar component
const setCommonProps = (width, height, data, axisBottomLegendLabel, axisLeftLegendLabel) => ({
  keys: ['visits', 'visitors', 'repeat_visitors', 'single_visitors', 'multi_visitors'],
  indexBy: Object.keys(data[0])[0],
  groupMode: 'stacked',
  layout: 'vertical',
  colors: [
    designSystemColors.blue70,
    designSystemColors.yellow70,
    designSystemColors.pink70,
    designSystemColors.purple70,
    designSystemColors.teal70
  ],
  axisTop: null,
  axisRight: null,
  enableRadialLabels: false,
  enableGridY: true,
  enableLabel: false,
  animate: true,
  motionStiffness: 90,
  motionDamping: 15,
  ...getCommonProps({
    data,
    height,
    width,
    axisBottomLegendLabel,
    axisLeftLegendLabel,
    legendProps: { dataFrom: 'keys', justify: false },
    tickValues: 8,
  })
})

const propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  axisBottomLegendLabel: PropTypes.string,
  axisLeftLegendLabel: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

const defaultProps = {
  axisBottomLegendLabel: '',
  axisLeftLegendLabel: '',
  width: 100,
  height: 100,
}

// StackedBarChart - creates a bar chart
const StackedBarChart = ({
  data,
  axisBottomLegendLabel,
  axisLeftLegendLabel,
  height,
  width,
}) => {

  return (
    <ResponsiveBar
      {...setCommonProps(width, height, data, axisBottomLegendLabel, axisLeftLegendLabel)}
      tooltip={({ id, value, color, indexValue }) => (
        <Tooltip
          label={id}
          color={color}
          display={[
            { label: axisBottomLegendLabel, value: indexValue },
            { label: axisLeftLegendLabel, value },
          ]}
        />
      )}
      onMouseEnter={(_data, event) => {
        let dataPoints = Array.from(event.target.parentNode.parentElement.getElementsByTagName('rect'))
        let hoverItemIndex = dataPoints.indexOf(event.target)
        dataPoints.splice(hoverItemIndex, 1)
        dataPoints.forEach(point => {
          point.style.opacity = 0.1
        })
      }}
      onMouseLeave={(_data, event) => {
        let dataPoints = Array.from(event.target.parentNode.parentElement.getElementsByTagName('rect'))
        for (let i = 0; i < dataPoints.length; i++) {
          dataPoints[i].style.opacity = 1
        }
      }}
    >
    </ResponsiveBar>
  )
}

StackedBarChart.defaultProps = defaultProps
StackedBarChart.propTypes = propTypes

export default StackedBarChart
