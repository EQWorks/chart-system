import React from 'react'

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
  HEIGHT_BREAKPOINT_3
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
const setCommonProps = (width, height, data, axisBottomLegendLabel, axisLeftLegendLabel) => {
  const LEGEND_HEIGHT = 17

  const legend = {
    dataFrom: 'keys',
    anchor: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 'right' : 'bottom',
    direction: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 'column' : 'row',
    itemWidth: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 84.5 : 83,
    itemHeight: LEGEND_HEIGHT,
    symbolSize: 8,
    justify: false,
    symbolSpacing: 6,
    symbolShape: 'circle',
    translateX: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 99 : 8.5,
    translateY: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 0 : 74
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

// BarChart - creates a bar chart
const BarChart = ({
  data,
  axisBottomLegendLabel,
  axisLeftLegendLabel
}) => {

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
                {...setCommonProps(width, height, data, axisBottomLegendLabel, axisLeftLegendLabel)}
                tooltip={({ id, value, color }) => tooltip(id, value, color)}
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
