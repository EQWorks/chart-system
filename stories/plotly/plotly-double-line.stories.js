import React from 'react'
import DoubleLine from '../../src/components/plotly/double-line'

import mockData from '../data/plotly/mock-data-double-line.json'
import ResponsiveChartWrapper from '../shared/responsive-chart-wrapper'

export default {
  title: 'Plotly/double-line',
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
Default.args = { tickSuffix: ['%', '%'] }

export const CustomAxisTitles = Template.bind({})
CustomAxisTitles.args = {
  axisTitles: { x: 'Canadian City', y: 'Dollar Spend (%)', y2: 'Transactions (%)' },
  tickSuffix: ['%', '%'],
}

export const ColumnNameAliases = Template.bind({})
ColumnNameAliases.args = {
  columnNameAliases: { city: 'New City', spend: 'Spend (%)', transactions: 'Transactions (%)' },
}
