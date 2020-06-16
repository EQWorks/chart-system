import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveLine } from '@nivo/line'

import styled from 'styled-components'
import 'react-virtualized/styles.css'

import { AutoSizer } from 'react-virtualized'

import Tooltip from '../tooltip'

import { getCommonProps } from '../../shared/utils'

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


// sets common props for Nivo ResponsiveLine component
const setCommonProps = (width, height, data, axisBottomLegendLabel, axisLeftLegendLabel) => ({
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
  ...getCommonProps({
    data,
    height,
    width,
    axisBottomLegendLabel,
    axisLeftLegendLabel,
    dash: true,
    tickValues: data[0].data.length,
  })
})

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
        strokeWidth='2px'
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
                colors={Object.keys(color).length === 0 ? { datum: 'color' } : getColor}
                layers={layers}
                onMouseMove={(p, e) => mouseMove(p, e)}
                tooltip={({ point }) => (
                  <Tooltip
                    color={point.borderColor}
                    label={point.serieId}
                    display={[
                      { label: axisBottomLegendLabel, value: point.data.x },
                      { label: axisLeftLegendLabel, value: point.data.y },
                    ]}
                  />
                )}
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
