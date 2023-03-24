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

export const CustomAxisTitles = Template.bind({})
CustomAxisTitles.args = { axisTitles: { x: 'Stat', y: '%' } }

export const Spline = Template.bind({})
Spline.args = { spline: true }

export const ColumnNameAliases = Template.bind({})
ColumnNameAliases.args = { columnNameAliases: { age: 'Age', stat1: 'Stat 1', stat2: 'Stat 2' } }

export const ColumnNameAliasesInverseDomain = Template.bind({})
ColumnNameAliasesInverseDomain.args = {
  columnNameAliases: { stat1: 'Stat 1', stat2: 'Stat 2', age: 'Age' },
  groupByValue: true,
}
