import React from 'react'
import PropTypes from 'prop-types'
import { ResponsiveLine } from '@nivo/line'

import styled from 'styled-components'
import 'react-virtualized/styles.css'

import { AutoSizer } from 'react-virtualized'

import tooltip from './tooltip'

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
// const legendSm = {
//   anchor: 'bottom',
//   direction: 'row',
//   itemWidth: 83,
//   itemHeight: 17,
//   symbolSize: 8,
//   symbolSpacing: 6,
//   symbolShape: 'circle',
//   translateX: 8.5,
//   translateY: 42
// }

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

// sets common props for Nivo ResponsiveLine component
const setCommonProps = (HEIGHT_WIDTH_RATIO, data) => {
  return {
    margin: HEIGHT_WIDTH_RATIO > LOWER_ASPECT_RATIO
      ? { top: 25, right: 52, bottom: 79, left: 43 }
      : { top: 35, right: 139, bottom: 69, left: 63 },
    data: data,
    xScale: { type: 'point' },
    yScale: { type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false },
    colors: [
      designSystemColors.blue70,
      designSystemColors.pink70,
      designSystemColors.teal70
    ],
    useMesh: true,
    enableCrosshair: true,
    crosshairType: 'bottom',
    layers: [
      'grid',
      'markers',
      'axes',
      'areas',
      'crosshair',
      'lines',
      'points',
      'slices',
      'mesh',
      'legends'
    ],
    axisBottom: {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: HEIGHT_WIDTH_RATIO > LOWER_ASPECT_RATIO ? 30 : 0,
      legend: HEIGHT_WIDTH_RATIO > LOWER_ASPECT_RATIO ? null : 'testing', // chartSizer(MODELANDSCAPE, 40, 'testing', null)
      legendOffset: 40,
      legendPosition: 'middle'
    },
    axisLeft: {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: HEIGHT_WIDTH_RATIO > LOWER_ASPECT_RATIO ? null : 'testing',
      legendOffset: -40,
      legendPosition: 'middle'
    },
    legends: [
      HEIGHT_WIDTH_RATIO > LOWER_ASPECT_RATIO ? [] : legendMd
    ]
  }
}


const propTypes = {
  wrapperWidth: PropTypes.number,
  wrapperHeight: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.object).isRequired
}

// LineChart - creates a line chart
const LineChart = ({
  wrapperWidth,
  wrapperHeight,
  data
}) => {
  const HEIGHT_WIDTH_RATIO = wrapperHeight / wrapperWidth

  const commonProps = setCommonProps(HEIGHT_WIDTH_RATIO, data)

  return (
    <Wrapper
      wrapperWidth={wrapperWidth}
      wrapperHeight={wrapperHeight}
    >
      <Title>
        Title
      </Title>
      <ChartContainer>
        <AutoSizer>
          {({ height, width }) => (
            <ChartInner height={height} width={width}>
              <ResponsiveLine
                {...commonProps}
                tooltip={(slice) => tooltip(slice)}
              >
              </ResponsiveLine>
            </ChartInner>
          )}
        </AutoSizer>
      </ChartContainer>
    </Wrapper>
  )
}

export default LineChart

LineChart.propTypes = propTypes
