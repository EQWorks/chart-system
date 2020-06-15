import React from 'react'
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
  LEGEND_LABEL_WIDTH
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
  console.log('legendLengh: ', legendLength)
  // default values
  const top = 5
  let right = 76
  let bottom = 86
  let left = 63

  if (isAspectRatio(width, height, aspectRatios.LANDSCAPE)) {
    if (width < WIDTH_BREAKPOINT_3) {
      right = 8
    } else if (width >= WIDTH_BREAKPOINT_3 + legendLength) {
      right = legendLength + 26
    }
  } else right = 8

  // values from Zeplin design
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
    left = 8
  } else {
    if (width < WIDTH_BREAKPOINT_2) {
      left = 49
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
  console.log('legendLabelWidthMax: ', legendLabelWidthMax)
  return legendLabelWidthMax
}

const getTextSize = (text, font) => { 
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')
  context.font = font
  let width = context.measureText(text).width
  // let height = parseInt(context.font)
  let textSize = Math.ceil(width)
  console.log('label, width: ', text, textSize)
  return textSize
}

const formatData = (width, legendLength, data, originalData) => {
  console.log('originalData in format data: ', originalData)
  console.log('data in format data: ', data)
  if ((width >= WIDTH_BREAKPOINT_3) && (width < WIDTH_BREAKPOINT_3 + legendLength)) {
    data.forEach( (dataSet) => {
      // console.log('dataSet.id.length: ', dataSet.id.length )
      let labelWidth = getTextSize(dataSet.id, '12px noto sans')
      console.log('labelSize: ', labelWidth)
      if (labelWidth > LEGEND_LABEL_WIDTH) {
        let label = dataSet.id.slice(0, 5) + '..'
        if (getTextSize(label, '12px noto sans') > LEGEND_LABEL_WIDTH + 4) {
          label = dataSet.id.slice(0, 3) + '...'
        } else if (getTextSize(label, '12px noto sans') > LEGEND_LABEL_WIDTH) {
          label = dataSet.id.slice(0, 4) + '..'
        } else if (getTextSize(label, '12px noto sans') < LEGEND_LABEL_WIDTH) {
          label = dataSet.id.slice(0, 5) + '...'
        }
        dataSet.id = label
      }
    })
    return data
  } else return originalData
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
  originalData,
  legendLength,
  axisBottomLegendLabel,
  axisLeftLegendLabel
) => {
  const LEGEND_HEIGHT = 17
  const legend = {
    anchor: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 'right' : 'bottom',
    direction: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 'column' : 'row',
    // there is an issue with the library, the itemWidth is in fact a rect width but the rect doesn't include the text of the label
    itemWidth: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 28 : 83,
    // itemWidth: getLegendItemWidth(width, height, data, originalData),
    itemHeight: LEGEND_HEIGHT,
    symbolSize: 8,
    symbolSpacing: 6,
    symbolShape: 'circle',
    translateX: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 44: 8.5,
    translateY: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 0: 74
  }

  // const HEIGHT_WIDTH_RATIO = width / height
  return {
    margin: setChartMargin(width, height, legendLength),
    data: formatData(width, legendLength, data, originalData),
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
      legendOffset: isLess(width, WIDTH_BREAKPOINT_2) ? -15 : -48,
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
  console.log('data: ', data)
  let originalData = JSON.parse(JSON.stringify(data))
  console.log('original data: ', originalData)
  const LEGEND_LENGTH = getLegendLabelMaxWidth(originalData)
  console.log('LEGEND_LENGTH: ', LEGEND_LENGTH)

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
                {...setCommonProps(width, height, data, originalData, LEGEND_LENGTH, axisBottomLegendLabel, axisLeftLegendLabel)}
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
