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
  WIDTH_BREAKPOINT_1,
  WIDTH_BREAKPOINT_2,
  WIDTH_BREAKPOINT_3,
  HEIGHT_BREAKPOINT_1,
  HEIGHT_BREAKPOINT_2,
  HEIGHT_BREAKPOINT_3,
  TRIMMED_LEGEND_WIDTH,
  LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH,
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

const setChartMargin = (width, height, legendLength) => {
  // default values
  const top = 5
  // TO DO: adjust default value to include dynamically the last tick label on the x-axis
  let right = 8
  let bottom = 86
  let left = 63

  if (isAspectRatio(width, height, aspectRatios.LANDSCAPE)) {
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
    // 8 is the width of vertical axis ticks that need to fit on the side of the chart
    left = 8
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

const getLegendLabelMaxWidth = (data) => {
  let legendLabelWidthMax = 0
  data.forEach(dataSet => {
    legendLabelWidthMax = Math.max(legendLabelWidthMax, getTextSize(dataSet.id, '12px noto sans'))
  })
  return legendLabelWidthMax
}

const getTextSize = (text, font) => {
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')
  context.font = font
  let width = context.measureText(text).width
  let textSize = Math.ceil(width)
  return textSize
}

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
  legendLabelWidth,
  axisBottomLegendLabel,
  axisLeftLegendLabel,
  ref
) => {
  const LEGEND_HEIGHT = 17
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
  const legend = {
    // data: [{id: 1, label: 'FirstLabel'}, {id: 2, label: 'SecondLabel'}, {id: 3, label: 'ThirdLabel'}],
    anchor: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 'right' : 'bottom',
    direction: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 'column' : 'row',
    // there is an issue with the library, the itemWidth is in fact a rect width but the rect doesn't seem to include the text of the label
    // 28 will place the legend 12 pixels away from the chart to the right
    itemWidth: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 28 : 83,
    // itemWidth: getLegendItemWidth(width, height, data, originalData),
    itemHeight: LEGEND_HEIGHT,
    symbolSize: 8,
    symbolSpacing: 6,
    symbolShape,
    translateX: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 44: 8.5,
    translateY: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 0: 74
  }

  // const HEIGHT_WIDTH_RATIO = width / height
  return {
    margin: setChartMargin(width, height, legendLabelWidth),
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
      legendOffset: isLess(width, WIDTH_BREAKPOINT_2) ? -23 : -48,
      legendPosition: 'middle'
    },
    onMouseEnter,
    onMouseLeave,
    useMesh: false,
    // legends will change format and placement with container width & height changes
    legends: isAspectRatio(width, height, aspectRatios.LANDSCAPE)
      ? (height > 100 ? [legend] : [])
      : (width > 400 ? [legend] : []),
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
  axisLeftLegendLabel: PropTypes.string
}

// ScatterChart - creates a scatter chart
const ScatterChart = ({
  data,
  axisBottomLegendLabel,
  axisLeftLegendLabel
}) => {
  const initRef = useCallback(width => node => {
    if ((node !== null) && (width >= WIDTH_BREAKPOINT_3)) {
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
        let labelContainer = width - WIDTH_BREAKPOINT_3 + TRIMMED_LEGEND_WIDTH
        let label = original
        if (labelWidth > labelContainer) {
          label = trimText(original, labelContainer)
        }
        text.innerHTML = label
      }
    }
  }, [])

  const LEGEND_LABEL_LENGTH = getLegendLabelMaxWidth(data)

  return (
    <>
      <Title>
        Test
      </Title>
      <ChartContainer>
        <AutoSizer>
          {({ height, width }) => (
            <ChartInner id='chart-inner' height={height} width={width} legend>
              <ResponsiveScatterPlot
                {...setCommonProps(
                  width,
                  height,
                  data,
                  LEGEND_LABEL_LENGTH,
                  axisBottomLegendLabel,
                  axisLeftLegendLabel,
                  initRef(width)
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
