import React, { useState, useMemo, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Pie } from '@nivo/pie'

import { withWrapper } from '../chart-wrapper'
import Tooltip from '../tooltip'

import { useLegendToggle } from '../hooks'
import {
  getCommonProps,
  processColors,
  processPieDataKeys,
  convertPieDataToNivo,
  aggregateData,
} from '../shared/utils'
import {
  chartPropTypes,
  chartDefaultProps,
  typographyPropTypes,
  typographyDefaultProps,
} from '../shared/constants/chart-props'
import {
  WIDTH_BREAKPOINT_2,
  HEIGHT_BREAKPOINT_2,
  DATA_HOVER_OPACITY,
} from '../shared/constants/dimensions'


const propTypes = {
  isDonut: PropTypes.bool,
  enableSlicesLabels: PropTypes.bool,
  slicesLabelsSkipAngle: PropTypes.number,
  dataKey: PropTypes.string,
  groupByKey: PropTypes.string,
  valueKey: PropTypes.string,
  padAngle: PropTypes.number,
  cornerRadius: PropTypes.number,
  ...typographyPropTypes,
  ...chartPropTypes,
}

const defaultProps = {
  isDonut: false,
  enableSlicesLabels: true,
  slicesLabelsSkipAngle: 30,
  dataKey: '',
  groupByKey: '',
  valueKey: '',
  padAngle: 0.7,
  cornerRadius: 3,
  ...typographyDefaultProps,
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
  padAngle,
  cornerRadius,
  maxRowLegendItems,
  trimLegend,
  disableLegend,
  tooltipFormat,
  disableTooltipTitle,
  typographyProps,
  ...nivoProps
}) => {
  const [slicePadAngle, setSlicePadAngle] = useState(padAngle)
  const [sliceCornerRadius, setSliceCornerRadius] = useState(cornerRadius)

  const {
    nivoData,
    baseColors,
  } = useMemo(() => {
    // indexBy => id
    // valueKey => value
    const { finalIndexBy, finalDataKey } = processPieDataKeys({ data, indexBy, dataKey })
    const aggregatedData = aggregateData({ data, keys: [finalDataKey], indexBy: finalIndexBy, groupByKey, valueKey, type: 'sum' })
    const nivoData = convertPieDataToNivo({ data: aggregatedData, indexBy: finalIndexBy, dataKey: finalDataKey })
    let baseColors = colors.length ? colors : processColors(data.length, colorType, colorParam)

    if (typeof colors === 'function') {
      baseColors = nivoData.map(colors)
    }

    return {
      nivoData,
      baseColors,
    }
  }, [data, colors, indexBy, colorParam, colorType, dataKey, groupByKey, valueKey])

  const [{ finalData, finalColors }, dispatch] = useReducer((state, { type, payload }) => {
    if (type === 'reset') {
      return payload
    }

    if (type === 'toggle') {

      const idx = state.finalData.findIndex(o => o.id === payload)
      const currentSeries = state.finalData[idx]
      const finalData = [
        ...state.finalData.slice(0, idx),
        // ====[NOTE] return original OR set value to 0 (hack to hide the slice)
        currentSeries.hide ? nivoData[idx] : { ...state.finalData[idx], value: 0, hide: true },
        ...state.finalData.slice(idx + 1),
      ]

      const visibleSlices = finalData.filter(d => !d.hide)
      // don't use corner radius and padAngle on the last 100% slice
      if (visibleSlices.length === 1) {
        setSlicePadAngle(0)
        setSliceCornerRadius(0)
      } else {
        setSlicePadAngle(padAngle)
        setSliceCornerRadius(cornerRadius)
      }

      const total = finalData.reduce((sum, row) => sum + row.value, 0)
      return {
        finalData: finalData.map(o => ({ ...o, percent: `${(o.value * 100 / total).toFixed(1)}%` })),
        finalColors:
          [
            ...state.finalColors.slice(0, idx),
            // ====[NOTE] return original OR set color to grey (hack to change legend)
            currentSeries.hide ? baseColors[idx] : 'rgba(150, 150, 150, 0.5)',
            ...state.finalColors.slice(idx + 1),
          ],
      }
    }

    return state
  }, {
    finalData: nivoData,
    finalColors: baseColors,
  })

  useEffect(() => {
    dispatch({
      type: 'reset',
      payload: {
        finalData: nivoData,
        finalColors: baseColors,
      },
    })
  }, [nivoData, baseColors])

  const legendOnClick = ({ id }) => dispatch({ type: 'toggle', payload: id })

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

  const legendToggle = useLegendToggle(data)
  return (
    <Pie
      { ...nivoProps }
      height={ height }
      width={ width }
      data={ finalData }
      colors={ finalColors }
      padAngle={ slicePadAngle }
      cornerRadius={ sliceCornerRadius }
      enableRadialLabels={ false }
      fit={ true }
      enableSlicesLabels={ enableSlicesLabels }
      sliceLabel={ showLabels ? 'percent' : '' }
      slicesLabelsSkipAngle={ slicesLabelsSkipAngle }
      slicesLabelsTextColor='#fff'
      innerRadius={ isDonut ? 0.6 : 0 }
      tooltip={ ({ id, value, percent, color }) => (
        <Tooltip
          label={ id }
          color={ color }
          display={ [
            { label: 'Value', value: tooltipFormat(value) },
            { label: 'Share', value: percent },
          ] }
          disableTooltipTitle={ disableTooltipTitle }
          chartType='pie'
          typography={ typographyProps }
        />
      ) }
      onMouseEnter={ mouseOverHandler }
      onMouseLeave={ mouseLeaveHandler }
      { ...getCommonProps({
        useAxis: false,
        keys: finalData.map(o => o.id),
        legendOnClick,
        height,
        width,
        maxRowLegendItems,
        trimLegend,
        disableLegend,
        typographyProps,
        dash: true,
      }) }
      { ...legendToggle }
    >
    </Pie>
  )
}

PieChart.defaultProps = defaultProps
PieChart.propTypes = propTypes

export default withWrapper(PieChart)
