import React from 'react'

import PropTypes from 'prop-types'
import { ResponsiveBar } from '@nivo/bar'


import Tooltip from '../tooltip'

import { getCommonProps, processData } from '../../shared/utils'


const propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  keys: PropTypes.array,
  indexBy: PropTypes.string,
  axisBottomLegendLabel: PropTypes.string,
  axisLeftLegendLabel: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

const defaultProps = {
  keys: [],
  indexBy: '',
  axisBottomLegendLabel: '',
  axisLeftLegendLabel: '',
  width: 100,
  height: 100,
}

const BarChart = ({
  data,
  keys,
  indexBy,
  axisBottomLegendLabel,
  axisLeftLegendLabel,
  width,
  height,
}) => {
  // a single key is required for the X axis scale
  // the rest are used as values
  // indexBy cannot be present in keys[]
  const { finalKeys, finalIndexBy, colors } = processData({ data, keys, indexBy })
  return (
    <ResponsiveBar
      indexBy={finalIndexBy}
      keys={finalKeys}
      groupMode='grouped'
      layout='vertical'
      colors={colors}
      enableRadialLabels={false}
      enableGridY={true}
      enableLabel={false}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      tooltip={({ id, value, color, indexValue }) => ( // also ({ data, index, theme })
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
      {...getCommonProps({
        data,
        height,
        width,
        axisBottomLegendLabel,
        axisLeftLegendLabel,
        legendProps: { dataFrom: 'keys', justify: false },
        tickValues: 8,
      })}
    />
  )
}

BarChart.defaultProps = defaultProps
BarChart.propTypes = propTypes

export default BarChart
