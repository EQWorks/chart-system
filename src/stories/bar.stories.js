import React from 'react'
import { storiesOf } from '@storybook/react'

import BarChart from '../components/bar-chart/'
import barChartData from '../shared/data/bar-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


storiesOf('Bar Chart', module)
  .add('Widget Bar Chart', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title='My Title'
        data={barChartData}
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
      />
    </ResponsiveChartWrapper>
  ))
