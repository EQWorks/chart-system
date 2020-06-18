import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ResponsiveLine } from '@nivo/line'

import Tooltip from '../tooltip'

import designSystemColors from '../../shared/constants/design-system-colors'
import { getCommonProps } from '../../shared/utils'


const Container = styled.div`
  height: 100%;
  width: 100%
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
  axisLeftLegendLabel: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

const defaultProps = {
  axisBottomLegendLabel: '',
  axisLeftLegendLabel: '',
  width: 100,
  height: 100,
}

const colors = [
  designSystemColors.blue70,
  designSystemColors.yellow70,
  designSystemColors.pink70,
  designSystemColors.purple70,
  designSystemColors.teal70
]
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

// LineChart - creates a line chart
const ResponsiveLineChart = ({
  data: baseData,
  axisBottomLegendLabel,
  axisLeftLegendLabel,
  width,
  height,
}) => {
  // TODO properly handle arbitrary amount of data without randomizing colors
  const data = useMemo(() => baseData.map(datum => ({
    ...datum,
    color: getRandomColor()
  })), [baseData])
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
    // NOTE: ResponsiveLine doesn't work when directly receiving onMouseLeave
    <Container onMouseLeave={mouseLeave}>
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
    </Container>
  )
}

ResponsiveLineChart.defaultProps = defaultProps
ResponsiveLineChart.propTypes = propTypes

export default ResponsiveLineChart
