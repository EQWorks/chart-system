import React from 'react'

import PropTypes from 'prop-types'
import { ResponsiveBar } from '@nivo/bar'

import styled from 'styled-components'
import 'react-virtualized/styles.css'

import { AutoSizer } from 'react-virtualized'

import tooltip from './tooltip'

import designSystemColors from '../../shared/constants/design-system-colors'

// define styled elements
const Title = styled.div`
  margin: 16px 16px 0 16px;
  height: 24px;
  font-size: 18px;
`

const ChartContainer = styled.div`
  display: flex;
  flex: 1;
`

const ChartInner = styled.div`
  position: relative;
  width: ${ props => props.width}px;
  height: ${ props => props.height}px;
`

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

  return componentAspectRatio == aspectRatio
}

const isMinimumSizeAndRatio = (width, height, aspectRatio, minimumSize) => {
  const componentAspectRatio = getAspectRatio(width, height)

  if (aspectRatio != aspectRatios.ANY && componentAspectRatio != aspectRatio) return false

  if (componentAspectRatio == aspectRatios.LANDSCAPE && width < minimumSize) {
    return false
  }

  if (componentAspectRatio == aspectRatios.PORTRAIT && height < minimumSize) {
    return false
  }

  return true
}

// sets common props for Nivo ResponsiveBar component
const setCommonProps = (width, height, data, axisBottomLegendLabel, axisLeftLegendLabel) => {
  const legend = {
    dataFrom: 'keys',
    anchor: 'right',
    direction: 'column',
    justify: false,
    translateX: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 140 : 0,
    itemsSpacing: 2,
    itemHeight: 20,
    itemDirection: 'left-to-right',
    itemOpacity: 0.85,
    itemWidth: 84.5,
    symbolSize: 8,
    symbolSpacing: 6,
    symbolShape: 'circle',
    effects: [
      {
        on: 'hover',
        style: {
          itemOpacity: 1
        }
      }
    ]
  }

  return {
    margin: isAspectRatio(width, height, aspectRatios.LANDSCAPE)
      ? { top: 25, right: isMinimumSizeAndRatio(width, height, aspectRatios.LANDSCAPE, 500) ? 200 : 50, bottom: 79, left: 100 }
      : { top: 25, right: 50, bottom: 200, left: 100 },
    data: data,
    keys: Object.keys(data[0]),
    indexBy: Object.keys(data[0])[0],
    groupMode: 'stacked',
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
      format: (d) => (isMinimumSizeAndRatio(width, height, aspectRatios.ANY, 500) ? `${d}` : ''),
      tickSize: (isMinimumSizeAndRatio(width, height, aspectRatios.ANY, 500) ? 5 : 0),
      tickPadding: 5,
      legend: (isMinimumSizeAndRatio(width, height, aspectRatios.ANY, 500) ? axisBottomLegendLabel : ''),
      legendPosition: 'middle',
      tickRotation: 0,
      legendOffset: 40
    },
    axisLeft: (isMinimumSizeAndRatio(width, height, aspectRatios.ANY, 500) ? {
      format: (d) => (isMinimumSizeAndRatio(width, height, aspectRatios.ANY, 500) ? `${d}` : ''),
      tickSize: (isMinimumSizeAndRatio(width, height, aspectRatios.ANY, 500) ? 5 : 0),
      tickPadding: 5,
      legend: (isMinimumSizeAndRatio(width, height, aspectRatios.ANY, 500) ? axisLeftLegendLabel : ''),
      tickRotation: 0,
      legendPosition: 'middle',
      legendOffset: -60
    } : null),
    legends: (isMinimumSizeAndRatio(width, height, aspectRatios.ANY, 500) ? [
      legend
    ] : []),
    labelSkipWidth: 12,
    labelSkipHeight: 12,
    animate: true,
    motionStiffness: 90,
    motionDamping: 15,
    theme: {
      fontSize: 12
    }
  }
}

const propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  axisBottomLegendLabel: PropTypes.string,
  axisLeftLegendLabel: PropTypes.string
}

// StackedBarChart - creates a stacked bar chart
const StackedBarChart = ({
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
                theme={{
                  tooltip: {
                    container: {
                      padding: 0
                    },
                  },
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

export default StackedBarChart

StackedBarChart.propTypes = propTypes
