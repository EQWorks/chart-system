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
WithLabelName.args = { 
  showLabelName: true,
}

export const PlotlyOverride = Template.bind({})
PlotlyOverride.args = {
  textinfo: 'label+value',
  hole: 0.9,
}

export const LongDecimals = Template.bind({})
LongDecimals.args = { values: ['stat4'] }

export const Percentage = Template.bind({})
Percentage.args = { values: ['stat3'] }

export const Donut = Template.bind({})
Donut.args = { donut: true }

export const NoLabels = Template.bind({})
NoLabels.args = { showPercentage: false }

export const CustomColors = Template.bind({})
CustomColors.args = { 
  customColors: {
    color1: ['#88CCEE', '#CC6677', '#DDCC77', '#477733', '#0F2288'],
    color2: ['#B24456', '#D3A642'],
  } 
}

export const CustomBaseColor = Template.bind({})
CustomBaseColor.args = {
  baseColor: {
    color1: '#004C86',
    color2: '#CF7047',
  }
}
