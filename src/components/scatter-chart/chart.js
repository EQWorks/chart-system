import React from 'react'
import PropTypes from 'prop-types'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'

import Tooltip from '../tooltip'
import { onMouseEnter, onMouseLeave } from './events'

import designSystemColors from '../../shared/constants/design-system-colors'
import { getCommonProps } from '../../shared/utils'


// sets common props for Nivo ResponsiveScatterPlot component
const setCommonProps = (width, height, data, axisBottomLegendLabel, axisLeftLegendLabel) => ({
  xScale: { type: 'linear' },
  yScale: { type: 'linear' },
  colors: [
    designSystemColors.blue70,
    designSystemColors.pink70,
    designSystemColors.teal70
  ],
  nodeSize: 8,
  onMouseEnter,
  onMouseLeave,
  useMesh: false,
  ...getCommonProps({
    data,
    height,
    width,
    axisBottomLegendLabel,
    axisLeftLegendLabel,
    dash: true,
    tickValues: data[0].data.length,
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

// ScatterChart - creates a scatter chart
const ScatterChart = ({
  data,
  axisBottomLegendLabel,
  axisLeftLegendLabel,
  width,
  height,
}) => (
  <ResponsiveScatterPlot
    {...setCommonProps(width, height, data, axisBottomLegendLabel, axisLeftLegendLabel)}
    tooltip={({ node }) => (
      <Tooltip
        label={node.id.split('.')[0]}
        color={node.style.color}
        display={[
          { label: axisBottomLegendLabel, value: node.data.formattedX },
          { label: axisLeftLegendLabel, value: node.data.formattedY },
        ]}
      />
    )}
  >
  </ResponsiveScatterPlot>
)

ScatterChart.defaultProps = defaultProps
ScatterChart.propTypes = propTypes

export default ScatterChart
