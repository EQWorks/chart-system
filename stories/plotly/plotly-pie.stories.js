import React from 'react'
import Pie from '../../src/components/plotly/pie'

import mockData from '../data/plotly/mock-data-pie-bar'
import ResponsiveChartWrapper from '../shared/responsive-chart-wrapper'

export default {
  title: 'Plotly/pie',
}

const Template = (args) =>
  <ResponsiveChartWrapper>
    <Pie
      data={mockData}
      label='city'
      values={['stat1', 'stat2']}
      {...args}
    />
  </ResponsiveChartWrapper>

export const Default = Template.bind({})

export const WithLabelName = Template.bind({})
WithLabelName.args = { showLabelName: true }

export const Donut = Template.bind({})
Donut.args = { donut: true }

export const NoLabels = Template.bind({})
NoLabels.args = { showPercentage: false }
