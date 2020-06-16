import React from 'react'
import { storiesOf } from '@storybook/react'

import ChartWrapper from '../components/chart-wrapper'
import BarChart from '../components/bar-chart'
import barChartData from '../shared/data/bar-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


storiesOf('Bar Chart', module)
  .add('Widget Bar Chart', () => (
    <ResponsiveChartWrapper>
      <ChartWrapper title='My Title'>
        <BarChart data={barChartData} axisBottomLegendLabel={'Address City'} axisLeftLegendLabel={'Visitors'} />
      </ChartWrapper>
    </ResponsiveChartWrapper>
  ))
