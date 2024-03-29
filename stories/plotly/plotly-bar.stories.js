import React from 'react'
import Bar from '../../src/components/plotly/bar'

import mockData from '../data/plotly/mock-data-pie-bar'
import mockDataDealers from '../data/plotly/mock-data-dealers'
import ResponsiveChartWrapper from '../shared/responsive-chart-wrapper'

export default {
  title: 'Plotly/bar',
}

const formatting = val => `${Number(val).toFixed(2)}%`

const Template = (args) =>
  <ResponsiveChartWrapper>
    <Bar
      data={mockData}
      x='city'
      y={['stat1', 'stat2']}
      {...args}
    />
  </ResponsiveChartWrapper>

const FormattingTemplate = (args) => 
  <ResponsiveChartWrapper>
    <Bar
      data={mockDataDealers}
      x='dealer_id'
      y={[
        'hh_income_0_50k', 
        'hh_income_50_100k', 
        'hh_income_100_150k',
        'hh_income_150_200k',
        'hh_income_200k+',
      ]}
      {...args}
    />
  </ResponsiveChartWrapper>

export const Default = Template.bind({})

export const CustomAxisTitles = Template.bind({})
CustomAxisTitles.args = { axisTitles: { y: 'Score' } }

export const ColumnNameAliases = Template.bind({})
ColumnNameAliases.args = { columnNameAliases: { city: 'City New', stat1: 'Stat 1', stat2: 'Stat 2' } }

export const ColumnNameAliasesInverseDomain = Template.bind({})
ColumnNameAliasesInverseDomain.args = {
  columnNameAliases: { city: 'City New', stat1: 'Stat 1', stat2: 'Stat 2' },
  showAxisTitles: { x: false, y: true },
  axisTitles: { y: 'Stats (%)' },
  groupByValue: true,
}

export const Stacked = Template.bind({})
Stacked.args = { stacked: true }

export const PercentageLabel = Template.bind({})
PercentageLabel.args = { tickSuffix: ['%'] }

export const Horizontal = Template.bind({})
Horizontal.args = { orientation: 'h', tickSuffix: ['%'] }

export const HorizontalStacked = Template.bind({})
HorizontalStacked.args = {
  orientation: 'h',
  stacked: true.valueOf,
  showAxisTitles: { x: true },
  axisTitles: { y: 'Impressions' },
}

export const HorizontalFormattedData = FormattingTemplate.bind({})
HorizontalFormattedData.args = {
  orientation: 'h', 
  formatData: { 
    'hh_income_0_50k': formatting,
    'hh_income_50_100k': formatting,
    'hh_income_100_150k': formatting,
    'hh_income_150_200k': formatting,
    'hh_income_200k+': formatting,
  },
}
