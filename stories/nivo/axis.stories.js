import React from 'react'
import { storiesOf } from '@storybook/react'

import BarChart from '../../src/components/bar-chart/'
import barChartData from '../data/others/bar-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


const title = 'My Title'

storiesOf('Nivo/Axis', module)
  .add('No X-Axis Label Trim', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title={title}
        data={barChartData}
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
        axisBottomTrim={false}
      />
    </ResponsiveChartWrapper>
  ))
  .add('Formatted X-Axis Label', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title={title}
        data={barChartData}
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
        axisBottomLabelDisplayFn={d => d.substring(0, 2)}
      />
    </ResponsiveChartWrapper>
  ))
  .add('Formatted Y-Axis Label', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title={title}
        data={barChartData}
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
        axisLeftLabelDisplayFn={d => d + 'k'}
      />
    </ResponsiveChartWrapper>
  ))
  .add('X-Axis Order - Descending', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title={title}
        data={barChartData}
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
        axisBottomOrder='desc'
      />
    </ResponsiveChartWrapper>
  ))
  .add('X-Axis Order - Exact', () => (
    <ResponsiveChartWrapper>
      <BarChart
        title={title}
        data={barChartData}
        axisBottomLegendLabel='Address City'
        axisLeftLegendLabel='Visitors'
        groupMode='grouped'
        axisBottomOrder={['Airdrie', 'Brandon', 'Abbotsford']}
      />
    </ResponsiveChartWrapper>
  ))
