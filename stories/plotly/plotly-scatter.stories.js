import React from 'react'
import Scatter from '../../src/components/plotly/scatter'

import mockData from '../data/plotly/mock-data-line-scatter'
import ResponsiveChartWrapper from '../shared/responsive-chart-wrapper'

export default {
  title: 'Plotly/scatter',
}

const Template = (args) =>
  <ResponsiveChartWrapper>
    <Scatter
      data={mockData}
      x='age'
      y={['stat1', 'stat2']}
      {...args}
    />
  </ResponsiveChartWrapper>

export const Default = Template.bind({})

export const WithLines = Template.bind({})
WithLines.args = { showLines: true }
