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
  AXIS_TICK_WIDTH,
  BUFFER,
  SYMBOL_SIZE,
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
const setChartMargin = (width, height, maxLegendLabelWidth, legendItemCount, maxYAxisTickLabelWidth, lastXAxisTickLabelWidth) => {
  // default values
  const top = 5
  // when no other elements present to the right of the chart, the margin has to fit half of possible chart symbols that are placed on the margin of the chart
  let right = SYMBOL_SIZE / 2 + 1
  let bottom = 0
  // let bottom = 86
  // left - we need to have the minimum space to fit the axis tick labels
  let left = AXIS_TICK_WIDTH

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
  // hard coded -6 places the bottom axis legend the same distance from the tick labels as the left axis legend is form the left axis tick labels
  // it depends on the tickPadding set in the legend which now it is 8 = the tick labels are 8px away from the axis ticks
  let bottomLegendOffset = 1.5 * TEXT_HEIGHT + AXIS_TICK_WIDTH + 2 * BUFFER - 6

  if (height >= HEIGHT_BREAKPOINT_3) {
    bottom = AXIS_TICK_WIDTH + 4 * BUFFER + 3 * TEXT_HEIGHT
  } else if (height >= HEIGHT_BREAKPOINT_2) {
    bottom = AXIS_TICK_WIDTH + 3 * BUFFER + 2 * TEXT_HEIGHT
  } else if (height >= HEIGHT_BREAKPOINT_1) {
    showBottomAxisTicks = false
    bottomLegendOffset = TEXT_HEIGHT / 2 + AXIS_TICK_WIDTH + BUFFER
    bottom = AXIS_TICK_WIDTH + 2 * BUFFER + TEXT_HEIGHT
  } else if (height < HEIGHT_BREAKPOINT_1) {
    showBottomLegendLabel = false
    showBottomAxisTicks = false
    bottom = AXIS_TICK_WIDTH + BUFFER
  }

  const rightHandLegend = isAspectRatio(width, height, aspectRatios.LANDSCAPE) || legendItemCount > 3
  let showLegend = width >= WIDTH_BREAKPOINT_3
  if (!rightHandLegend) {
    // showLegend = height > 100
    showLegend = height > HEIGHT_BREAKPOINT_1
  }
  let legendLabelContainerWidth
  let legendItemWidth

  /** at HEIGHT_BREAKPOINT_2 the x-axis ticks appear in the chart, therefore, the right margin
  * has to adjust to include just over half of the last x-axis tick lable width
  */
  if (height >= HEIGHT_BREAKPOINT_2) {
    right = Math.max(right, lastXAxisTickLabelWidth * 0.6)
  }

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
      // deleted below as we take care of it above when we set bottom
    // } else {
      // adjust bottom
      // bottom += LEGEND_HEIGHT + 8 // fixed spacing of legend?
    }
  }

  let showLeftLegendLabel = true // isLess(width, BP_1) ? false : true
  let showLeftAxisTicks = false // isLess(width, BP_2) ? false : true
  let leftLegendOffset = 0 //isLess(width, BP_2) ? -15 : 48

  if (width >= WIDTH_BREAKPOINT_2) {
    showLeftAxisTicks = true
    left = TEXT_HEIGHT + 3 * BUFFER + AXIS_TICK_WIDTH + maxYAxisTickLabelWidth
    leftLegendOffset= -(TEXT_HEIGHT / 2 + AXIS_TICK_WIDTH + 2 * BUFFER + maxYAxisTickLabelWidth)
  } else if (width >= WIDTH_BREAKPOINT_1) {
    // TEXT_HEIGHT = axis legend height
    left = TEXT_HEIGHT + 2 * BUFFER + AXIS_TICK_WIDTH
    leftLegendOffset = -(TEXT_HEIGHT / 2 + AXIS_TICK_WIDTH + BUFFER)
  } else if (width < WIDTH_BREAKPOINT_1) {
    showLeftLegendLabel = false
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
  if (data[0].data) {
    return getTextSize(data[0].data[data.length - 1].x, '12px noto sans')
  // TO DO: below whould be the place to deal with bar-chart long labels but I feel now it is too complex, it works fine for the examples we have, need to test more
  } else return 0
}
// FOR NEW DATA STRUCTURE
// const getLastXAxisTickLabelWidth = (data) => {
//   if (data[0].x) {
//     return getTextSize(data[data.length - 1].x, '12px noto sans')
//   // TO DO: below whould be the place to deal with bar-chart long labels but I feel now it is too complex, it works fine for the examples we have, need to test more
//   } else return 0
// }

/**
 * getMaxYAxisTickLabelWidth - gets the width in pixels of the highest y value in the array
 * @param { array } data - data array
 * @returns { number } - the width in pixels of the highest y value in the array
 */
const getMaxYAxisTickLabelWidth = (data) => {
  if (data[0].data) {
    return getTextSize(
      Math.round(data.reduce((max, dataSet) =>
        dataSet.data.reduce((max, dataSet1) =>
          Math.max(max, dataSet1.y), 0), 0) * 100000 / 1000) + 'k', '12px noto sans')
  } else if (!data[0].value) {
    return getTextSize(
      Math.round(data.reduce((max, dataSet) =>
        Math.max(max, ...Object.values(dataSet).filter(value => typeof(value) === 'number'))
      , 0) * 100000 / 1000) + 'k', '12px noto sans')
  } else return 0
}

// FOR NEW DATA STRUCTURE
// const getMaxYAxisTickLabelWidth = (data) => {
//   if (data[0].x) {
//     return getTextSize(
//       Math.round(data.reduce((max, dataSet) =>
//         Math.max(max, dataSet.y), 0) * 100000 / 1000) + 'k', '12px noto sans')
//   } else if (!data[0].value) {
//     return getTextSize(
//       Math.round(data.reduce((max, dataSet) =>
//         Math.max(max, ...Object.values(dataSet).filter(value => typeof(value) === 'number'))
//       , 0) * 100000 / 1000) + 'k', '12px noto sans')
//   } else return 0
// }

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
  tickSize: 8,
  tickPadding: 8,
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

const getLabelContainerWidth = ({ width, height }) => {
  let labelContainer
  if (isAspectRatio(width, height, aspectRatios.LANDSCAPE)) {
    labelContainer = TRIMMED_LEGEND_WIDTH
    // MY
    // if (width >= WIDTH_BREAKPOINT_3) {
    //   labelContainer = width - WIDTH_BREAKPOINT_3 + TRIMMED_LEGEND_WIDTH
    // } else {
    //   labelContainer = 0
    // }
  } else {
    if (width >= WIDTH_BREAKPOINT_3) {
      labelContainer = setLegendItemWidth(width) - LEGEND_ROW_FIXED_ELEMENTS_WIDTH
    } else {
      labelContainer = 72 - LEGEND_ROW_FIXED_ELEMENTS_WIDTH
    }
    // MY
    // labelContainer = setLegendItemWidth(width) - LEGEND_ROW_FIXED_ELEMENTS_WIDTH
  }
  return labelContainer
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
  const legendItemWidth = setLegendItemWidth(width)
  // TODO tinker with max number of row legend elements
  // split based on the number and trim accordingly
  // const itemWidth = width < WIDTH_BREAKPOINT_3 ? (WIDTH_BREAKPOINT_0 - BUFFER) / 3 : legendItemWidth
  const itemWidth = width / 5 // size of label or whole item?
  console.log('---> width:', itemWidth, width, 5)
  // also trim to match
  // also
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
      ...getCommonAxisProps(height, showBottomLegendLabel, showBottomAxisTicks, axisBottomLegendLabel, bottomLegendOffset, d => trimText(d+'', chartWidth / data.length)),
    },
    axisLeft: {
      orient: 'left',
      ...getCommonAxisProps(width, showLeftLegendLabel, showLeftAxisTicks, axisLeftLegendLabel, leftLegendOffset, d => Math.round(d * 100000 / 1000) + 'k'),
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
