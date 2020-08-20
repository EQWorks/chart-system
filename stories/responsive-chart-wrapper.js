import React from 'react'
import PropTypes from 'prop-types'
import GridLayout, { WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import styled from 'styled-components'

const ResponsiveGridLayout = WidthProvider(GridLayout)

const ChartDiv = styled.div`
  border-style: solid;
  border-width: 0.01px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
`

const layout = [
  { i: 'a', x: 0, y: 0, w: 200, h: 6 }
]

const propTypes = { children: PropTypes.element }

const ResponsiveChartWrapper = ({ children }) => (
  <ResponsiveGridLayout className='layout' layout={layout} cols={300} rowHeight={30}>
    <ChartDiv key='a' >
      {children}
    </ChartDiv>
  </ResponsiveGridLayout>
)

ResponsiveChartWrapper.propTypes = propTypes

export default ResponsiveChartWrapper
