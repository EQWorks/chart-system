import React from 'react'
import PyramidBar from '../../src/components/plotly/pyramid-bar'

import mockData from '../data/plotly/mock-data-pyramid-bar'
import ResponsiveChartWrapper from '../shared/responsive-chart-wrapper'

export default {
  title: 'Plotly/pyramid-bar',
}

const Template = (args) =>
  <ResponsiveChartWrapper>
    <PyramidBar
      data={mockData}
      x={[1000, 700, 300]}
      y={['man', 'woman']}
      {...args}
    />
  </ResponsiveChartWrapper>

export const Default = Template.bind({})

export const Percentage = Template.bind({})
Percentage.args = { percentage: true }

