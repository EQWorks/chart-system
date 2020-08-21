import React from 'react'
import { storiesOf } from '@storybook/react'

import LineChart from '../src/components/line-chart'
import lineChartData from './data/line-chart-data'
import adPositionData from './data/overlord-ad-position'
import barChartData from './data/bar-chart-data'
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
        maxRowLegendItems={4}
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
  .add('Overlord adPosition', () => (
    <ResponsiveChartWrapper>
      <LineChart
        title='Overlord adPosition'
        indexBy='Name'
        xKey='Date'
        yKeys={['Imps']}
        axisBottomLegendLabel={'Date'}
        axisBottomOrder='asc'
        maxRowLegendItems={6}
        xScale={{
          type: 'time',
          format: '%m-%d-%Y',
          // precision: 'day'
        }}
        data={adPositionData}
        axisLeftLegendLabel={'impressions'}
        // do date manipulation with your fav library
        tooltipFormatX={(value) => value.toDateString()}
      />
    </ResponsiveChartWrapper>
  )
  )
