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
  let bottom = 86
  let left = 63

  /*
  let itemWidth = 69
  if (width > WIDTH_BREAKPOINT_2) {
    // we have to take out right axis label height which pushes the row/bottom legend to the right
    // when ticks labels are added after WIDTH_BREAKPOINT_2
    // BUFFER is added in translateX in the Legend props
    itemWidth = itemWidth + (width - WIDTH_BREAKPOINT_0 - TEXT_HEIGHT - BUFFER) / 3
  } else if (width > WIDTH_BREAKPOINT_0) {
    itemWidth = itemWidth + (width - WIDTH_BREAKPOINT_0) / 3
  }
  return itemWidth
  */

  let showBottomLegendLabel = true
  let showBottomAxisTicks = true
  let bottomLegendOffset = 39
  // TODO convert the breakpoint conditions to be > for consistency?
  if (height < HEIGHT_BREAKPOINT_1) {
    showBottomLegendLabel = false
    showBottomAxisTicks = false
    bottomLegendOffset = 23
    bottom = 15
  } else if (height < HEIGHT_BREAKPOINT_2) {
    showBottomAxisTicks = false
    bottomLegendOffset = 23
    bottom = 38
  } else if (height < HEIGHT_BREAKPOINT_3) {
    bottom = 63
  }

  const rightHandLegend = isAspectRatio(width, height, aspectRatios.LANDSCAPE) || legendItemCount > 3
  let showLegend = width >= WIDTH_BREAKPOINT_3
  if (!rightHandLegend) {
    showLegend = height > 100
  }
  let legendLabelContainerWidth
  let legendItemWidth

  if (showLegend) {
    // adjust right or bottom margin accordingly
    if (rightHandLegend) {
      // default is different between current and required space
      legendLabelContainerWidth = width - WIDTH_BREAKPOINT_3 + TRIMMED_LEGEND_WIDTH
      if (width - WIDTH_BREAKPOINT_3 >= LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH + maxLegendLabelWidth) {
        legendLabelContainerWidth = maxLegendLabelWidth
      }
      // increase the right margin by a fixed width until it fits the longest label
      right = legendLabelContainerWidth + LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH
    } else {
      // adjust bottom
      bottom += LEGEND_HEIGHT + 8 // fixed spacing of legend?
    }
  }

  let showLeftLegendLabel = true // isLess(width, BP_1) ? false : true
  let showLeftAxisTicks = true // isLess(width, BP_2) ? false : true
  let leftLegendOffset = -48 //isLess(width, BP_2) ? -15 : 48

  // // default is smallest i.e. 0 -> 1
  // // things change as it gets bigger
  // if (width > WIDTH_BREAKPOINT_3) {
  //   // 3+
  // } else if (width > WIDTH_BREAKPOINT_2) {
  //   // 2 -> 3
  // } else if (width > WIDTH_BREAKPOINT_1) {
  //   // 1 -> 2
  // }

  // default is largest i.e. 3+
  // things change as it gets smaller
  // TODO handle label ticks
  if (width < WIDTH_BREAKPOINT_1) {
    // 0 -> 1
    showLeftLegendLabel = false
    showLeftAxisTicks = false
    leftLegendOffset = -15
    // BUFFER = 8 is the width of vertical axis ticks that need to fit on the side of the chart
    left = BUFFER
  } else if (width < WIDTH_BREAKPOINT_2) {
    // 1 -> 2
    showLeftAxisTicks = false
    leftLegendOffset = -15
    // 41 = 8(ticks) + 8(space) + 17(height of axis label) + 8(space to margin)
    left = BUFFER + 8 + 8 + LEGEND_HEIGHT
  } else if (width < WIDTH_BREAKPOINT_3) {
    // 2 -> 3
    // TODO why extra margin?
    left = BUFFER + 8 + 8 + LEGEND_HEIGHT + 25
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
const trimText = (text, containerWidth) => {
  let font = '12px noto sans'
  let n = text.length - 1
  let textWidth = getTextSize(text.substr(0, n) + '...', font)
  if (textWidth <= containerWidth) {
    text = text.substr(0, n) + '...'
  } else {
    text = trimText(text.substr(0, n), containerWidth)
  }
  return text
}

/**
 * setLegendItemWidth - sets the itemWidth of the row / bottom legend
 * @param { number } width - width of the chart container (ChartInner)
 * @returns { number } - itemWidth's length in pixels
 */
// a legend item = buffers, symbol, and keys
const setLegendItemWidth = (width) => {
  let itemWidth = 69
  if (width > WIDTH_BREAKPOINT_2) {
    /* we have to take out right axis label height which pushes the row/bottom legend to the right
     * when ticks labels are added after WIDTH_BREAKPOINT_2
     * BUFFER is added in translateX in the Legend props
     */
    itemWidth = itemWidth + (width - WIDTH_BREAKPOINT_0 - TEXT_HEIGHT - BUFFER) / 3
  } else if (width > WIDTH_BREAKPOINT_0) {
    itemWidth = itemWidth + (width - WIDTH_BREAKPOINT_0) / 3
  }
  return itemWidth
}

export const aspectRatios = {
  LANDSCAPE: 0,
  PORTRAIT: 1,
  ANY: 2
}

const getAspectRatio = (width, height) => {
  return width / height > 1 ? aspectRatios.LANDSCAPE : aspectRatios.PORTRAIT
}

export const isAspectRatio = (width, height, aspectRatio) => {
  const componentAspectRatio = getAspectRatio(width, height)

  return componentAspectRatio === aspectRatio
}

/**
 * initRef - React ref used to target and trim Legend labels
 * @param { number } width - width of chart container
 * @param { number } height - height of chart container
 * @param { html } node - Legend html node
 */
export const trimLegendLabel = ({ legendLabelContainerWidth }) => node => {
  if (node !== null) {
    const text = Array.from(node.parentNode.children).find(tag => tag.tagName === 'text')
    if (text) {
      // set its original value as attribute, so that we don't keep repeating
      if (!text.getAttribute('og-key')) {
        text.setAttribute('og-key', text.innerHTML)
      }
      let original = text.getAttribute('og-key') || text.innerHTML
      // need to only measure length of the key without the '..'
      if (original.endsWith('..')) {
        original = original.split('..')[0]
      }
      let labelWidth = getTextSize(original, '12px noto sans')

      let label = original
      if (legendLabelContainerWidth && (labelWidth > legendLabelContainerWidth)) {
        label = trimText(original, legendLabelContainerWidth)
      }
      text.innerHTML = label
    }
  }
}

const getCommonAxisProps = (dimension, showAxisLegend, showAxisTicks, axisLegendLabel, legendOffset) => ({
  tickSize: 8,
  legendHeight: LEGEND_HEIGHT,
  legendPosition: 'middle',
  legend: showAxisLegend ? axisLegendLabel : '',
  // we hide tick labels up to a certain height
  format: (d) => showAxisTicks ? d : null,
  // legendOffset -15 places label by the ticks
  legendOffset,
})

const getLabelContainerWidth = ({ width, height }) => {
  // MY SOLUTION
  // let labelContainer = isAspectRatio(width, height, aspectRatios.LANDSCAPE) ?
  //   ((width >= WIDTH_BREAKPOINT_3) ?
  //     width - WIDTH_BREAKPOINT_3 + TRIMMED_LEGEND_WIDTH :
  //     0):
  //   setLegendItemWidth(width, height) - LEGEND_ROW_FIXED_ELEMENTS_WIDTH

  // Do's design
  return isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? TRIMMED_LEGEND_WIDTH :
      ((width >= WIDTH_BREAKPOINT_3) ?
        setLegendItemWidth(width, height) - LEGEND_ROW_FIXED_ELEMENTS_WIDTH :
        72 - LEGEND_ROW_FIXED_ELEMENTS_WIDTH)
}

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
  const labelContainer = getLabelContainerWidth({ width, height })
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
  } = setChartMargin(width, height, maxLegendLabelWidth, legendItemCount)

  const aspectRatioProps = (isAspectRatio(width, height, aspectRatios.LANDSCAPE) || legendItemCount > 3) ? ({
    anchor: 'right',
    direction: 'column',
    itemWidth: 0,
    translateX: 14,
    translateY: 0,
  }) : ({
    anchor: 'bottom',
    direction: 'row',
    itemWidth: width < WIDTH_BREAKPOINT_3 ? (WIDTH_BREAKPOINT_0 - BUFFER) / 3 : setLegendItemWidth(width),
    translateX: BUFFER,
    translateY: 74,
  })

  const symbolShape = nivoProps => <LegendCircle {...nivoProps} legendLabelContainerWidth={legendLabelContainerWidth} />
  const legend = {
    itemHeight: LEGEND_HEIGHT,
    symbolSize: 8,
    symbolSpacing: 6,
    symbolShape,
    ...aspectRatioProps,
    ...legendProps,
  }
  // isLess(dimension, breakpointTwo) ? offsets[0] : offsets[1]

  return {
    data,
    margin,
    axisBottom: {
      tickValues,
      ...getCommonAxisProps(height, showBottomLegendLabel, showBottomAxisTicks, axisBottomLegendLabel, bottomLegendOffset),
    },
    axisLeft: {
      orient: 'left',
      ...getCommonAxisProps(width, showLeftLegendLabel, showLeftAxisTicks, axisLeftLegendLabel, leftLegendOffset),
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
