import React from 'react'
import { storiesOf } from '@storybook/react'

import ChartWrapper from '../components/chart-wrapper'
import PieChart from '../components/pie-chart'
import pieChartData from '../shared/data/pie-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


storiesOf('Pie Chart', module)
  .add('Widget Pie Chart', () => (
    <ResponsiveChartWrapper>
      <ChartWrapper title='My Title'>
        <PieChart data={pieChartData} isDonut={true} />
      </ChartWrapper>
    </ResponsiveChartWrapper>
  ))
