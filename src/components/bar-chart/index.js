import React from 'react'

import PropTypes from 'prop-types'
import { ResponsiveBar } from '@nivo/bar'

import styled from 'styled-components'
import 'react-virtualized/styles.css'

import { AutoSizer } from 'react-virtualized'

import Tooltip from '../tooltip'

import designSystemColors from '../../shared/constants/design-system-colors'

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

// sets common props for Nivo ResponsiveBar component
const setCommonProps = (width, height, data, axisBottomLegendLabel, axisLeftLegendLabel) => ({
  keys: ['visits', 'visitors', 'repeat_visitors', 'single_visitors', 'multi_visitors'],
  indexBy: Object.keys(data[0])[0],
  colors: [
    designSystemColors.blue70,
    designSystemColors.yellow70,
    designSystemColors.pink70,
    designSystemColors.purple70,
    designSystemColors.teal70,
  ],
  groupMode: 'grouped',
  layout: 'vertical',
  axisTop: null,
  axisRight: null,
  enableRadialLabels: false,
  enableGridY: true,
  enableLabel: false,
  animate: true,
  motionStiffness: 90,
  motionDamping: 15,
  ...getCommonProps({
    data,
    height,
    width,
    axisBottomLegendLabel,
    axisLeftLegendLabel,
    legendProps: { dataFrom: 'keys', justify: false },
    tickValues: 8,
  })
})

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
                // also ({ data, index, theme })
                tooltip={({ id, value, color, indexValue }) => (
                  <Tooltip
                    label={id}
                    color={color}
                    display={[
                      { label: axisBottomLegendLabel, value: indexValue },
                      { label: axisLeftLegendLabel, value },
                    ]}
                  />
                )}
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
