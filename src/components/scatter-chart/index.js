import React from 'react'
import PropTypes from 'prop-types'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'

import styled from 'styled-components'

import 'react-virtualized/styles.css'
import { AutoSizer } from 'react-virtualized'

import tooltip from './tooltip'
import { onMouseEnter, onMouseLeave } from './events'

import scatterChartData from '../../shared/constants/scatter-chart-data'

import {
  LOWER_ASPECT_RATIO,
  // LOWER_WIDTH_BREAK,
  // SCATTER_CHART_TITLE_HEIGHT
} from '../../shared/constants/dimensions.js'

import designSystemColors from '../../shared/constants/design-system-colors'

// define styled elements
const Title = styled.div`
  margin: 16px;
  height: 24px;
  font-size: 18px;
`

const Wrapper = styled.div`
  width: ${ props => props.wrapperWidth}px;
  height: ${ props => props.wrapperHeight}px;
  border-style: solid;
  border-width: 0.01px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
`

const ChartContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
`

const ChartInner = styled.div`
  position: relative;
  width: ${ props => props.width}px;
  height: ${ props => props.height}px;
`

// legend for square container or with width < height
const legendSm = {
  anchor: 'bottom',
  direction: 'row',
  itemWidth: 83,
  itemHeight: 17,
  symbolSize: 8,
  symbolSpacing: 6,
  symbolShape: 'circle',
  translateX: 8.5,
  translateY: 42
}

// legend for elongated container
const legendMd = {
  anchor: 'right',
  direction: 'column',
  itemWidth: 84.5,
  itemHeight: 19,
  symbolSize: 8,
  symbolSpacing: 6,
  symbolShape: 'circle',
  translateX: 126,
  translateY: 0
}

// sets common props for Nivo ResponsiveScatterPlot component
const setCommonProps = (HEIGHT_WIDTH_RATIO) => {
  return {
    margin: HEIGHT_WIDTH_RATIO > LOWER_ASPECT_RATIO
      ? { top: 25, right: 52, bottom: 79, left: 43 }
      : { top: 35, right: 139, bottom: 69, left: 63 },
    data: scatterChartData,
    xScale: { type: 'linear', min: 10, max: 'auto' },
    yScale: { type: 'linear', min: 0, max: 1 },
    colors: [
      designSystemColors.blue70,
      designSystemColors.pink70,
      designSystemColors.teal70
    ],
    nodeSize: 8,
    axisBottom: {
      // we hide tick labels for small scatter charts
      format: (d) => HEIGHT_WIDTH_RATIO > LOWER_ASPECT_RATIO ? null : `${d}`,
      tickValues: scatterChartData[0].data.length,
      tickSize: 8
    },
    axisLeft: {
      format: (d) => HEIGHT_WIDTH_RATIO > LOWER_ASPECT_RATIO ? null : `${d}`,
      tickValues: [0.0, 0.2, 0.4, 0.6, 0.8, 1.0],
      tickSize: 8
    },
    gridXValues: scatterChartData[0].data.length,
    gridYValues: [0.0, 0.2, 0.4, 0.6, 0.8, 1.0],
    onMouseEnter,
    onMouseLeave,
    useMesh: false,
    // legends will change format and placement with container width & height changes
    legends: [
      HEIGHT_WIDTH_RATIO > LOWER_ASPECT_RATIO ? legendSm : legendMd
    ],
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
          strokeWidth: 1,
          strokeDasharray: '5 5'
        }
      }
    }
  }
}

const propTypes = {
  wrapperWidth: PropTypes.number,
  wrapperHeight: PropTypes.number
}

// ScatterChart - creates a scatter chart
const ScatterChart = ({
  wrapperWidth,
  wrapperHeight
}) => {
  const HEIGHT_WIDTH_RATIO = wrapperHeight / wrapperWidth

  const commonProps = setCommonProps(HEIGHT_WIDTH_RATIO)

  return (
    <Wrapper
      wrapperWidth={wrapperWidth}
      wrapperHeight={wrapperHeight}
    >
      <Title>
        Title Test
      </Title>
      <ChartContainer>
        <AutoSizer>
          {({ height, width }) => (
            <ChartInner height={height} width={width}>
              <ResponsiveScatterPlot
                {...commonProps}
                tooltip={({ node }) => tooltip(node)}
              >
              </ResponsiveScatterPlot>
            </ChartInner>
          )}
        </AutoSizer>
      </ChartContainer>
    </Wrapper>
  )
}

export default ScatterChart

ScatterChart.propTypes = propTypes
