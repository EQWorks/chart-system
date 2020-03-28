import React from 'react'

import StackedBarChart from '../components/stacked-bar-chart'

import barChartData from '../shared/constants/bar-chart-data'

import GridLayout, { WidthProvider } from 'react-grid-layout'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'


import styled from 'styled-components'

import { storiesOf } from '@storybook/react'

export default {
  title: 'Stack Bar Chart'
}

const layout = [
  { i: 'a', x: 0, y: 0, w: 6, h: 6, minWidth: 320, minHeight: 240 }
]

const Wrapper = styled.div`
  width: ${ props => props.wrapperWidth}px;
  height: ${ props => props.wrapperHeight}px;
  border-style: solid;
  border-width: 0.01px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
`


const ResponsiveGridLayout = WidthProvider(GridLayout)

storiesOf('StackedBarChart', module)
  .add('Widget Stacked Bar Chart', () => (
    <ResponsiveGridLayout layout={layout} cols={12} rowHeight={30} >
      <Wrapper key="a">
        <StackedBarChart data={barChartData} axisBottomLegendLabel={'Address City'} axisLeftLegendLabel={'Amount'}></StackedBarChart>
      </Wrapper>
    </ResponsiveGridLayout>
  ))
