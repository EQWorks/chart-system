import React from 'react'
import { storiesOf } from '@storybook/react'

import ChartWrapper from '../components/chart-wrapper'
import StackedBarChart from '../components/stacked-bar-chart'
import barChartData from '../shared/data/bar-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


storiesOf('StackedBarChart', module)
  .add('Widget Stacked Bar Chart', () => (
    <ResponsiveChartWrapper>
      <ChartWrapper title='My Title'>
        <StackedBarChart data={barChartData} axisBottomLegendLabel={'Address City'} axisLeftLegendLabel={'Amount'} />
      </ChartWrapper>
    </ResponsiveChartWrapper>
  ))
