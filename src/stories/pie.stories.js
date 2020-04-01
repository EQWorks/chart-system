import React from 'react'

import PieChart from '../components/pie-chart'
import pieChartData from '../shared/constants/pie-chart-data'

import GridLayout, { WidthProvider } from 'react-grid-layout'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import styled from 'styled-components'

import { storiesOf } from '@storybook/react'

export default {
  title: 'Pie'
}

const layout = [
  { i: 'a', x: 0, y: 0, w: 6, h: 6 }
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

storiesOf('Pie Chart', module)
  .add('Widget Pie Chart', () => (
    <ResponsiveGridLayout className='layout' layout={layout} cols={12} rowHeight={30} >
      <Wrapper key='a'>
        <PieChart data={pieChartData} isDonut={true}></PieChart>
      </Wrapper>
    </ResponsiveGridLayout>
  ))
