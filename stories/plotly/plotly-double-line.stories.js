import React from 'react'
import DoubleLine from '../../src/components/plotly/double-line'

import mockData from '../data/plotly/mock-data-double-line.json'
import ResponsiveChartWrapper from '../shared/responsive-chart-wrapper'

export default {
  title: 'Plotly/bar-line',
}

const Template = (args) =>
  <ResponsiveChartWrapper>
    <DoubleLine
      data={mockData}
      x='city'
      y={['spend', 'transactions']}
      {...args}
    />
  </ResponsiveChartWrapper>

export const Default = Template.bind({})
Default.args = { showCurrency: true }
