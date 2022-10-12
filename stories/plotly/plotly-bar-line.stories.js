import React from 'react'
import BarLine from '../../src/components/plotly/bar-line'

import mockData from '../data/plotly/mock-data-bar-line-chart.json'
import ResponsiveChartWrapper from '../shared/responsive-chart-wrapper'

export default {
  title: 'Plotly/bar-line',
}

const Template = (args) =>
  <ResponsiveChartWrapper>
    <BarLine
      data={mockData}
      x='city'
      y={['spend', 'transactions']}
      {...args}
    />
  </ResponsiveChartWrapper>

export const Default = Template.bind({})
Default.args = { showCurrency: true }

export const CustomAxisTitles = Template.bind({})
CustomAxisTitles.args= {
  showAxisTitles: { x: true, y: false, y2: true },
  axisTitles: { x: 'Canadian City', y2: 'Score' },
}
