import React from 'react'
import { storiesOf } from '@storybook/react'

import LineChart from '../components/line-chart'
import lineChartData from '../shared/data/line-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


export default {
  title: 'Line'
}

storiesOf('Line Chart', module)
  .add('Widget Line Chart', () => (
    <ResponsiveChartWrapper>
      <LineChart data={lineChartData} axisBottomLegendLabel={'axisBottomLegend'} axisLeftLegendLabel={'axisLeftLegend'}></LineChart>
    </ResponsiveChartWrapper>
  ))
