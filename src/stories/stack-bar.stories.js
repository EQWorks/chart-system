import React from 'react'
import { storiesOf } from '@storybook/react'

import StackedBarChart from '../components/stacked-bar-chart'
import barChartData from '../shared/data/bar-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


storiesOf('StackedBarChart', module)
  .add('Widget Stacked Bar Chart', () => (
    <ResponsiveChartWrapper>
      <StackedBarChart title='My Title' data={barChartData} axisBottomLegendLabel={'Address City'} axisLeftLegendLabel={'Amount'} />
    </ResponsiveChartWrapper>
  ))
