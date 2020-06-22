import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'

import styled from 'styled-components'

import 'react-virtualized/styles.css'
import { AutoSizer } from 'react-virtualized'

import tooltip from './tooltip'
import { onMouseEnter, onMouseLeave } from './events'

import designSystemColors from '../../shared/constants/design-system-colors'

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
  AXIS_TICK_WIDTH,
  SYMBOL_SIZE
} from '../../shared/constants/dimensions'

// define styled elements
const Title = styled.div`
  margin: 16px 16px 10px 16px;
  height: 24px;
  font-size: 18px;
`

const ChartContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  margin: 0px 16px 16px 16px;
`

const ChartInner = styled.div`
  position: relative;
  width: ${ props => props.width}px;
  height: ${ props => props.height}px;
`
/**
 * setChartMargin - sets the values of the chart margins
 * @param { number } width - width of the chart conatiner (ChartInner)
 * @param { number } heigth - height of the chart conatiner (ChartInner)
 * @param { number } legendLength - maximum length of a label/key text in the legend
 * @param { number } legendItemCount - number of items in the legend
 * @returns { object } - top, right, bottom, left values
 */
const setChartMargin = (width, height, legendLength, legendItemCount, lastXAxisTickLabelWidth, maxYAxisTickLabelWidth) => {
  // default values
  const top = 5
  /** when no legend or tick labels are present, right margin should adjust to SYMBOL_SIZE / 2 + 1
    * as the symbols on the chart could stick out halfway beyond the chart frame
    */
  let right = SYMBOL_SIZE / 2 + 1
  let bottom = 86
  let left = 63

  /** at HEIGHT_BREAKPOINT_2 the x-axis ticks appear in the chart, therefore, the right margin
    * has to adjust to include just over half of the last x-axis tick lable width
    */
  if (height >= HEIGHT_BREAKPOINT_2) {
    right = Math.max(right, lastXAxisTickLabelWidth * 0.6)
  }

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
    left = AXIS_TICK_WIDTH
  } else {
    if (width < WIDTH_BREAKPOINT_2) {
      // TEXT_HEIGHT = axis legend height
      left = TEXT_HEIGHT + 2 * BUFFER + AXIS_TICK_WIDTH
    } else {
      if (width >= WIDTH_BREAKPOINT_2) {
        left = TEXT_HEIGHT + 3 * BUFFER + AXIS_TICK_WIDTH + maxYAxisTickLabelWidth
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

const aspectRatios = {
  LANDSCAPE: 0,
  PORTRAIT: 1,
  ANY: 2
}

const getAspectRatio = (width, height) => {
  return width / height > 1 ? aspectRatios.LANDSCAPE : aspectRatios.PORTRAIT
}

const isAspectRatio = (width, height, aspectRatio) => {
  const componentAspectRatio = getAspectRatio(width, height)

  return componentAspectRatio === aspectRatio
}

const isLess= (a, b) => {
  return a < b
}

// sets common props for Nivo ResponsiveScatterPlot component
const setCommonProps = (
  width,
  height,
  data,
  axisBottomLegendLabel,
  axisLeftLegendLabel,
  ref
) => {
  const propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    size: PropTypes.number,
    fill: PropTypes.string,
    borderWidth: PropTypes.number,
    borderColor: PropTypes.string,
  }
  const symbolShape = ({
    x, y, size, fill, borderWidth, borderColor,
  }) => (
    <circle
      r={size / 2}
      cx={x + size / 2}
      cy={y + size / 2}
      fill={fill}
      strokeWidth={borderWidth}
      stroke={borderColor}
      style={{
        pointerEvents: 'none',
      }}
      ref={ref}
    />
  )
  symbolShape.propTypes = propTypes
  const legendLabelWidth = getLegendLabelMaxWidth(data)
  const legendItemCount = data.length

  // calculate the longest x-axis tick label width in pixels
  const lastXAxisTickLabelWidth = getTextSize(data[0].data[data.length - 1].x, '12px noto sans')
  // calculate the longest y-axis tick label width in pixels
  const maxYAxisTickLabelWidth = getTextSize(
    data.reduce((max, dataSet) =>
      dataSet.data.reduce((max, dataSet1) =>
        Math.max(max, dataSet1.y,), 0), 0), '12px noto sans')

  const legend = {
    anchor: (isAspectRatio(width, height, aspectRatios.LANDSCAPE) || legendItemCount > 3) ? 'right' : 'bottom',
    direction: (isAspectRatio(width, height, aspectRatios.LANDSCAPE) || legendItemCount > 3) ? 'column' : 'row',
    // MY SOLUTION - itemWidth extends right away with extending the width for a bottom legend
    // itemWidth: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 14 : setLegendItemWidth(width),

    // Do's design - Do wants the legend items to extend only after width > WIDTH_BREAKPOINT_3
    itemWidth: (isAspectRatio(width, height, aspectRatios.LANDSCAPE) || legendItemCount > 3) ?
      0 :
      (width < WIDTH_BREAKPOINT_3 ?
        (WIDTH_BREAKPOINT_0 - BUFFER) / 3:
        setLegendItemWidth(width)),
    itemHeight: LEGEND_HEIGHT,
    symbolSize: 8,
    symbolSpacing: 6,
    symbolShape,
    // 14 is the buffer to the right between chart and column Legend
    translateX: (isAspectRatio(width, height, aspectRatios.LANDSCAPE) || legendItemCount > 3) ? 14: BUFFER,
    translateY: (isAspectRatio(width, height, aspectRatios.LANDSCAPE) || legendItemCount > 3) ? 0: 74
  }

  // const HEIGHT_WIDTH_RATIO = width / height
  return {
    margin: setChartMargin(
      width,
      height,
      legendLabelWidth,
      legendItemCount,
      lastXAxisTickLabelWidth,
      maxYAxisTickLabelWidth),
    // data: formatData(width, legendLabelWidth, data, originalData),
    data: data,
    xScale: { type: 'linear' },
    yScale: { type: 'linear' },
    colors: [
      designSystemColors.blue70,
      designSystemColors.pink70,
      designSystemColors.teal70
    ],
    nodeSize: 8,
    axisBottom: {
      // we hide tick labels up to a certain width
      format: (d) => isLess(height, HEIGHT_BREAKPOINT_2)? null : `${d}`,
      tickValues: data[0].data.length,
      tickSize: 8,
      // hide axis legend up to a certain heigth
      legend: isLess(height, HEIGHT_BREAKPOINT_1) ? '' : axisBottomLegendLabel,
      legendHeight: LEGEND_HEIGHT,
      legendOffset: isLess(height, HEIGHT_BREAKPOINT_2) ? 23 : 39,
      legendPosition: 'middle'
    },
    axisLeft: {
      orient: 'left',
      // we hide tick labels up to a certain height
      format: (d) => isLess(width, WIDTH_BREAKPOINT_2) ? '' : `${d}`,
      tickSize: 8,
      // hide axis legend until a certain width
      legend: isLess(width, WIDTH_BREAKPOINT_1) ? '' : axisLeftLegendLabel,
      legendHeight: LEGEND_HEIGHT,
      // legendOffset -15 places label by the ticks
      legendOffset: isLess(width, WIDTH_BREAKPOINT_2) ?
        // legendOffset 0 places the label rigth on the y-axis that's why we add TEXT_HEIGHT / 2
        -(TEXT_HEIGHT / 2 + AXIS_TICK_WIDTH + BUFFER):
        -(TEXT_HEIGHT / 2 + AXIS_TICK_WIDTH + 2 * BUFFER + maxYAxisTickLabelWidth),
      legendPosition: 'middle'
    },
    onMouseEnter,
    onMouseLeave,
    useMesh: false,
    // legends will change format and placement with container width & height changes
    legends: (isAspectRatio(width, height, aspectRatios.LANDSCAPE) && legendItemCount > 3)
      ? (height > 100 ? [legend] : [])
      : (width >= WIDTH_BREAKPOINT_0 ? [legend] : []),
    theme: {
      // font size for the whole chart
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
          strokeDasharray: '5 5'
        }
      }
    }
  }
}

const propTypes = {
  data: PropTypes.array,
  axisBottomLegendLabel: PropTypes.string,
  axisLeftLegendLabel: PropTypes.string,
}

// ScatterChart - creates a scatter chart
const ScatterChart = ({
  data,
  axisBottomLegendLabel,
  axisLeftLegendLabel
}) => {

  /**
   * initRef - React ref used to target and trim Legend labels
   * @param { number } width - width of the chart container (ChartInner)
   * @param { number } heigth - height of the chart container (ChartInner)
   * @param { html } node - Legend html node
   */
  const initRef = useCallback((width, height) => node => {
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
  }, [])

  return (
    <>
      <Title>
        Test
      </Title>
      <ChartContainer>
        <AutoSizer>
          {({ height, width }) => (
            <ChartInner id='chart-inner' height={height} width={width}>
              <ResponsiveScatterPlot
                {...setCommonProps(
                  width,
                  height,
                  data,
                  axisBottomLegendLabel,
                  axisLeftLegendLabel,
                  initRef(width, height)
                )}
                tooltip={({ node }) => tooltip(node, axisBottomLegendLabel, axisLeftLegendLabel)}
              >
              </ResponsiveScatterPlot>
            </ChartInner>
          )}
        </AutoSizer>
      </ChartContainer>
    </>
  )
}

export default ScatterChart

ScatterChart.propTypes = propTypes
