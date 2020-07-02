import React from 'react'
import { omit } from 'lodash'
import { computeXYScalesForSeries } from '@nivo/scales'
import {
  WIDTH_BREAKPOINT_1,
  WIDTH_BREAKPOINT_2,
  WIDTH_BREAKPOINT_3,
  HEIGHT_BREAKPOINT_1,
  HEIGHT_BREAKPOINT_2,
  HEIGHT_BREAKPOINT_3,
  LEGEND_HEIGHT,
  TEXT_HEIGHT,
  FONT_SIZE,
  BOTTOM_LEGEND_ADJUSTMENT,
  AXIS_TICK_WIDTH,
  AXIS_TICK_PADDING,
  BUFFER,
  SYMBOL_SIZE,
  SYMBOL_SPACING,
  LEGEND_TRANSLATE_X,
  TRIMMED_LEGEND_WIDTH,
  LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH,
  LEGEND_ROW_FIXED_ELEMENTS_WIDTH,
} from '../constants/dimensions'
import designSystemColors, { hues, lightnesses } from '../constants/design-system-colors'

import { getScaleTicks, getBarChartScales } from './nivo'
import LegendCircle from '../../components/legend-symbol'

// threshold for forcing a righthand legend
const MAX_LEGEND_ITEMS_ROW = 3

// given a font size, we want to calculate the dimensions of the chart
// the margin is the amount of space that the left axis ticks/legend, right legend or bottom axis ticks/legend AND legend have
// the margins should be the size of these elements + spacing
/**
 * setChartMargin - sets the values of the chart margins
 * @param { number } width - width of the chart conatiner (ChartInner)
 * @param { number } heigth - height of the chart conatiner (ChartInner)
 * @param { number } maxLegendLabelWidth - maximum length of a label/key text in the legend
 * @param { number } legendItemCount - number of items in the legend
 * @returns { object } - top, right, bottom, left margin values
 */
const setChartMargin = (width, height, maxLegendLabelWidth, legendItemCount, maxYAxisTickLabelWidth, lastXAxisTickLabelWidth) => {
  // default values
  /**
   * the top margin has to fit at least the half height of possible symbols sitting on the border
   * of the chart
   * same with the right margin, when no other elements are present to the right of the chart
   */
  const top = TEXT_HEIGHT / 2 + 1
  let right = SYMBOL_SIZE / 2 + 1
  let bottom = AXIS_TICK_WIDTH + BUFFER
  // left - we need to have the minimum space to fit the axis tick labels
  let left = AXIS_TICK_WIDTH

  // we only show x-axis tick labels and legend when chart width is large enough
  let showBottomLegendLabel = false
  let showBottomAxisTicks = false

  let bottomLegendOffset = TEXT_HEIGHT / 2 + AXIS_TICK_WIDTH + BUFFER

  // at HEIGHT_BREAKPOINT_2 we have both axis tick labels and x-axis legend visible
  if (height >= HEIGHT_BREAKPOINT_2) {
    /**
     * at HEIGHT_BREAKPOINT_2 the x-axis ticks appear in the chart, therefore, the right margin
     * has to adjust to include just over half of the last x-axis tick lable width
     */
    right = Math.max(right, lastXAxisTickLabelWidth * 0.6)
    showBottomLegendLabel = true
    showBottomAxisTicks = true
    bottomLegendOffset = bottomLegendOffset + TEXT_HEIGHT + BUFFER - BOTTOM_LEGEND_ADJUSTMENT
    bottom = AXIS_TICK_WIDTH + 3 * BUFFER + 2 * TEXT_HEIGHT
  // at HEIGHT_BREAKPOINT_1 we show only x-axis legend
  } else if (height >= HEIGHT_BREAKPOINT_1) {
    showBottomLegendLabel = true
    bottom = AXIS_TICK_WIDTH + 2 * BUFFER + TEXT_HEIGHT
  }

  // we only show y-axis tick labels and legend when chart height is large enough
  let showLeftLegendLabel = false
  let showLeftAxisTicks = false
  let leftLegendOffset = -(TEXT_HEIGHT / 2 + AXIS_TICK_WIDTH + BUFFER)

  // when chart width >= WIDTH_BREAKPOINT_2 we show both y-axis tick and legend labels
  if (width >= WIDTH_BREAKPOINT_2) {
    showLeftLegendLabel = true
    showLeftAxisTicks = true
    left = TEXT_HEIGHT + 3 * BUFFER + AXIS_TICK_WIDTH + maxYAxisTickLabelWidth
    leftLegendOffset= leftLegendOffset - BUFFER - maxYAxisTickLabelWidth
  // when chart width >= WIDTH_BREAKPOINT_1 we only show y-axis legend label
  } else if (width >= WIDTH_BREAKPOINT_1) {
    showLeftLegendLabel = true
    // TEXT_HEIGHT = axis legend height
    left = TEXT_HEIGHT + 2 * BUFFER + AXIS_TICK_WIDTH
  }

  const rightHandLegend = isAspectRatio(width, height, aspectRatios.LANDSCAPE) || legendItemCount > MAX_LEGEND_ITEMS_ROW
  let showLegend = width >= WIDTH_BREAKPOINT_3
  if (!rightHandLegend) {
    // row/bottom legend appears only after chart height >= HEIGHT_BREAKPOINT_3
    showLegend = height >= HEIGHT_BREAKPOINT_3
  }
  let legendLabelContainerWidth
  let legendItemWidth
  let legendTranslate

  if (showLegend) {
    // adjust right or bottom margin accordingly
    if (rightHandLegend) {
      // default is difference between current and required space
      // enforce a minimum
      // increase the right margin until it fits the longest label
      legendTranslate = LEGEND_TRANSLATE_X
      const expandingLabelContainer = width - WIDTH_BREAKPOINT_3 - LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH - legendTranslate
      legendLabelContainerWidth = Math.max(expandingLabelContainer, TRIMMED_LEGEND_WIDTH)
      if (expandingLabelContainer >= maxLegendLabelWidth) {
        legendLabelContainerWidth = maxLegendLabelWidth
      }
      right = legendLabelContainerWidth + legendTranslate + LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH
    } else {
      legendItemWidth = (width - right - left) / legendItemCount
      legendLabelContainerWidth = legendItemWidth - LEGEND_ROW_FIXED_ELEMENTS_WIDTH
      legendTranslate = LEGEND_HEIGHT + AXIS_TICK_WIDTH + 2 * TEXT_HEIGHT + 3 * BUFFER
      // adjust bottom to include legend and a buffer
      bottom += LEGEND_HEIGHT + BUFFER
    }
  }

  return {
    top,
    right,
    bottom,
    left,
    showLegend,
    rightHandLegend,
    legendItemWidth,
    legendLabelContainerWidth,
    showBottomLegendLabel,
    showLeftLegendLabel,
    showBottomAxisTicks,
    showLeftAxisTicks,
    bottomLegendOffset,
    leftLegendOffset,
    legendTranslate
  }
}

// NOTE: the below two functions implement axis scale calculations pulled from nivo (./nivo)
// in order to get the exact final axis labels, after d3 processing
export const getAxisLabelsBar = ({
  axisLeftLabelDisplayFn,
  axisBottomLabelDisplayFn,
  axisBottomLabelValues,
  ...options
}) => {
  const { xScale, yScale } = getBarChartScales(options)
  const xLabels = getScaleTicks(xScale, axisBottomLabelValues)
  const yLabels = getScaleTicks(yScale)

  return {
    xLabelCount: xLabels.length,
    lastXLabelWidth: getTextSize(axisBottomLabelDisplayFn(xLabels[xLabels.length - 1])),
    yLabelCount: yLabels.length,
    lastYLabelWidth: getTextSize(axisLeftLabelDisplayFn(yLabels[yLabels.length - 1])),
  }
}

export const getAxisLabelsSeries = ({
  data,
  xScale: xScaleSpec,
  yScale: yScaleSpec,
  width,
  height,
  axisBottomLabelValues,
  axisBottomLabelDisplayFn,
  axisLeftLabelDisplayFn,
}) => {
  const { xScale, yScale } = computeXYScalesForSeries(data, xScaleSpec, yScaleSpec, width, height)
  const xLabels = getScaleTicks(xScale, axisBottomLabelValues)
  const yLabels = getScaleTicks(yScale)

  return {
    xLabelCount: xLabels.length,
    lastXLabelWidth: getTextSize(axisBottomLabelDisplayFn(xLabels[xLabels.length - 1])),
    yLabelCount: yLabels.length,
    lastYLabelWidth: getTextSize(axisLeftLabelDisplayFn(yLabels[yLabels.length - 1])),
  }
}

/**
 * getLegendLabelMaxWidth - calculates the width of the longest label text in the legend
 * @param { array } key - array of keys that will be in the legend
 * @returns { number } - the width of the longest label text in the legend
 */
const getLegendLabelMaxWidth = (keys) => keys.reduce((max, key) =>
  Math.max(max, getTextSize(key)), 0)

/**
 * getTextSize - calculates a rendered text width in pixels
 * @param { string } text - a text string
 * @param { string } font - a string with the font included ex: '12px noto sans'
 * @returns { number } - the width of the rendered text in pixels
 */
export const getTextSize = (text, font = '12px noto sans') => {
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')
  context.font = font
  let width = context.measureText(text).width
  let textSize = Math.ceil(width)
  return textSize
}

/**
 * trimText - trims a text and adds '..' at the end
 * @param { string } text - a text string
 * @param { number } containerWidth - width of the text container in pixels
 * @returns { string } - a trimmed text with '..' added at the end
 */
const TRIM = '..'
const trimText = (text, containerWidth, count = 0) => {
  if (text === '') return text
  let n = text.length
  const suffix = count ? TRIM : ''
  let textWidth = getTextSize(text.substr(0, n) + suffix)
  if (textWidth <= containerWidth) {
    return text.substr(0, n) + suffix
  } else {
    return trimText(text.substr(0, n - 1), containerWidth, count + 1)
  }
}

export const aspectRatios = {
  LANDSCAPE: 0,
  PORTRAIT: 1,
  ANY: 2
}

const getAspectRatio = (width, height) => {
  return width / height > 1 ? aspectRatios.LANDSCAPE : aspectRatios.PORTRAIT
}

export const isAspectRatio = (width, height, aspectRatio) => getAspectRatio(width, height) === aspectRatio

/**
 * initRef - React ref used to target and trim Legend labels
 * @param { number } width - width of chart container
 * @param { number } height - height of chart container
 * @param { html } node - Legend html node
 */
export const trimLegendLabel = legendLabelContainerWidth => node => {
  if (node !== null) {
    const text = Array.from(node.parentNode.children).find(tag => tag.tagName === 'text')
    if (text) {
      // set its original value as attribute, so that we don't keep repeating
      if (!text.getAttribute('og-key')) {
        text.setAttribute('og-key', text.innerHTML)
      }
      let original = text.getAttribute('og-key') || text.innerHTML

      let label = original
      if (legendLabelContainerWidth) {
        label = trimText(original, legendLabelContainerWidth)
      }
      text.innerHTML = label
    }
  }
}

// not object params to re-use in x/y axis
const getCommonAxisProps = (showAxisLegend, showAxisTicks, axisLegendLabel, legendOffset, displayFn = d => d) => ({
  tickSize: AXIS_TICK_WIDTH,
  tickPadding: AXIS_TICK_PADDING,
  legendHeight: LEGEND_HEIGHT,
  legendPosition: 'middle',
  legend: showAxisLegend ? axisLegendLabel : '',
  // TODO calculate a max width for each tick and trim
  // e.g. number of width / number of ticks
  format: (d) => showAxisTicks ? displayFn(d) : null,
  // legendOffset to position around the axis
  legendOffset,
})

export const getCommonProps = ({
  keys,
  height,
  width,
  axisBottomTrim = true,
  axisBottomLabelDisplayFn = d => d,
  axisBottomTickValues,
  axisBottomLabelCount,
  lastXAxisTickLabelWidth,
  axisBottomLegendLabel, // not for pie
  axisLeftLegendLabel, // not for pie
  axisLeftLabelDisplayFn = d => d,
  maxYAxisTickLabelWidth = 0,
  dash, // not for pie?
  legendProps = {},
}) => {
  const maxLegendLabelWidth = getLegendLabelMaxWidth(keys)
  const legendItemCount = keys.length

  const {
    showLegend,
    rightHandLegend,
    legendItemWidth,
    legendLabelContainerWidth,
    showBottomLegendLabel,
    showLeftLegendLabel,
    showBottomAxisTicks,
    showLeftAxisTicks,
    bottomLegendOffset,
    leftLegendOffset,
    legendTranslate,
    ...margin
  } = setChartMargin(width, height, maxLegendLabelWidth, legendItemCount, maxYAxisTickLabelWidth, lastXAxisTickLabelWidth)

  const chartWidth = width - margin.right - margin.left

  const aspectRatioProps = rightHandLegend ? ({
    anchor: 'right',
    direction: 'column',
    // NOTE: itemWidth doesn't affect right legend
    itemWidth: 0,
    translateX: legendTranslate,
    translateY: 0,
  }) : ({
    anchor: 'bottom-left',
    direction: 'row',
    itemWidth: legendItemWidth,
    translateX: 0,
    translateY: legendTranslate,
  })
  const symbolShape = nivoProps => <LegendCircle {...nivoProps} trimLegendLabel={trimLegendLabel(legendLabelContainerWidth)} />
  const legend = {
    itemHeight: LEGEND_HEIGHT,
    symbolSize: SYMBOL_SIZE,
    symbolSpacing: SYMBOL_SPACING,
    symbolShape,
    ...aspectRatioProps,
    ...legendProps,
  }

  return {
    margin,
    axisBottom: {
      tickValues: axisBottomTickValues,
      ...getCommonAxisProps(
        showBottomLegendLabel,
        showBottomAxisTicks,
        axisBottomLegendLabel,
        bottomLegendOffset,
        d => axisBottomTrim ? trimText(axisBottomLabelDisplayFn(d)+'', chartWidth / axisBottomLabelCount) : axisBottomLabelDisplayFn(d),
      ),
    },
    axisLeft: {
      orient: 'left',
      ...getCommonAxisProps(showLeftLegendLabel, showLeftAxisTicks, axisLeftLegendLabel, leftLegendOffset, axisLeftLabelDisplayFn),
    },
    legends: showLegend ? [legend] : [],
    theme: {
      fontSize: FONT_SIZE,
      // axis definition needed to display on top of the grid lines
      axis: {
        domain: {
          line: {
            stroke: 'black'
          }
        }
      },
      grid: {
        line: {
          stroke: '#dbdbdb',
          strokeWidth: 1,
          strokeDasharray: dash ? '5 5' : '' // only for line
        }
      }
    }
  }
}

const AGGREGATE_FN = {
  sum: (curr, val) => (curr || 0) + val,
  avg: (curr, val) => ({
    sum: (curr ? curr.sum : 0) + val,
    count: (curr ? curr.count : 0) + 1,
  }),
  max: (curr, val) => Math.max(curr === undefined ? val : curr, val),
  min: (curr, val) => Math.min(curr === undefined ? val : curr, val),
}

const aggregateDataByIndex = ({ indexBy, keys, data, type }) => {
  const aggregation = Object.values(data.reduce((agg, ele) => ({
    ...agg,
    [ele[indexBy]]: {
      [indexBy]: ele[indexBy],
      ...keys.reduce((ret, key) => {
        const curr = agg[ele[indexBy]] || {}
        ret[key] = AGGREGATE_FN[type](curr[key], ele[key])
        return ret
      }, {})
    }
  }), {}))
  if (type === 'avg') {
    // { [indexBy]: id, [key]: { sum, count } }
    // compute averages for each grouped result
    return aggregation.map(ele => ({
      ...ele,
      ...keys.reduce((ret, key) => {
        ret[key] = ele[key].sum / ele[key].count
        return ret
      }, {})
    }))
  }

  return aggregation
}

const aggregateDataByIndexGrouped = ({ indexBy, data, valueKey, groupByKey, type }) => Object.values(data.reduce((agg, ele, i) => {
  const id = ele[indexBy]
  if (!agg[id]) {
    agg[id] = {
      [indexBy]: id
    }
  }
  const finalKey = ele[groupByKey]
  agg[id][finalKey] = AGGREGATE_FN[type](agg[id][finalKey] || null, ele[valueKey])
  if (i === data.length - 1 && type === 'avg') {
    // compute average for last item
    agg[id][finalKey] /= data.length
  }
  return agg
}, {}))

export const aggregateData = ({ indexBy, data, keys, valueKey, groupByKey = '', type }) => {
  if (groupByKey.length) return aggregateDataByIndexGrouped({ indexBy, data, valueKey, groupByKey, type })
  return aggregateDataByIndex({ indexBy, keys, data, type })
}

export const processDataKeys = ({ indexBy = '', keys = [], groupByKey = '', data }) => {
  let finalIndexBy
  let finalKeys

  finalIndexBy = indexBy.length ? indexBy : Object.keys(data[0])[0]
  if (!groupByKey.length) {
    // remove indexBy from keys
    finalKeys = keys.length ? keys : Object.keys(omit(data[0], finalIndexBy))
  } else {
    // unique values of groupByKey
    finalKeys = Object.keys(data.reduce((agg, ele) => {
      agg[ele[groupByKey]] = true
      return agg
    }, {}))
  }

  return {
    finalKeys,
    finalIndexBy,
  }
}

// TODO: enforce validity of key combinations, e.g. providing no xKey and setting indexBy to keys[1]
export const processSeriesDataKeys = ({ indexBy = '', xKey = '', yKeys = [], data, indexByValue }) => {
  let finalIndexBy
  let finalXKey
  let finalYKeys
  const keys = Object.keys(data[0])
  if (indexByValue) {
    // requries an indexBy and only 1 yKey
    finalIndexBy = indexBy.length ? indexBy : keys[0]
    finalXKey = xKey.length ? xKey : keys[1]
    finalYKeys = yKeys.length ? yKeys : [keys[2]]
  } else {
    // one xKey and use the rest as yKeys
    finalXKey = xKey.length ? xKey : keys[0]
    finalYKeys = yKeys.length ? yKeys : keys.slice(1)
  }

  return {
    finalIndexBy,
    finalXKey,
    finalYKeys,
  }
}

// TODO: function for summing together values e.g. duplicate x/y combinations
// export const processUniqueData

// convert flat array { indexBy: 'value', ...rest }
// to grouped by unique indexBy value
// i.e. [{ id: 'value1', data: [{ ...rest }] }]
const convertDataToNivoByValue = ({ data, xKey, yKey, indexBy }) => Object.values(data.reduce((ret, ele) => {
  const id = ele[indexBy]
  if (!ret[id]) {
    ret[id] = { id, data: [] }
  }
  ret[id].data.push({ x: ele[xKey], y: ele[yKey] })
  return ret
}, {}))

// convert flat array { yKey1: value, yKey2: value, ...rest }
// to grouped by unique yKeys
// i.e. [{ id: yKey1, data: [] }, { id: yKey2, data: [] }]
const convertDataToNivoByKeys = ({ data, xKey, yKeys }) => Object.values(data.reduce((ret, ele) => {
  // generate an entry for each yKey
  yKeys.forEach(yKey => {
    const id = yKey
    if (!ret[id]) {
      ret[id] = { id, data: [] }
    }
    ret[id].data.push({ x: ele[xKey], y: ele[yKey] })
  })

  return ret
}, {}))

export const convertDataToNivo = ({ data, xKey, yKeys, indexBy, indexByValue }) => {
  if (indexByValue) return convertDataToNivoByValue({ data, xKey, yKey: yKeys[0], indexBy })
  return convertDataToNivoByKeys({ data, xKey, yKeys })
}

const COLOR_METHODS = {
  'random': num => {
    const colors = Object.values(designSystemColors)
    return new Array(num).fill(0).map(() => colors[Math.floor(Math.random() * colors.length)])
  },
  'monochromatic': (num, hue = 'blue') => {
    // return all values for keys that have `${hue}xx`
    // repeat if necessary
    let finalHue = hues.includes(hue) ? hue : 'blue'
    const colors = Object.keys(designSystemColors).filter(o => o.indexOf(finalHue) >= 0)
    return new Array(num).fill(0).map((_, i) => designSystemColors[colors[i % colors.length]])
  },
  'palette': (num, lightness = 30) => {
    // return all values for keys that have `hue${lightness}`
    // repeat if necessary
    let finalLightness = lightnesses.includes(lightness) ? lightness : 30
    const colors = Object.keys(designSystemColors).filter(o => o.indexOf(finalLightness) >= 0)
    return new Array(num).fill(0).map((_, i) => designSystemColors[colors[i % colors.length]])
  },
}

export const processColors = (numberOfColors, type, param) => {
  let finalType = type
  if (!COLOR_METHODS[type]) {
    finalType = 'palette'
  }
  return COLOR_METHODS[finalType](numberOfColors, param)
}

// enforce and order for string axis (Bar or xScale.type === 'point')
// Nivo uses the order of keys in data, so we have to sort
export const processAxisOrder = ({ data, axisBottomOrder, finalIndexBy }) => {
  if (!axisBottomOrder.length) return data
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

// data structure of "Nivo" { id, data } requires different sorting
export const processAxisOrderNivo = ({ unsortedData, axisBottomOrder }) => unsortedData.map(({ data, id }) => ({
  id,
  data: processAxisOrder({ data, axisBottomOrder, valueKey: 'x' }),
}))
