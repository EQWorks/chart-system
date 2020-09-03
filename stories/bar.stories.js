import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'

import BarChart from '../src/components/bar-chart/'
import barChartData from './data/bar-chart-data'
import bannerData from './data/overlord-banner'
import scatterChartData from './data/scatter-chart-data'
import lineChartData from './data/line-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


const title = 'My Title'

storiesOf('Bar Chart', module)
  .add('Stacked', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title={ title }
        data={ barChartData }
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
      />
    </ResponsiveChartWrapper>
  ))
  .add('Dynamic Data - legend update', () => {
    const [data, setData] = useState(barChartData)
    return (
      <ResponsiveChartWrapper>
        <button
          onClick={ () => setData([{
            address_city: 'Sauga',
            dopeness: 1000,
            awesomeness: 800,
          },
          {
            address_city: 'T-Dot',
            dopeness: 2000,
            awesomeness: 2100,
          }]) }
        >Change Data</button>
        <br />
        <BarChart
          data={ data }
          axisBottomLegendLabel='Address City'
          axisLeftLegendLabel='Visitors'
        />
      </ResponsiveChartWrapper>
    )
  })
  .add('No Label Trim', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title={ title }
        data={ barChartData }
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
        axisBottomTrim={ false }
      />
    </ResponsiveChartWrapper>
  ))
  .add('Formatted X Label', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title={ title }
        data={ barChartData }
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
        axisBottomLabelDisplayFn={ d => d.substring(0, 2) }
      />
    </ResponsiveChartWrapper>
  ))
  .add('Formatted Y Label', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title={ title }
        data={ barChartData }
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
        axisLeftLabelDisplayFn={ d => d + 'k' }
      />
    </ResponsiveChartWrapper>
  ))
  .add('Bottom Axis Order - Descending', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title={ title }
        data={ barChartData }
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
        axisBottomOrder='desc'
      />
    </ResponsiveChartWrapper>
  ))
  .add('Bottom Axis Order - Exact', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title={ title }
        data={ barChartData }
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
        axisBottomOrder={ ['Airdrie', 'Brandon', 'Abbotsford'] }
      />
    </ResponsiveChartWrapper>
  ))
  .add('Grouped', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title={ title }
        data={ barChartData }
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
      />
    </ResponsiveChartWrapper>
  ))
  .add('Scatter Chart Data', () => (
    <ResponsiveChartWrapper>
      <BarChart
        data={ scatterChartData }
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
      />
    </ResponsiveChartWrapper>
  ))
  .add('Line Chart Data - Vehicle', () => (
    <ResponsiveChartWrapper>
      <BarChart
        data={ lineChartData }
        indexBy='vehicle'
        keys={ ['amount'] }
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
      />
    </ResponsiveChartWrapper>
  ))
  .add('Line Chart Data - Country', () => (
    <ResponsiveChartWrapper>
      <BarChart
        data={ lineChartData }
        indexBy='country'
        keys={ ['amount'] }
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
      />
    </ResponsiveChartWrapper>
  ))
  .add('Line Chart Data - Grouped By Keys', () => (
    <ResponsiveChartWrapper>
      <BarChart
        data={ lineChartData }
        groupByKey='vehicle'
        valueKey='amount'
        indexBy='country'
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
      />
    </ResponsiveChartWrapper>
  ))
  .add('overlord banner data', () => (
    <ResponsiveChartWrapper>
      <BarChart
        data={ bannerData.map((x) => ({ ...x, Date: new Date(x.Date) })) }
        groupByKey='Name'
        valueKey='Imps'
        indexBy='Date'
        axisBottomLegendLabel='Date'
        axisLeftLegendLabel='Impressions'
        axisBottomOrder='asc'
        groupMode='grouped'
        maxRowLegendItems={ 6 }
        tooltipFormatX={ (value) => value.toDateString() }
        // manipulate X labes as you'd like
        axisBottomLabelDisplayFn={ (value) => value.toDateString().slice(4,10) }
      />
    </ResponsiveChartWrapper>
  ))
