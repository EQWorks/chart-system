import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveLine } from '@nivo/line'

import styled from 'styled-components'
import 'react-virtualized/styles.css'

import { AutoSizer } from 'react-virtualized'

import tooltip from './tooltip'

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

// sets common props for Nivo ResponsiveLine component
const setCommonProps = (width, height, data, axisBottomLegendLabel, axisLeftLegendLabel) => {
  const LEGEND_HEIGHT = 17

  const legend = {
    anchor: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 'right' : 'bottom',
    direction: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 'column' : 'row',
    itemWidth: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 84.5 : 83,
    itemHeight: LEGEND_HEIGHT,
    symbolSize: 8,
    symbolSpacing: 6,
    symbolShape: 'circle',
    translateX: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 99 : 8.5,
    translateY: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 0 : 74
  }

  return {
    margin: setChartMargin(width, height),
    data: data,
    xScale: { type: 'point' },
    yScale: { type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false },
    pointColor: { theme: 'background' },
    pointBorderWidth: 0,
    pointBorderColor: { from: 'serieColor' },
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
      // we hide tick labels up to a certain width
      format: (d) => isLess(height, HEIGHT_BREAKPOINT_2) ? null : `${d}`,
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
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  axisBottomLegendLabel: PropTypes.string,
  axisLeftLegendLabel: PropTypes.string
}

// LineChart - creates a line chart
const ResponsiveLineChart = ({
  data,
  axisBottomLegendLabel,
  axisLeftLegendLabel
}) => {

  const customLines = ({ series, lineGenerator }) => {
    return series.map(datum => (
      <path
        key={datum.id}
        d={lineGenerator(datum.data.map(d => {
          return {
            x: d.position.x,
            y: d.position.y
          }
        }))}
        fill='none'
        stroke={datum.color}
        strokeWidth={color.serieId === datum.id ? '4px' : '2px'}
      />
    ))
  }

  const [color, setColor] = useState({})
  const [layers, setLayers] = useState([
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
  ])

  const mouseLeave = () => {
    setColor({})
    setLayers([
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
    ])
  }

  const mouseMove = (p) => {
    const newLayer = [
      'grid',
      'markers',
      'axes',
      'areas',
      'crosshair',
      customLines,
      'points',
      'slices',
      'mesh',
      'legends'
    ]
    setColor(p)
    setLayers(newLayer)
  }

  const getColor = line => {
    if (line.id === color.serieId) {
      return line.color
    } else {
      return '#d4d4d4'
    }
  }

  return (
    <>
      <Title>
        Test
      </Title>
      <ChartContainer>
        <AutoSizer>
          {({ height, width }) => (
            <ChartInner id='chart-inner' height={height} width={width} onMouseLeave={mouseLeave}>
              <ResponsiveLine
                {...setCommonProps(width, height, data, axisBottomLegendLabel, axisLeftLegendLabel)}
                colors={Object.keys(color).length === 0 ? {datum: 'color'} : getColor}
                layers={layers}
                onMouseMove={(p, e) => mouseMove(p, e)}
                tooltip={(slice) => tooltip(slice)}
              >
              </ResponsiveLine>
            </ChartInner>
          )}
        </AutoSizer>
      </ChartContainer>
    </>
  )
}

export default ResponsiveLineChart

ResponsiveLineChart.propTypes = propTypes
