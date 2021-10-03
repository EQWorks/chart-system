import React from 'react'
import Pie from '../../src/components/plotly/pie'

import mockData from '../data/plotly/mock-data-pie-bar'
import ResponsiveChartWrapper from '../nivo/responsive-chart-wrapper'

export default {
  title: 'Plotly/pie',
}

export const Default = () =>
  <ResponsiveChartWrapper>
    <Pie
      data={mockData}
      label='city'
      values={['stat1', 'stat2']}
    />
  </ResponsiveChartWrapper>

export const Donut = () =>
  <ResponsiveChartWrapper>
    <Pie
      data={mockData}
      donut
      label='city'
      values={['stat1', 'stat2']}
    />
  </ResponsiveChartWrapper>

export const NoLabels = () =>
  <ResponsiveChartWrapper>
    <Pie
      data={mockData}
      showPercentage={false}
      label='city'
      values={['stat1', 'stat2']}
    />
  </ResponsiveChartWrapper>
