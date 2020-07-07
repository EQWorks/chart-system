import React from 'react'
import { storiesOf } from '@storybook/react'

import PieChart from '../components/pie-chart'
import pieChartData from '../shared/data/pie-chart-data'
import barChartData from '../shared/data/bar-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


storiesOf('Pie Chart', module)
  .add('Widget Pie Chart', () => (
    <ResponsiveChartWrapper>
      <PieChart title='My Title' data={pieChartData} isDonut={false} />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Pie Chart Donut', () => (
    <ResponsiveChartWrapper>
      <PieChart title='My Title' data={pieChartData} isDonut={true} />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Pie Chart with Slice Labels Disabled', () => (
    <ResponsiveChartWrapper>
      <PieChart title='My Title' data={pieChartData} isDonut={false} enableSlicesLabels={false} />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Pie Chart with Slice Labels Disabled at Custom Value', () => (
    <ResponsiveChartWrapper>
      <PieChart title='My Title' data={pieChartData} isDonut={false} slicesLabelsSkipAngle={ 200 } />
    </ResponsiveChartWrapper>
  ))
  .add('Visit Data', () => (
    <ResponsiveChartWrapper>
      <PieChart title='Visits' data={barChartData} isDonut={false} />
    </ResponsiveChartWrapper>
  ))
