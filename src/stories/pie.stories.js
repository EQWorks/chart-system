import React from 'react'
import { storiesOf } from '@storybook/react'

import PieChart from '../components/pie-chart'
import pieChartData from '../shared/data/pie-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


storiesOf('Pie Chart', module)
  .add('Widget Pie Chart', () => (
    <ResponsiveChartWrapper>
      <PieChart title='My Title' data={pieChartData} isDonut={true} />
    </ResponsiveChartWrapper>
  ))
