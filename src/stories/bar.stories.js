import React from 'react'
import { storiesOf } from '@storybook/react'

import BarChart from '../components/bar-chart'
import barChartData from '../shared/data/bar-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


export default {
  title: 'Bar Chart'
}

storiesOf('Bar Chart', module)
  .add('Widget Bar Chart', () => (
    <ResponsiveChartWrapper>
      <BarChart data={barChartData} axisBottomLegendLabel={'Address City'} axisLeftLegendLabel={'Visitors'}></BarChart>
    </ResponsiveChartWrapper>
  ))
