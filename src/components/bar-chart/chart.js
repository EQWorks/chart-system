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
  axisBottomOrder,
  axisLeftLabelDisplayFn,
  ...nivoProps
}) => {
  // a single key is required for the X axis scale
  // the rest are used as values
  // indexBy cannot be present in keys[]
  const { finalKeys, finalIndexBy } = processDataKeys({ data, keys, indexBy })
  const finalColors = colors.length ? colors : processColors(finalKeys.length, colorType, colorParam)

  // TODO: common x-axis type processing for String, Date, Number
  // manual for bar chart
  // xScale for line & scatter
  // axisBottomOrder = [string keys] | 'asc' | 'desc' | false (none)
  const processAxisOrder = ({ data, axisBottomOrder, chartType }) => {
    if (!axisBottomOrder.length) return data
    if (chartType === 'bar') {
      if (Array.isArray(axisBottomOrder)) {
        return axisBottomOrder.map(label => data.find(row => row[finalIndexBy] === label))
      }
      const dir = axisBottomOrder === 'asc' ? 1 : -1
      return [...data].sort((a, b) => {
        if (a[finalIndexBy] < b[finalIndexBy]) {
          return -1 * dir
        } else if (a[finalIndexBy] > b[finalIndexBy]) {
          return 1 * dir
        }
        return 0
      })
    }
  }
  const finalData = processAxisOrder({ data, axisBottomOrder, chartType: 'bar' })

  return (
    <ResponsiveBar
      // TODO right now, our props override, but need to see if there are any that should take precedent
      {...nivoProps}
      data={finalData}
      // NOTE yScale, xScale, yFormat, xFormat are not exposed in Bar
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
        data: finalData,
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
