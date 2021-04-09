import React from 'react'
import { storiesOf } from '@storybook/react'

import BarChart from '../src/components/bar-chart/'
import PieChart from '../src/components/pie-chart'

import barChartData from './data/others/bar-chart-data'
import lineChartData from './data/others/line-chart-data'
import pieChartData from './data/others/pie-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


const title = 'My Title'

storiesOf('Legend', module)
  .add('Legend disabled', () => (
    <ResponsiveChartWrapper>
      <BarChart
        data={lineChartData}
        indexBy='country'
        keys={['amount']}
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
        disableLegend={true}
      />
    </ResponsiveChartWrapper>
  ))
  .add('No trimming of Legend', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title={title}
        data={barChartData}
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
        axisBottomOrder={['Airdrie', 'Brandon', 'Abbotsford']}
        trimLegend={false}
      />
    </ResponsiveChartWrapper>
  ))
  .add('Custom bottom legend label numbers', () => (
    <ResponsiveChartWrapper>
      <PieChart
        title={title}
        data={pieChartData}
        isDonut={false}
        maxRowLegendItems={4}
      />
    </ResponsiveChartWrapper>
  ))
