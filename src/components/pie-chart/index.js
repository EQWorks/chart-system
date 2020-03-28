import React from 'react'
import PropTypes from 'prop-types'
import { ResponsivePie } from '@nivo/pie'

import styled from 'styled-components'

import 'react-virtualized/styles.css'
import { AutoSizer } from 'react-virtualized'

import tooltip from './tooltip'

import pieChartData from '../../shared/constants/pie-chart-data'

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


const arcLabel = e => (
  <>
    <tspan x="0" y="0">{e.percent}</tspan>
    <tspan x="0" y="15">{e.label} </tspan>
  </>
)

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
  translateY: 0,
  effects: [
    {
      on: 'hover',
      style: { itemTextColor: '#000' },
    },
  ],
}


// sets common props for Nivo ResponsivePie component
const setCommonProps = (HEIGHT_WIDTH_RATIO) => {
  return {
    margin: HEIGHT_WIDTH_RATIO > LOWER_ASPECT_RATIO
      ? { top: 25, right: 52, bottom: 79, left: 43 }
      : { top: 35, right: 139, bottom: 69, left: 63 },
    data: pieChartData,
    colors: [
      designSystemColors.blue70,
      designSystemColors.yellow70,
      designSystemColors.pink70,
      designSystemColors.purple70,
      designSystemColors.teal70
    ],
    padAngle: 0.7,
    cornerRadius: 3,
    sortByValue: true,
    enableRadialLabels: false,
    // legends will change format and placement with container width & height changes
    legends: HEIGHT_WIDTH_RATIO > LOWER_ASPECT_RATIO ? [] : [legendMd],
    sliceLabel: HEIGHT_WIDTH_RATIO > LOWER_ASPECT_RATIO ? arcLabel : 'percent',
    slicesLabelsSkipAngle: HEIGHT_WIDTH_RATIO > LOWER_ASPECT_RATIO ? 20 : 10,
    slicesLabelsTextColor: 'white',
    animate: true,
    motionStiffness: 90,
    motionDamping: 15,
    theme: {
      fontSize: 12
    }
  }
}

const propTypes = {
  wrapperWidth: PropTypes.number,
  wrapperHeight: PropTypes.number
}

// PieChart - creates a pie chart
const PieChart = ({
  wrapperWidth,
  wrapperHeight
}) => {
  const HEIGHT_WIDTH_RATIO = wrapperHeight / wrapperWidth

  const commonProps = setCommonProps(HEIGHT_WIDTH_RATIO)

  let path

  let arc

  const mouseLeaveHandler = () => {
    return (path.forEach((tag, i) => {
      tag.setAttribute('fill', commonProps.colors[i])
      tag.setAttribute('stroke', commonProps.colors[i])
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

    for (let d of commonProps.data) {
      sum = sum + d.value
    }
    commonProps.data.forEach(arc => {
      arc.percent = `${(arc.value * 100 / sum).toFixed(2)}%`
    })
    return sum
  }

  percentData()

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
              <ResponsivePie
                {...commonProps}
                tooltip={({ id, value, color }) => tooltip(id, value, color)}
                onMouseEnter={mouseOverHandler}
                onMouseLeave={mouseLeaveHandler}
                theme={{
                  tooltip: {
                    container: {
                      padding: 0
                    }
                  }
                }}
              >
              </ResponsivePie>
            </ChartInner>
          )}
        </AutoSizer>
      </ChartContainer>
    </Wrapper>
  )
}

export default PieChart

PieChart.propTypes = propTypes
