import React from 'react'
import { omit } from 'lodash'
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
import designSystemColors from '../constants/design-system-colors'

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
/**
 * setChartMargin - sets the values of the chart margins
 * @param { number } width - width of the chart conatiner (ChartInner)
 * @param { number } heigth - height of the chart conatiner (ChartInner)
 * @param { number } legendLength - maximum length of a label/key text in the legend
 * @param { number } legendItemCount - number of items in the legend
 * @returns { object } - top, right, bottom, left values
 */
const setChartMargin = (width, height, legendLength, legendItemCount) => {
  // default values
  const top = 5
  // TO DO: adjust default value to include dynamically the last tick label on the x-axis
  let right = BUFFER
  let bottom = 86
  let left = 63

  if (isAspectRatio(width, height, aspectRatios.LANDSCAPE) || legendItemCount > 3) {
    if (width >= WIDTH_BREAKPOINT_3 + legendLength - LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH) {
      right = legendLength + LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH
    } else if (width >= WIDTH_BREAKPOINT_3) {
      right = width - WIDTH_BREAKPOINT_3 + LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH + TRIMMED_LEGEND_WIDTH
    }
  }

  if (height < HEIGHT_BREAKPOINT_1) {
    bottom = 15
  } else {
    if (height < HEIGHT_BREAKPOINT_2) {
      bottom = 38
    } else {
      if (height < HEIGHT_BREAKPOINT_3) {
        bottom = 63
      }
    }
  }

  if (width < WIDTH_BREAKPOINT_1) {
    // BUFFER = 8 is the width of vertical axis ticks that need to fit on the side of the chart
    left = BUFFER
  } else {
    if (width < WIDTH_BREAKPOINT_2) {
      // 41 = 8(ticks) + 8(space) + 17(height of axis label) + 8(space to margin)
      left = 41
    } else {
      if (width < WIDTH_BREAKPOINT_3) {
        left = 66
      }
    }
  }

  return { top, right, bottom, left }
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
  let textWidth = getTextSize(text.substr(0, n) + '..', font)
  if (textWidth <= containerWidth) {
    text = text.substr(0, n) + '..'
  } else {
    text = trimText(text.substr(0, n - 1), containerWidth)
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

const isLess = (a, b) => {
  return a < b
}

/**
 * initRef - React ref used to target and trim Legend labels
 * @param { number } width - width of chart container
 * @param { number } height - height of chart container
 * @param { html } node - Legend html node
 */
export const trimLegendLabel = ({ width, height }) => node => {
  if ((node !== null) && (width >= WIDTH_BREAKPOINT_0)) {
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
      // MY SOLUTION
      // let labelContainer = isAspectRatio(width, height, aspectRatios.LANDSCAPE) ?
      // // we only want to start trimming for column legend when width >= WIDTH_BREAKPOINT_3
      //   ((width >= WIDTH_BREAKPOINT_3) ?
      //     width - WIDTH_BREAKPOINT_3 + TRIMMED_LEGEND_WIDTH :
      //     0):
      //   setLegendItemWidth(width, height) - LEGEND_ROW_FIXED_ELEMENTS_WIDTH

      // Do's design
      let labelContainer = isAspectRatio(width, height, aspectRatios.LANDSCAPE) ?
      // we only want to start trimming for column legend when width >= WIDTH_BREAKPOINT_3
        ((width >= WIDTH_BREAKPOINT_3) ?
          width - WIDTH_BREAKPOINT_3 + TRIMMED_LEGEND_WIDTH :
          0):
        ((width >= WIDTH_BREAKPOINT_3) ?
          setLegendItemWidth(width, height) - LEGEND_ROW_FIXED_ELEMENTS_WIDTH :
          72 - LEGEND_ROW_FIXED_ELEMENTS_WIDTH)
      let label = original
      if (labelContainer && (labelWidth > labelContainer)) {
        label = trimText(original, labelContainer)
      }
      text.innerHTML = label
    }
  }
}

const getCommonAxisProps = (dimension, breakpointOne, breakpointTwo, axisLegendLabel, offsets) => ({
  tickSize: 8,
  legendHeight: LEGEND_HEIGHT,
  legendPosition: 'middle',
  // hide axis legend until a certain width
  legend: isLess(dimension, breakpointOne) ? '' : axisLegendLabel,
  // we hide tick labels up to a certain height
  format: (d) => isLess(dimension, breakpointTwo) ? null : `${d}`,
  // legendOffset -15 places label by the ticks
  legendOffset: isLess(dimension, breakpointTwo) ? offsets[0] : offsets[1],
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
  const legendLabelWidth = getLegendLabelMaxWidth(data)
  const legendItemCount = data.length

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

  const symbolShape = nivoProps => <LegendCircle {...nivoProps} width={width} height={height} />
  const legend = {
    itemHeight: LEGEND_HEIGHT,
    symbolSize: 8,
    symbolSpacing: 6,
    symbolShape,
    ...aspectRatioProps,
    ...legendProps,
  }

  return {
    data,
    margin: setChartMargin(width, height, legendLabelWidth, legendItemCount),
    axisBottom: {
      tickValues,
      ...getCommonAxisProps(height, HEIGHT_BREAKPOINT_1, HEIGHT_BREAKPOINT_2, axisBottomLegendLabel, [23, 39]),
    },
    axisLeft: {
      orient: 'left',
      ...getCommonAxisProps(width, WIDTH_BREAKPOINT_1, WIDTH_BREAKPOINT_2, axisLeftLegendLabel, [-15, -48]),
    },
    legends: (isAspectRatio(width, height, aspectRatios.LANDSCAPE) && legendItemCount > 3)
      ? (height > 100 ? [legend] : [])
      : (width >= WIDTH_BREAKPOINT_0 ? [legend] : []),
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

export const processData = ({ indexBy, keys, data }) => {
  // remove indexBy and assign colors
  const finalIndexBy = indexBy.length ? indexBy : Object.keys(data[0])[0]
  const finalKeys = keys.length ? keys : Object.keys(omit(data[0], finalIndexBy))
  return {
    colors: [
      designSystemColors.blue70,
      designSystemColors.yellow70,
      designSystemColors.pink70,
      designSystemColors.purple70,
      designSystemColors.teal70,
    ],
    finalKeys,
    finalIndexBy,
  }
}