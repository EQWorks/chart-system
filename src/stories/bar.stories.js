import React from 'react'
import { storiesOf } from '@storybook/react'

import BarChart from '../components/bar-chart/'
import barChartData from '../shared/data/bar-chart-data'
import scatterChartData from '../shared/data/scatter-chart-data'
import lineChartData from '../shared/data/line-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


storiesOf('Bar Chart', module)
  .add('Stacked', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title='My Title'
        data={barChartData}
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
      />
    </ResponsiveChartWrapper>
  ))
  .add('No Label Trim', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title='My Title'
        data={barChartData}
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
        axisBottomTrim={false}
      />
    </ResponsiveChartWrapper>
  ))
  .add('Formatted X Label', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title='My Title'
        data={barChartData}
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
        axisBottomLabelDisplayFn={d => d.substring(0,2)}
      />
    </ResponsiveChartWrapper>
  ))
  .add('Formatted Y Label', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title='My Title'
        data={barChartData}
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
        axisLeftLabelDisplayFn={d => d + 'k'}
      />
    </ResponsiveChartWrapper>
  ))
  .add('Bottom Axis Order - Descending', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title='My Title'
        data={barChartData}
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
        title='My Title'
        data={barChartData}
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
        axisBottomOrder={['Airdrie', 'Brandon', 'Abbotsford']}
      />
    </ResponsiveChartWrapper>
  ))
  .add('Grouped', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title='My Title'
        data={barChartData}
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
      />
    </ResponsiveChartWrapper>
  ))
  .add('Scatter Chart Data', () => (
    <ResponsiveChartWrapper>
      <BarChart
        data={scatterChartData}
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
      />
    </ResponsiveChartWrapper>
  ))
  .add('Line Chart Data - Vehicle', () => (
    <ResponsiveChartWrapper>
      <BarChart
        data={lineChartData}
        indexBy='vehicle'
        keys={['amount']}
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
      />
    </ResponsiveChartWrapper>
  ))
  .add('Line Chart Data - Country', () => (
    <ResponsiveChartWrapper>
      <BarChart
        data={lineChartData}
        indexBy='country'
        keys={['amount']}
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
      />
    </ResponsiveChartWrapper>
  ))
