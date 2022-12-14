import React from 'react'
import BarLine from '../../src/components/plotly/bar-line'

import mockData from '../data/plotly/mock-data-bar-line-chart.json'
import ResponsiveChartWrapper from '../shared/responsive-chart-wrapper'

export default {
  title: 'Plotly/bar-line',
}

const customColor = {
  color1: ['#004C86', '#CF7047', '#1F7F79', '#B24456', '#582A7D', '#D3A642', '#3175AC', '#7A002D',
  '#437345', '#802C6D'],
  color2: []
}

const baseColor = {
  color1: '#004C86',
  color2: '#CF7047',
}

const Template = (args) =>
  <ResponsiveChartWrapper>
    <BarLine
      data={mockData}
      x='city'
      y={['spend', 'spend1']}
      y2={['transactions', 'transactions1']}
      {...args}
    />
  </ResponsiveChartWrapper>

export const Default = Template.bind({})
Default.args = { tickPrefix: ['$'] }

export const CustomAxisTitles = Template.bind({})
CustomAxisTitles.args= {
  showAxisTitles: { x: true, y: false, y2: true },
  axisTitles: { x: 'Canadian City', y2: 'Score' },
}

export const DashboardSample = Template.bind({})
DashboardSample.args= {
  tickPrefix: ['$'],
  testBaseColor: baseColor,
}
