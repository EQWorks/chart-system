import React from 'react'
import { storiesOf } from '@storybook/react'

import StackedBarChart from '../components/stacked-bar-chart'
import barChartData from '../shared/data/bar-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


export default {
  title: 'Stack Bar Chart'
}

storiesOf('StackedBarChart', module)
  .add('Widget Stacked Bar Chart', () => (
    <ResponsiveChartWrapper>
      <StackedBarChart data={barChartData} axisBottomLegendLabel={'Address City'} axisLeftLegendLabel={'Amount'}></StackedBarChart>
    </ResponsiveChartWrapper>
  ))
