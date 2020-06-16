import React from 'react'
import { storiesOf } from '@storybook/react'

import ChartWrapper from '../components/chart-wrapper'
import LineChart from '../components/line-chart'
import lineChartData from '../shared/data/line-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


storiesOf('Line Chart', module)
  .add('Widget Line Chart', () => (
    <ResponsiveChartWrapper>
      <ChartWrapper title='Test'>
        <LineChart data={lineChartData} axisBottomLegendLabel={'axisBottomLegend'} axisLeftLegendLabel={'axisLeftLegend'} />
      </ChartWrapper>
    </ResponsiveChartWrapper>
  ))
