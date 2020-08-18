import React from 'react'
import { storiesOf } from '@storybook/react'

import LineChart from '../src/components/line-chart'
import lineChartData from '../src/shared/data/line-chart-data'
import barChartData from '../src/shared/data/bar-chart-data'
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
        xScale={{ type: 'point' }}
        axisBottomLegendLabel={'axisBottomLegend'}
        axisLeftLegendLabel={'axisLeftLegend'}
      />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Line Chart with custom bottom legend label numbers', () => (
    <ResponsiveChartWrapper>
      <LineChart
        title='Test'
        data={lineChartData}
        indexBy='country'
        xKey='vehicle'
        yKey='amount'
        xScale={{ type: 'point' }}
        axisBottomLegendLabel={'axisBottomLegend'}
        axisLeftLegendLabel={'axisLeftLegend'}
        maxRowLegendItems={ 4 }
      />
    </ResponsiveChartWrapper>
  ))
  .add('Index By Keys', () => (
    <ResponsiveChartWrapper>
      <LineChart
        title='Test'
        indexByValue={false}
        xScale={{ type: 'point' }}
        data={barChartData}
        axisBottomLegendLabel={'axisBottomLegend'}
        axisLeftLegendLabel={'axisLeftLegend'}
      />
    </ResponsiveChartWrapper>
  ))
  .add('Bottom Axis Order', () => (
    <ResponsiveChartWrapper>
      <LineChart
        title='Test'
        indexByValue={false}
        xScale={{ type: 'point' }}
        data={barChartData}
        axisBottomOrder='desc'
        axisBottomLegendLabel={'axisBottomLegend'}
        axisLeftLegendLabel={'axisLeftLegend'}
      />
    </ResponsiveChartWrapper>
  ))
