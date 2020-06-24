import React from 'react'
import {
  WIDTH_BREAKPOINT_0,
  WIDTH_BREAKPOINT_1,
  WIDTH_BREAKPOINT_2,
  WIDTH_BREAKPOINT_3,
  HEIGHT_BREAKPOINT_1,
  HEIGHT_BREAKPOINT_2,
  HEIGHT_BREAKPOINT_3,
  LEGEND_HEIGHT,
  TEXT_HEIGHT,
  AXIS_LABEL_TICKS,
  AXIS_LEGEND_WIDTH,
  BUFFER,
  TRIMMED_LEGEND_WIDTH,
  LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH,
  LEGEND_ROW_FIXED_ELEMENTS_WIDTH,
} from '../constants/dimensions'

import LegendCircle from '../../components/legend-symbol'

// currently values are the same except for PIE
/*
top = 5
right = 140
bottom = 86
left = 20

right = 6
right = 8

bottom = 15
bottom = 20
bottom = 63

left = 8
left = 80
left = 80
*/

// given a font size, we want to calculate the dimensions of the chart
// the margin is the amount of space that the left axis ticks/legend, right legend or bottom axis ticks/legend AND legend have
// the margins should be the size of these elements + spacing

/**
 * setChartMargin - sets the values of the chart margins
 * @param { number } width - width of the chart conatiner (ChartInner)
 * @param { number } heigth - height of the chart conatiner (ChartInner)
 * @param { number } maxLegendLabelWidth - maximum length of a label/key text in the legend
 * @param { number } legendItemCount - number of items in the legend
 * @returns { object } - top, right, bottom, left values
 */
const setChartMargin = (width, height, maxLegendLabelWidth, legendItemCount) => {
  // default values
  const top = 5
  // TO DO: adjust default value to include dynamically the last tick label on the x-axis
  let right = BUFFER


  let bottom = 15
  let showBottomLegendLabel
  let bottomLegendOffset = TEXT_HEIGHT + AXIS_LABEL_TICKS
  let showBottomAxisTicks

  if (height >= HEIGHT_BREAKPOINT_2) {
    showBottomAxisTicks = true
    showBottomLegendLabel = true
    bottomLegendOffset += 2 * BUFFER
    bottom = 63
  } else if (height >= HEIGHT_BREAKPOINT_1) {
    showBottomLegendLabel = true
    bottomLegendOffset += 2 * BUFFER
    bottom = 38
  }

  const rightHandLegend = isAspectRatio(width, height, aspectRatios.LANDSCAPE) || legendItemCount > 3
  let showLegend = width >= WIDTH_BREAKPOINT_3
  if (!rightHandLegend) {
    // showLegend = height > 100
    showLegend = height > HEIGHT_BREAKPOINT_1
  }
  let legendLabelContainerWidth
  let legendItemWidth

  if (showLegend) {
    // adjust right or bottom margin accordingly
    if (rightHandLegend) {
      /*
        if (width >= WIDTH_BREAKPOINT_3) {
          labelContainer = width - WIDTH_BREAKPOINT_3 + TRIMMED_LEGEND_WIDTH
        } else {
          labelContainer = 0
        }
      */
      // NOTE: affects an empty <rect> in landscape, that seems to conflict with translateX
      legendItemWidth = 0
      // default is different between current and required space, enforce a minimum
      // increase the right margin until it fits the longest label
      legendLabelContainerWidth = Math.max(width - WIDTH_BREAKPOINT_3, TRIMMED_LEGEND_WIDTH)
      if (width - WIDTH_BREAKPOINT_3 >= LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH + maxLegendLabelWidth) {
        legendLabelContainerWidth = maxLegendLabelWidth
      }
      right = legendLabelContainerWidth + LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH
    } else {
      // NOTE: originally applied with below
      // itemWidth: width < WIDTH_BREAKPOINT_3 ? (WIDTH_BREAKPOINT_0 - BUFFER) / 3 : setLegendItemWidth(width)
      // TODO: breakdown below
      legendItemWidth = 69
      if (width > WIDTH_BREAKPOINT_2) {
        // we have to take out right axis label height which pushes the row/bottom legend to the right
        // when ticks labels are added after WIDTH_BREAKPOINT_2
        // BUFFER is added in translateX in the Legend props
        legendItemWidth += (width - WIDTH_BREAKPOINT_0 - TEXT_HEIGHT - BUFFER) / 3
      } else if (width > WIDTH_BREAKPOINT_0) {
        legendItemWidth += (width - WIDTH_BREAKPOINT_0) / 3
      }
      // itemWidth - 14
      // QUESTION: difference between itemWidth and legendLabelContainer
      /*
        if (width >= WIDTH_BREAKPOINT_3) {
          labelContainer = setLegendItemWidth(width) - LEGEND_ROW_FIXED_ELEMENTS_WIDTH
        } else {
          labelContainer = 72 - LEGEND_ROW_FIXED_ELEMENTS_WIDTH
        }
        // MY
        // labelContainer = setLegendItemWidth(width) - LEGEND_ROW_FIXED_ELEMENTS_WIDTH
      */
      // adjust bottom
      bottom += LEGEND_HEIGHT + BUFFER
    }
  }

  // default is smallest
  let left = AXIS_LABEL_TICKS
  let showLeftLegendLabel // hide <BP1
  let leftLegendOffset = -(2 * BUFFER)
  let showLeftAxisTicks // show <BP2

  // TODO handle axis ticks
  if (width >= WIDTH_BREAKPOINT_2) {
    showLeftAxisTicks = true
    showLeftLegendLabel = true
    leftLegendOffset -= AXIS_LEGEND_WIDTH + BUFFER
    // QUESTION why is AXIS_LEGEND_WIDTH 25? 17 + 8?
    left += 2 * BUFFER + LEGEND_HEIGHT + AXIS_LEGEND_WIDTH
  } else if (width >= WIDTH_BREAKPOINT_1) {
    showLeftLegendLabel = true
    left += 2 * BUFFER + LEGEND_HEIGHT
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
  tickSize: AXIS_LABEL_TICKS,
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
    legendItemWidth,
    ...margin
  } = setChartMargin(width, height, maxLegendLabelWidth, legendItemCount)

  const chartWidth = width - margin.right
  // TODO tinker with max number of row legend elements
  // split based on the number and trim accordingly
  // const itemWidth = width < WIDTH_BREAKPOINT_3 ? (WIDTH_BREAKPOINT_0 - BUFFER) / 3 : legendItemWidth
  const itemWidth = width / 5 // size of label or whole item?
  // also trim to match
  // TODO handle translateX and translateY
  const aspectRatioProps = rightHandLegend ? ({
    anchor: 'right',
    direction: 'column',
    translateX: 14,
    translateY: 0,
  }) : ({
    anchor: 'bottom',
    direction: 'row',
    translateX: BUFFER,
    translateY: 74,
  })

  const symbolShape = nivoProps => <LegendCircle {...nivoProps} trimLegendLabel={trimLegendLabel(legendLabelContainerWidth)} />
  const legend = {
    itemHeight: LEGEND_HEIGHT,
    symbolSize: 8,
    symbolSpacing: 6,
    symbolShape,
    itemWidth: legendItemWidth,
    ...aspectRatioProps,
    ...legendProps,
  }
  // isLess(dimension, breakpointTwo) ? offsets[0] : offsets[1]

  return {
    data,
    margin,
    axisBottom: {
      tickValues,
      ...getCommonAxisProps(height, showBottomLegendLabel, showBottomAxisTicks, axisBottomLegendLabel, bottomLegendOffset, d => trimText(d+'', chartWidth / data.length)),
    },
    axisLeft: {
      orient: 'left',
      ...getCommonAxisProps(width, showLeftLegendLabel, showLeftAxisTicks, axisLeftLegendLabel, leftLegendOffset, d => d * 100000),
    },
    legends: showLegend ? [legend] : [],
    theme: {
      fontSize: 12,
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
