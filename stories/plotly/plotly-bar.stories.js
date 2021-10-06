import React from 'react'
import Bar from '../../src/components/plotly/bar'

import mockData from '../data/plotly/mock-data-pie-bar'
import ResponsiveChartWrapper from '../shared/responsive-chart-wrapper'

export default {
  title: 'Plotly/bar',
}

export const Default = () =>
  <ResponsiveChartWrapper>
    <Bar
      data={mockData}
      x='city'
      y={['stat1', 'stat2']}
    />
  </ResponsiveChartWrapper>

export const Stacked = () =>
  <ResponsiveChartWrapper>
    <Bar
      data={mockData}
      stacked
      x='city'
      y={['stat1', 'stat2']}
    />
  </ResponsiveChartWrapper>
