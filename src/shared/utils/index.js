import React from 'react'
import {
  // WIDTH_BREAKPOINT_0,
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
  TRIMMED_LEGEND_WIDTH,
  LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH,
  // LEGEND_ROW_FIXED_ELEMENTS_WIDTH,
} from '../constants/dimensions'

import LegendCircle from '../../components/legend-symbol'

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

  const rightHandLegend = isAspectRatio(width, height, aspectRatios.LANDSCAPE) || legendItemCount > 3
  let showLegend = width >= WIDTH_BREAKPOINT_3
  if (!rightHandLegend) {
    // row/bottom legend appears only after chart height >= HEIGHT_BREAKPOINT_3
    showLegend = height >= HEIGHT_BREAKPOINT_3
  }
  let legendLabelContainerWidth
  let legendItemWidth

  if (showLegend) {
    // adjust right or bottom margin accordingly
    if (rightHandLegend) {
      // default is different between current and required space
      // enforce a minimum
      // increase the right margin until it fits the longest label
      legendLabelContainerWidth = Math.max(width - WIDTH_BREAKPOINT_3, TRIMMED_LEGEND_WIDTH)
      if (width - WIDTH_BREAKPOINT_3 >= LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH + maxLegendLabelWidth) {
        legendLabelContainerWidth = maxLegendLabelWidth
      }
      right = legendLabelContainerWidth + LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH
    } else {
      // adjust bottom to include legend and a buffer
      bottom += LEGEND_HEIGHT + BUFFER
    }
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
  }
}

/**
 * getLastXAxisTickLabelWidth - gets the last (rightmost) x-axis tick value width in pixels
 * @param { array } data - data array
 * @returns { number } - the width of the last (rightmost) x-axis tick value width in pixels
 */
const getLastXAxisTickLabelWidth = (data) => {
  // TO DO: replace .data with .x for new data structure
  if (data[0].data) {
    return getTextSize(data[0].data[data.length - 1].x, '12px noto sans')
  // TO DO: below whould be the place to deal with bar-chart long labels but I feel now it is too
  // complex, it works fine for the examples we have, need to test more
  } else return 0
}

/**
 * getMaxYAxisTickLabelWidth - gets the width in pixels of the highest y value in the array
 * @param { array } data - data array
 * @returns { number } - the width in pixels of the highest y value in the array
 */
const getMaxYAxisTickLabelWidth = (data) => {
  if (data[0].data) {
    return getTextSize(
      // TO DO: remove a reduce layer for the new data structure
      data.reduce((max, dataSet) =>
        dataSet.data.reduce((max, dataSet1) =>
          Math.max(max, dataSet1.y), 0), 0), '12px noto sans')
  } else if (!data[0].value) {
    return getTextSize(
      data.reduce((max, dataSet) =>
        Math.max(max, ...Object.values(dataSet).filter(value => typeof(value) === 'number'))
      ,0), '12px noto sans')
  } else return 0
}

/**
 * getLegendLabelMaxWidth - calculates the width of the longest label text in the legend
 * @param { array } data - data array
 * @returns { number } - the width of the longest label text in the legend
 */
// TODO support all datasets
// NEEDS TO ONLY BE ACTIVE KEYS
// every data type should be converted to indexOf + keys then we always know activeKeys
const getLegendLabelMaxWidth = (data) => data.reduce((max, dataSet) =>
  Math.max(max, getTextSize(dataSet.id, '12px noto sans')), 0)

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
    text = text.substr(0, n) + suffix
  } else {
    text = trimText(text.substr(0, n - 1), containerWidth, count + 1)
  }
  return text
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

      let labelWidth = getTextSize(original, '12px noto sans')

      let label = original
      if (labelWidth > legendLabelContainerWidth) {
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
  // we hide tick labels up to a certain height
  // TODO calculate a max width for each tick and trim
  // e.g. number of width / number of ticks
  format: (d) => showAxisTicks ? displayFn(d) : null,
  // legendOffset to position around the axis
  legendOffset,
})

export const getCommonProps = ({
  data,
  height,
  width,
  axisBottomLegendLabel, // not for pie
  axisLeftLegendLabel, // not for pie
  dash, // not for pie?
  tickValues, // not for pie
  legendProps = {},
}) => {

  const maxLegendLabelWidth = getLegendLabelMaxWidth(data)
  const legendItemCount = data.length
  // TODO currrently unused
  // const labelContainer = getLabelContainerWidth({ width, height })

  // calculate the last x-axis tick label with in pixels
  const lastXAxisTickLabelWidth = getLastXAxisTickLabelWidth(data)
  // calculate the longest y-axis tick label width in pixels
  const maxYAxisTickLabelWidth = getMaxYAxisTickLabelWidth(data)

  const {
    showLegend,
    rightHandLegend,
    legendLabelContainerWidth,
    showBottomLegendLabel,
    showLeftLegendLabel,
    showBottomAxisTicks,
    showLeftAxisTicks,
    bottomLegendOffset,
    leftLegendOffset,
    ...margin
  } = setChartMargin(width, height, maxLegendLabelWidth, legendItemCount, maxYAxisTickLabelWidth, lastXAxisTickLabelWidth)

  const chartWidth = width - margin.right
  // TODO tinker with max number of row legend elements
  // split based on the number and trim accordingly
  // const itemWidth = width < WIDTH_BREAKPOINT_3 ? (WIDTH_BREAKPOINT_0 - BUFFER) / 3 : legendItemWidth
  const itemWidth = width / 5 // size of label or whole item?
  const translateX = 0
  const aspectRatioProps = rightHandLegend ? ({
    anchor: 'right',
    direction: 'column',
    // TODO how are below set?
    itemWidth: 0,
    translateX: 14,
    translateY: 0,
  }) : ({
    anchor: 'bottom',
    direction: 'row',
    itemWidth,
    // translateX: BUFFER,
    translateX,
    translateY: LEGEND_HEIGHT + AXIS_TICK_WIDTH + 2 * TEXT_HEIGHT + 3 * BUFFER,
  })

  const symbolShape = nivoProps => <LegendCircle {...nivoProps} trimLegendLabel={trimLegendLabel(rightHandLegend ? legendLabelContainerWidth : itemWidth - 14)} />
  const legend = {
    itemHeight: LEGEND_HEIGHT,
    symbolSize: SYMBOL_SIZE,
    symbolSpacing: 6,
    symbolShape,
    ...aspectRatioProps,
    ...legendProps,
  }

  return {
    data,
    margin,
    axisBottom: {
      tickValues,
      ...getCommonAxisProps(height, showBottomLegendLabel, showBottomAxisTicks, axisBottomLegendLabel, bottomLegendOffset, d => trimText(d+'', chartWidth / data.length)),
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
