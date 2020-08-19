import React from 'react'
import { storiesOf } from '@storybook/react'

import LineChart from '../src/components/line-chart'
import lineChartData from '../src/shared/data/line-chart-data'
import barChartData from '../src/shared/data/bar-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'
import adPositionData from '../src/shared/data/ad-position'
import languageData from '../src/shared/data/overlord-language'


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
  .add('Overlord Language', () => {

    return (
      <ResponsiveChartWrapper>
        <LineChart
          title='Overlord Language'
          indexBy='Name'
          xKey='Date'
          yKeys={['Imps']}
          axisBottomLegendLabel={'Date'}
          axisBottomOrder='asc'
          maxRowLegendItems={6}
          data={languageData}
          xScale={{
            type: 'time',
            format: '%m-%d-%Y',
            precision: 'day'
          }}
          // do date manipulation with your fav library
          tooltipFormatX={(value) => value.toDateString()}
          axisLeftLegendLabel={'impressions'}
        />
      </ResponsiveChartWrapper>
    )
  })
  .add('Overlord adPosition', () => {
    const data = Object.values(adPositionData.reduce((acc, el) => {
      let name = `${el.Name}${el.Date}`
      if (acc[name]) {
        acc[name].imps += el.Imps
      } else {
        acc[name] = {
          Date: el.Date,
          Name: el.Name,
          Imps: el.Imps
        }
      }
      return acc
    }, {}))

    // if one of the index in date has at least one missing x value (they are not equal across all indexes), line is messed up
    const processedLabelValues = [... new Set(data.map((x) => x.Date))]


    return (
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
            precision: 'day'
          }}
          data={adPositionData}
          axisLeftLegendLabel={'impressions'}
          // do date manipulation with your fav library
          tooltipFormatX={(value) => value.toDateString()}
        />
      </ResponsiveChartWrapper>
    )
  })
