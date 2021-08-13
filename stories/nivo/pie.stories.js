import React from 'react'
import { storiesOf } from '@storybook/react'

import PieChart from '../../src/components/pie-chart'
import pieChartData from '../data/others/pie-chart-data'
import barChartData from '../data/others/bar-chart-data'
import lineChartData from '../data/others/line-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


const title = 'My Title'

storiesOf('Nivo/Pie Chart', module)
  .add('Basic', () => (
    <ResponsiveChartWrapper>
      <PieChart title={title} data={pieChartData} isDonut={false} />
    </ResponsiveChartWrapper>
  ))
  .add('Donut', () => (
    <ResponsiveChartWrapper>
      <PieChart title={title} data={pieChartData} isDonut={true} />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Pie Chart with Slice Labels Disabled', () => (
    <ResponsiveChartWrapper>
      <PieChart title={title} data={pieChartData} isDonut={false} enableSlicesLabels={false} />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Pie Chart with Slice Labels Disabled at Custom Value', () => (
    <ResponsiveChartWrapper>
      <PieChart title={title} data={pieChartData} isDonut={false} slicesLabelsSkipAngle={200} />
    </ResponsiveChartWrapper>
  ))
  .add('Visit Data', () => (
    <ResponsiveChartWrapper>
      <PieChart title='Visits' data={barChartData} isDonut={false} />
    </ResponsiveChartWrapper>
  ))
  .add('Vehicle Data', () => (
    <ResponsiveChartWrapper>
      <PieChart title='Vehicles by Country' data={lineChartData} dataKey='amount' isDonut={false} />
    </ResponsiveChartWrapper>
  ))
