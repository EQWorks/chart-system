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

export const CustomAxisTitles = Template.bind({})
CustomAxisTitles.args = { axisTitles: { x: 'Stat', y: 'Score' } }

export const WithLines = Template.bind({})
WithLines.args = { showLines: true }

export const ColumnNameAliases = Template.bind({})
ColumnNameAliases.args = { columnNameAliases: { stat1: 'Stat 1', stat2: 'Stat 2', age: 'Age' } }

export const ColumnNameAliasesInverseDomain = Template.bind({})
ColumnNameAliasesInverseDomain.args = {
  columnNameAliases: { stat1: 'Stat 1', stat2: 'Stat 2', age: 'Age' },
  groupByValue: true,
}
