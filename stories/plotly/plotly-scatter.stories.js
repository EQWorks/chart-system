import React from 'react'
import Scatter from '../../src/components/plotly/scatter'

import mockData from '../data/plotly/mock-data-line-scatter'
import ResponsiveChartWrapper from '../shared/responsive-chart-wrapper'

export default {
  title: 'Plotly/scatter',
}

export const Default = () =>
  <ResponsiveChartWrapper>
    <Scatter
      data={mockData}
      x='age'
      y={['stat1', 'stat2']}
    />
  </ResponsiveChartWrapper>

export const WithLines = () =>
  <ResponsiveChartWrapper>
    <Scatter
      data={mockData}
      showLines
      x='age'
      y={['stat1', 'stat2']}
    />
  </ResponsiveChartWrapper>
