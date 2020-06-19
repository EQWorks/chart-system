import React from 'react'
import { storiesOf } from '@storybook/react'

import LineChart from '../components/line-chart'
import lineChartData from '../shared/data/line-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


storiesOf('Line Chart', module)
  .add('Widget Line Chart', () => (
    <ResponsiveChartWrapper>
      <LineChart
        title='Test'
        data={lineChartData}
        indexBy='country'
        xKey='vehicle'
        yKey='amount'
        axisBottomLegendLabel={'axisBottomLegend'}
        axisLeftLegendLabel={'axisLeftLegend'}
      />
    </ResponsiveChartWrapper>
  ))
