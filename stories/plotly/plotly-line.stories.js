import React from 'react'
import Line from '../../src/components/plotly/line'

import mockData from '../data/plotly/mock-data-line-scatter'
import ResponsiveChartWrapper from '../nivo/responsive-chart-wrapper'

export default {
  title: 'Plotly/line',
}

export const Default = () =>
  <ResponsiveChartWrapper>
    <Line
      data={mockData}
      x='age'
      y={['stat1', 'stat2']}
    />
  </ResponsiveChartWrapper>

export const Spline = () =>
  <ResponsiveChartWrapper>
    <Line
      data={mockData}
      spline
      x='age'
      y={['stat1', 'stat2']}
    />
  </ResponsiveChartWrapper>
