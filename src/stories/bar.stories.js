import React from 'react'
import { storiesOf } from '@storybook/react'

import BarChart from '../components/bar-chart/'
import barChartData from '../shared/data/bar-chart-data'
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
