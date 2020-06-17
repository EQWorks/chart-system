import React, { useRef, useCallback } from 'react'

import PropTypes from 'prop-types'
import { ResponsiveBar } from '@nivo/bar'

import styled from 'styled-components'
import 'react-virtualized/styles.css'

import { AutoSizer } from 'react-virtualized'

import tooltip from './tooltip'

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
  margin: 16px 16px 0 16px;
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
  .legend ~ text {
    max-width: 10px;
    width: 10px;
    text-overflow: ellipsis;
    text-length: 10px;
  }
  .legend {
    background-color: black;
  }
`

const setChartMargin = (width, height) => {
  // default values
  const top = 5
  let right = 76
  let bottom = 86
  let left = 63

  if (width < WIDTH_BREAKPOINT_3) {
    right = 6
  } else {
    if (width < WIDTH_BREAKPOINT_3) {
      right = 8
    }
  }

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

const isLess = (a, b) => {
  return a < b
}

// sets common props for Nivo ResponsiveBar component
const setCommonProps = (width, height, data, axisBottomLegendLabel, axisLeftLegendLabel, ref) => {
  const LEGEND_HEIGHT = 17
  const symbolShape = ({
    x, y, size, fill, borderWidth, borderColor,
  }) => (
    <rect
      x={x}
      y={y}
      transform={`rotate(45 ${size/2} ${size/2})`}
      fill={fill}
      strokeWidth={borderWidth}
      stroke={borderColor}
      width={size}
      height={size}
      style={{ pointerEvents: 'none' }}
      ref={ref}
    />
  )
  const legend = {
    dataFrom: 'keys',
    anchor: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 'right' : 'bottom',
    direction: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 'column' : 'row',
    itemWidth: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 28 : 83,
    itemHeight: LEGEND_HEIGHT,
    symbolSize: 8,
    justify: false,
    symbolSpacing: 6,
    symbolShape,
    translateX: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 44: 8.5,
    translateY: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 0: 74
  }


  return {
    margin: setChartMargin(width, height),
    data: data,
    // TBD
    keys: ['visits', 'visitors', 'repeat_visitors', 'single_visitors', 'multi_visitors'],
    // TBD
    indexBy: Object.keys(data[0])[0],
    groupMode: 'grouped',
    layout: 'vertical',
    colors: [
      designSystemColors.blue70,
      designSystemColors.yellow70,
      designSystemColors.pink70,
      designSystemColors.purple70,
      designSystemColors.teal70
    ],
    axisTop: null,
    axisRight: null,
    enableRadialLabels: false,
    enableGridY: true,
    enableLabel: false,
    axisBottom: {
      // we hide tick labels up to a certain width
      format: (d) => isLess(height, HEIGHT_BREAKPOINT_2) ? null : `${d}`,
      tickValues: 8,
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
    legends: isAspectRatio(width, height, aspectRatios.LANDSCAPE)
      ? (height > 100 ? [legend] : [])
      : (width > 400 ? [legend] : []),
    animate: true,
    motionStiffness: 90,
    motionDamping: 15,
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
          strokeWidth: 1
        }
      }
    }
  }
}

const propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  axisBottomLegendLabel: PropTypes.string,
  axisLeftLegendLabel: PropTypes.string
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

const trimText = (text, containerWidth) => {
  console.log('text in trimText: ', text)
  let font = '12px noto sans'
  let n = text.length - 1
  let textWidth = getTextSize(text.substr(0, n) + '..', font)
  console.log('textWidth, containerWidth:', textWidth, containerWidth)
  if (textWidth <= containerWidth) {
    text = text.substr(0, n) + '..'
  } else {
    text = trimText(text.substr(0, n - 1), containerWidth)
  }
  console.log('text final: ', text)
  return text
}

// BarChart - creates a bar chart
const BarChart = ({
  data,
  axisBottomLegendLabel,
  axisLeftLegendLabel
}) => {

  const initRef = useCallback(node => {
    if (node !== null) {
      const text = Array.from(node.parentNode.children).find(tag => tag.tagName === 'text')
      if (text) {
        console.log(text)
        console.log(text.innerHTML)
        // set its original value as attribute, so that we don't keep repeating
        if (!text.getAttribute('og-key')) {
          text.setAttribute('og-key', text.innerHTML)
        }
        const original = text.getAttribute('og-key') || text.innerHTML
        let labelWidth = getTextSize(original, '12px noto sans')
        if (labelWidth > LEGEND_LABEL_WIDTH) {
          let label = trimText(original, LEGEND_LABEL_WIDTH)
          text.innerHTML = label
        }
      }
    }
  }, [])

  return (
    <>
      <Title>
        Title
      </Title>
      <ChartContainer>
        <AutoSizer>
          {({ height, width }) => (
            <ChartInner height={height} width={width}>
              <ResponsiveBar
                {...setCommonProps(width, height, data, axisBottomLegendLabel, axisLeftLegendLabel, initRef)}
                tooltip={({ id, value, color }) => tooltip(id, value, color, axisBottomLegendLabel, axisLeftLegendLabel)}
                onMouseEnter={(_data, event) => {
                  let dataPoints = Array.from(event.target.parentNode.parentElement.getElementsByTagName('rect'))
                  let hoverItemIndex = dataPoints.indexOf(event.target)
                  dataPoints.splice(hoverItemIndex, 1)
                  dataPoints.forEach(point => {
                    point.style.opacity = 0.1
                  })
                }}
                onMouseLeave={(_data, event) => {
                  let dataPoints = Array.from(event.target.parentNode.parentElement.getElementsByTagName('rect'))
                  for (let i = 0; i < dataPoints.length; i++) {
                    dataPoints[i].style.opacity = 1
                  }
                }}
              >
              </ResponsiveBar>
            </ChartInner>
          )}
        </AutoSizer>
      </ChartContainer>
    </>
  )
}

export default BarChart

BarChart.propTypes = propTypes
