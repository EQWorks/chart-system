import React from 'react'
import Line from '../../src/components/plotly/line'

import mockData from '../data/plotly/mock-data-line-scatter'
import ResponsiveChartWrapper from '../shared/responsive-chart-wrapper'

export default {
  title: 'Plotly/line',
}

const Template = (args) =>
  <ResponsiveChartWrapper>
    <Line
      data={mockData}
      x='age'
      y={['stat1', 'stat2']}
      {...args}
    />
  </ResponsiveChartWrapper>

export const Default = Template.bind({})

export const Spline = Template.bind({})
Spline.args = { spline: true }
