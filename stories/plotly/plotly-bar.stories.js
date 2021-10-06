import React from 'react'
import Bar from '../../src/components/plotly/bar'

import mockData from '../data/plotly/mock-data-pie-bar'
import ResponsiveChartWrapper from '../shared/responsive-chart-wrapper'

export default {
  title: 'Plotly/bar',
}

const Template = (args) =>
  <ResponsiveChartWrapper>
    <Bar
      data={mockData}
      x='city'
      y={['stat1', 'stat2']}
      {...args}
    />
  </ResponsiveChartWrapper>

export const Default = Template.bind({})

export const Stacked = Template.bind({})
Default.args = { stacked: true }

