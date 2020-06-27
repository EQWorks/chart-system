import React from 'react'

import { ResponsiveBar } from '@nivo/bar'


import Tooltip from '../tooltip'

import { getCommonProps, processDataKeys, processColors } from '../../shared/utils'
import { chartPropTypes, chartDefaultProps } from '../../shared/constants/chart-props'


const propTypes = chartPropTypes
const defaultProps = chartDefaultProps

const BarChart = ({
  keys,
  indexBy,
  data,
  colors,
  colorType,
  colorParam,
  axisBottomLegendLabel,
  axisLeftLegendLabel,
  width,
  height,
  axisBottomTrim,
  axisBottomLabelDisplayFn,
  axisLeftLabelDisplayFn,
  ...nivoProps
}) => {
  // a single key is required for the X axis scale
  // the rest are used as values
  // indexBy cannot be present in keys[]
  const { finalKeys, finalIndexBy } = processDataKeys({ data, keys, indexBy })
  const finalColors = colors.length ? colors : processColors(finalKeys.length, colorType, colorParam)
  return (
    <ResponsiveBar
      // TODO right now, our props override, but need to see if there are any that should take precedent
      {...nivoProps}
      data={data}
      indexBy={finalIndexBy}
      keys={finalKeys}
      colors={finalColors}
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
        keys: finalKeys,
        yKeys: [finalKeys],
        xKey: finalIndexBy,
        height,
        width,
        axisBottomLegendLabel,
        axisLeftLegendLabel,
        legendProps: { dataFrom: 'keys' },
        axisBottomTrim,
        axisBottomLabelDisplayFn,
        axisLeftLabelDisplayFn,
      })}
    />
  )
}

BarChart.defaultProps = defaultProps
BarChart.propTypes = propTypes

export default BarChart
