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
      y={['transactions']}
      y2={['transactions1']}
      {...args}
    />
  </ResponsiveChartWrapper>

export const Default = Template.bind({})

export const LineMarkersAndFill = Template.bind({})
LineMarkersAndFill.args= {
  showLineMarkers: true,
  lineFill: true,
}

export const CustomColors = Template.bind({})
CustomColors.args= {
  y: ['transactions', 'transactions1'],
  y2: ['transactions', 'transactions1'],
  customColors: {
    color1: ['#004C86', '#1F7F79', '#D3A642', '#3175AC'],
    color2: ['#B24456', '#D3A642']
  }
}

export const CustomBaseColors = Template.bind({})
CustomBaseColors.args= {
  y: ['transactions', 'transactions1'],
  y2: ['transactions', 'transactions1'],
  baseColor: {
    color1: '#004C86',
    color2: '#CF7047',
  }
}

export const MultipleYaxis = Template.bind({})
MultipleYaxis.args= {
  y: ['spend'],
  y2: ['transactions'],
  tickPrefix: ['$'],
  sharedYAxis: false,
}

export const CustomAxisTitles = Template.bind({})
CustomAxisTitles.args= {
  y: ['spend'],
  y2: ['transactions'],
  tickPrefix: ['$'],
  sharedYAxis: false,
  showAxisTitles: { x: true, y: false, y2: true },
  axisTitles: { x: 'Canadian City', y: 'Custom Spend', y2: 'Custom Transactions' },
}
