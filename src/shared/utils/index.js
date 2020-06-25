import React from 'react'
import { omit } from 'lodash'
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
  LEGEND_MARGIN,
  TRIMMED_LEGEND_WIDTH,
  LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH,
  LEGEND_ROW_FIXED_ELEMENTS_WIDTH,
} from '../constants/dimensions'
import designSystemColors from '../constants/design-system-colors'

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
  const top = SYMBOL_SIZE / 2 + 1
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
      legendTranslate = LEGEND_MARGIN
      legendLabelContainerWidth = Math.max(width - WIDTH_BREAKPOINT_3 - LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH, TRIMMED_LEGEND_WIDTH)
      if (width - WIDTH_BREAKPOINT_3 >= LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH + maxLegendLabelWidth) {
        legendLabelContainerWidth = maxLegendLabelWidth
      }
      right = legendLabelContainerWidth + LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH
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

/**
 * getLastXAxisTickLabelWidth - gets the last (rightmost) x-axis tick value width in pixels
 * @param { array } data - data array
 * @returns { number } - the width of the last (rightmost) x-axis tick value width in pixels
 */
const getLastXAxisTickLabelWidth = ({ data, xKey, isNumeric }) => {
  const sorted = [...data]
  // TODO: no longer need string trimming, handled by axis label trimming
  sorted.sort((a, b) => {
    if (isNumeric) return a[xKey] - b[xKey]
    if (a[xKey] < b[xKey]) {
      return -1
    } else if (a[xKey] > b[xKey]) {
      return 1
    }
    return 0
  })
  // TO DO: below whould be the place to deal with bar-chart long labels but I feel now it is too
  // complex, it works fine for the examples we have, need to test more
  return getTextSize(sorted[sorted.length - 1][xKey], '12px noto sans')
}

/**
 * getMaxYAxisTickLabelWidth - gets the width in pixels of the highest y value in the array
 * @param { array } data - data array
 * @returns { number } - the width in pixels of the highest y value in the array
 */
// TODO handle stacked case
// max of sum of all keys
const getMaxYAxisTickLabelWidth = ({ data, yKeys }) => getTextSize(
  data.reduce((max, row) => Math.max(max, ...yKeys.map(yKey => row[yKey])), 0),
  '12px noto sans'
)

/**
 * getLegendLabelMaxWidth - calculates the width of the longest label text in the legend
 * @param { array } key - array of keys that will be in the legend
 * @returns { number } - the width of the longest label text in the legend
 */
const getLegendLabelMaxWidth = (keys) => keys.reduce((max, key) =>
  Math.max(max, getTextSize(key, '12px noto sans')), 0)

/**
 * getTextSize - calculates a rendered text width in pixels
 * @param { string } text - a text string
 * @param { string } font - a string with the font included ex: '12px noto sans'
 * @returns { number } - the width of the rendered text in pixels
 */
const getTextSize = (text, font) => {
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
  let font = '12px noto sans'
  let n = text.length
  const suffix = count ? TRIM : ''
  let textWidth = getTextSize(text.substr(0, n) + suffix, font)
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

const getCommonAxisProps = (dimension, showAxisLegend, showAxisTicks, axisLegendLabel, legendOffset, displayFn = d => d) => ({
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
  data,
  keys,
  yKeys,
  xKey,
  // NOTE: switch to sort xAxis labels
  // to get the furthest right
  isNumeric,
  height,
  width,
  // NOTE pie chart has diverged significantly
  hasAxis = true,
  axisBottomLegendLabel, // not for pie
  axisLeftLegendLabel, // not for pie
  dash, // not for pie?
  legendProps = {},
}) => {
  const maxLegendLabelWidth = getLegendLabelMaxWidth(keys)
  const legendItemCount = keys.length
  // calculate the last x-axis tick label width in pixels
  const lastXAxisTickLabelWidth = hasAxis ? getLastXAxisTickLabelWidth({ data, xKey, isNumeric }) : 0
  // calculate the longest y-axis tick label width in pixels
  const maxYAxisTickLabelWidth = hasAxis ? getMaxYAxisTickLabelWidth({ data, yKeys }) : 0

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
  const xAxisLabelCount = 3 // TODO: how to configure this? Right now it is automatic
  // bar chart is unique values of indexBy
  // any non-numeric uses unique values, otherwise you specify tickValues
  // what about continous axes?

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
      ...getCommonAxisProps(height, showBottomLegendLabel, showBottomAxisTicks, axisBottomLegendLabel, bottomLegendOffset, d => trimText(d+'', chartWidth / xAxisLabelCount)),
    },
    axisLeft: {
      orient: 'left',
      ...getCommonAxisProps(width, showLeftLegendLabel, showLeftAxisTicks, axisLeftLegendLabel, leftLegendOffset, d => d),
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

export const processDataKeys = ({ indexBy, keys, data }) => {
  // remove indexBy from keys
  const finalIndexBy = indexBy.length ? indexBy : Object.keys(data[0])[0]
  const finalKeys = keys.length ? keys : Object.keys(omit(data[0], finalIndexBy))
  return {
    finalKeys,
    finalIndexBy,
  }
}

export const processSeriesDataKeys = ({ indexBy, xKey, yKey, data }) => {
  // remove indexBy and assign colors
  const finalIndexBy = indexBy.length ? indexBy : Object.keys(data[0])[0]
  const finalXKey = xKey.length ? xKey : Object.keys(data[0])[1]
  const finalYKey = yKey.length ? yKey : Object.keys(data[0])[2]

  return {
    finalIndexBy,
    finalXKey,
    finalYKey,
  }
}

// convert flat array { indexBy: 'value', ...rest }
// to grouped by unique indexBy value
// i.e. [{ id: 'value1', data: [{ ...rest }] }]
export const convertDataToNivo = ({ data, indexBy, xKey, yKey }) => Object.values(data.reduce((ret, ele) => {
  const id = ele[indexBy]
  if (!ret[id]) {
    ret[id] = { id, data: [] }
  }
  ret[id].data.push({ x: ele[xKey], y: ele[yKey] })
  return ret
}, {}))

const COLOR_METHODS = {
  'random': num => {
    const colors = Object.values(designSystemColors)
    return new Array(num).fill(0).map(() => colors[Math.floor(Math.random() * colors.length)])
  },
  'monochromatic': (num, hue) => {
    // return all values for keys that have `${hue}xx`
    // repeat if necessary
    const colors = Object.keys(designSystemColors).filter(o => o.indexOf(hue) >= 0)
    return new Array(num).fill(0).map((_, i) => designSystemColors[colors[i % colors.length]])
  },
  'palette': (num, lightness) => {
    // return all values for keys that have `hue${lightness}`
    // repeat if necessary
    const colors = Object.keys(designSystemColors).filter(o => o.indexOf(lightness) >= 0)
    return new Array(num).fill(0).map((_, i) => designSystemColors[colors[i % colors.length]])
  },
}

export const processColors = (numberOfColors, type, param) => COLOR_METHODS[type](numberOfColors, param)
