import React from 'react'
import PropTypes from 'prop-types'
import { ResponsivePie } from '@nivo/pie'

import styled from 'styled-components'

import 'react-virtualized/styles.css'
import { AutoSizer } from 'react-virtualized'

import Tooltip from '../tooltip'

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
  let right = 140
  let bottom = 86
  let left = 20

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
      bottom = 20
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
      left = 80
    } else {
      if (width < WIDTH_BREAKPOINT_3) {
        left = 80
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

const arcLabel = e => (
  <>
    <tspan x="0" y="0">{e.percent}</tspan>
    <tspan x="0" y="15">{e.label} </tspan>
  </>
)

const colors = [
  designSystemColors.blue70,
  designSystemColors.yellow70,
  designSystemColors.pink70,
  designSystemColors.purple70,
  designSystemColors.teal70
]

// sets common props for Nivo ResponsivePie component
const setCommonProps = (width, height, data, isDonut) => {
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
    colors: colors,
    padAngle: 0.7,
    cornerRadius: 3,
    sortByValue: true,
    enableRadialLabels: false,
    legends: isAspectRatio(width, height, aspectRatios.LANDSCAPE)
      ? (height > 100 ? [legend] : [])
      : (width > 400 ? [legend] : []),
    sliceLabel: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? arcLabel : 'percent',
    slicesLabelsSkipAngle: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 20 : 10,
    slicesLabelsTextColor: '#fff',
    innerRadius: isDonut ? 0.6 : 0,
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
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  isDonut: PropTypes.bool
}

// PieChart - creates a pie chart
const PieChart = ({
  data,
  isDonut
}) => {
  let path
  let arc

  const mouseLeaveHandler = () => {
    return (path.forEach((tag, i) => {
      tag.setAttribute('fill', colors[i])
      tag.setAttribute('stroke', colors[i])
    }
    ))
  }

  const mouseOverHandler = (_data, event) => {
    arc = event.target
    let arcColor = arc.getAttribute('fill')
    path = Array.from(arc.parentNode.children).filter(tag => tag.tagName === 'path')

    return (path.forEach(tag => {
      return arcColor !== tag.getAttribute('fill')
        ? (tag.setAttribute('stroke', 'lightgray'), tag.setAttribute('fill', 'lightgray'))
        : null
    }))
  }

  function percentData() {
    let sum = 0

    for (let d of data) {
      sum = sum + d.value
    }

    data.forEach(arc => {
      arc.percent = `${(arc.value * 100 / sum).toFixed(2)}%`
    })
    return sum
  }

  percentData()

  return (
    <>
      <Title>
        Title
      </Title>
      <ChartContainer>
        <AutoSizer>
          {({ height, width }) => (
            <ChartInner height={height} width={width}>
              <ResponsivePie
                {...setCommonProps(width, height, data, isDonut)}
                tooltip={({ id, value, percent, color }) => (
                  <Tooltip
                    label={id}
                    color={color}
                    display={[
                      { label: 'Value', value },
                      { label: 'Share', value: percent },
                    ]}
                  />
                )}
                onMouseEnter={mouseOverHandler}
                onMouseLeave={mouseLeaveHandler}
              >
              </ResponsivePie>
            </ChartInner>
          )}
        </AutoSizer>
      </ChartContainer>
    </>
  )
}

export default PieChart

PieChart.propTypes = propTypes
