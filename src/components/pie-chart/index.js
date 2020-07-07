import React from 'react'
import PropTypes from 'prop-types'
import { ResponsivePie } from '@nivo/pie'

import ChartWrapper from '../chart-wrapper'
import Tooltip from '../tooltip'

import {
  getCommonProps,
  processColors,
  processPieDataKeys,
  convertPieDataToNivo,
  aggregateData,
} from '../../shared/utils'
import { chartPropTypes, chartDefaultProps } from '../../shared/constants/chart-props'
import {
  WIDTH_BREAKPOINT_2,
  HEIGHT_BREAKPOINT_2,
  DATA_HOVER_OPACITY
} from '../../shared/constants/dimensions'

const propTypes = {
  isDonut: PropTypes.bool,
  enableSlicesLabels: PropTypes.bool,
  slicesLabelsSkipAngle: PropTypes.number,
  dataKey: PropTypes.string,
  groupByKey: PropTypes.string,
  valueKey: PropTypes.string,
  ...chartPropTypes,
}

const defaultProps = {
  isDonut: false,
  enableSlicesLabels: true,
  slicesLabelsSkipAngle: 30,
  dataKey: '',
  groupByKey: '',
  valueKey: '',
  ...chartDefaultProps,
}

// PieChart - creates a pie chart
const PieChart = ({
  isDonut,
  dataKey,
  groupByKey,
  valueKey,
  indexBy,
  data,
  colors,
  colorType,
  colorParam,
  width,
  height,
  enableSlicesLabels,
  slicesLabelsSkipAngle,
  ...nivoProps
}) => {
  // indexBy => id
  // valueKey => value
  const { finalIndexBy, finalDataKey } = processPieDataKeys({ data, indexBy, dataKey })
  const aggregatedData = aggregateData({ data, keys: [finalDataKey], indexBy: finalIndexBy, groupByKey, valueKey, type: 'sum' })
  const finalData = convertPieDataToNivo({ data: aggregatedData, indexBy: finalIndexBy, dataKey: finalDataKey })
  const finalColors = colors.length ? colors : processColors(data.length, colorType, colorParam)

  const mouseLeaveHandler = (_data, event) => {
    const arc = event.target
    Array.from(arc.parentNode.children)
      .filter(ele => ele.tagName === 'path' && ele !== arc)
      // reset all other slices
      .forEach((tag) => {
        tag.style.opacity = 1
      })
  }

  const mouseOverHandler = (_data, event) => {
    const arc = event.target
    Array.from(arc.parentNode.children)
      .filter(ele => ele.tagName === 'path' && ele !== arc)
      // lighten all other slices
      .forEach(tag => {
        tag.style.opacity = DATA_HOVER_OPACITY
      })
  }

  // we don't show slice labels unless chart width and chart height are large enough
  let showLabels = false
  // case for the charts without axes / pie chart
  if ((width >= WIDTH_BREAKPOINT_2) && (height >= HEIGHT_BREAKPOINT_2)) {
    showLabels = true
  }

  return (
    <ResponsivePie
      {...nivoProps}
      data={finalData}
      colors={finalColors}
      padAngle={0.7}
      cornerRadius={3}
      enableRadialLabels={false}
      fit={true}
      enableSlicesLabels={ enableSlicesLabels }
      sliceLabel={ showLabels ? 'percent' : '' }
      slicesLabelsSkipAngle={ slicesLabelsSkipAngle }
      slicesLabelsTextColor='#fff'
      innerRadius={isDonut ? 0.6 : 0}
      tooltip={({ id, value, percent, color }) => (
        <Tooltip
          label={id}
          color={color}
          display={[
            { label: 'Value', value },
            { label: 'Share', value: percent },
          ]}
        />
      )}
      onMouseEnter={mouseOverHandler}
      onMouseLeave={mouseLeaveHandler}
      {...getCommonProps({
        useAxis: false,
        keys: finalData.map(o => o.id),
        height,
        width,
        dash: true,
      })}
    >
    </ResponsivePie>
  )
}

PieChart.defaultProps = defaultProps
PieChart.propTypes = propTypes

export default ChartWrapper(PieChart)
