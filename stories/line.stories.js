import React from 'react'
import { storiesOf } from '@storybook/react'

import LineChart from '../src/components/line-chart'
import lineChartData from './data/line-chart-data'
import d from './data/overlord-ad-position'
import OS from './data/overlord-OS'
import barChartData from './data/bar-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


const title = 'My Title'

storiesOf('Line Chart', module)
  .add('Widget Line Chart', () => (
    <ResponsiveChartWrapper>
      <LineChart
        title={ title }
        data={ lineChartData }
        indexBy='country'
        xKey='vehicle'
        yKeys={ ['amount'] }
        xScale={{ type: 'point' }}
        axisBottomLegendLabel={ 'axisBottomLegend' }
        axisLeftLegendLabel={ 'axisLeftLegend' }
      />
    </ResponsiveChartWrapper>
  ))
  .add('Index By Keys', () => (
    <ResponsiveChartWrapper>
      <LineChart
        title={ title }
        indexByValue={ false }
        xScale={{ type: 'point' }}
        data={ barChartData }
        axisBottomLegendLabel={ 'axisBottomLegend' }
        axisLeftLegendLabel={ 'axisLeftLegend' }
      />
    </ResponsiveChartWrapper>
  ))
  .add('Overlord adPosition', () => (
    <ResponsiveChartWrapper>
      <LineChart
        title='Overlord adPosition'
        indexBy='Name'
        xKey='Date'
        yKeys={ ['Imps'] }
        axisBottomLegendLabel={ 'Date' }
        // parse dates into js objects so sort function works properly
        data={ d.adPosition.map((x) => ({ ...x, Date: new Date(x.Date) })) }
        axisBottomOrder='asc'
        maxRowLegendItems={ 6 }
        // if dates are objects, no need to format
        xScale={{
          type: 'time',
          // format: '%m-%d-%Y',
          useUTC: false,
          // precision: 'day',
        }}
        axisLeftLegendLabel={ 'impressions' }
        // do date manipulation with your fav library
        tooltipFormatX={ (value) => value.toDateString() }
        axisBottomLabelDisplayFn={ (value) => value.toDateString().slice(4, 10) }
      />
    </ResponsiveChartWrapper>
  ))
  .add('Overlord OS', () => (
    <ResponsiveChartWrapper>
      <LineChart
        title='Overlord OS'
        indexBy='Name'
        xKey='Date'
        yKeys={ ['Imps'] }
        axisBottomLegendLabel={ 'Date' }
        maxRowLegendItems={ 6 }
        // comment next line  out to see relevance
        axisBottomOrder='asc'
        xScale={{
          type: 'time',
          // format: '%m-%d-%Y',
          useUTC: false,
          // precision: 'day',
        }}
        data={ OS.map((x) => ({ ...x, Date: new Date(x.Date) })) }
        axisLeftLegendLabel={ 'impressions' }
        // do date manipulation with your fav library
        tooltipFormatX={ (value) => value.toDateString() }
        axisBottomLabelDisplayFn={ (value) => value.toDateString().slice(4, 10) }
      />
    </ResponsiveChartWrapper>
  ))
  .add('Overlord subtleties: smaller period', () => (
    <ResponsiveChartWrapper>
      <LineChart
        title='Overlord adPosition'
        indexBy='Name'
        xKey='Date'
        yKeys={ ['Imps'] }
        axisBottomLegendLabel={ 'Date' }
        axisBottomOrder='asc'
        maxRowLegendItems={ 6 }
        xScale={{
          type: 'time',
          format: '%m-%d-%Y',
          useUTC: false,
        }}
        // if period of time is smaller than 9 days, ticks are duplicate, so need to do values `every day`
        axisBottomLabelValues={ 'every day' }
        data={ d.smallAdPosition }
        axisLeftLegendLabel={ 'Impressions' }
        // do date manipulation with your fav library
        tooltipFormatX={ (value) => value.toDateString() }
      />
    </ResponsiveChartWrapper>
  ))
