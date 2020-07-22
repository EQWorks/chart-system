import React from 'react'
import { storiesOf } from '@storybook/react'

import ScatterChart from '../components/scatter-chart'
import scatterChartData from '../shared/data/scatter-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


storiesOf('ScatterChart', module)
  .add('Widget Scatter Chart', () => (
    <ResponsiveChartWrapper>
      <ScatterChart
        title='My Title'
        data={scatterChartData}
        axisBottomLegendLabel={'axisBottomLegend'}
        axisLeftLegendLabel={'axisLeftLegend'}
      />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Scatter Chart with no title', () => (
    <ResponsiveChartWrapper>
      <ScatterChart
        data={scatterChartData}
        axisBottomLegendLabel={'axisBottomLegend'}
        axisLeftLegendLabel={'axisLeftLegend'}
      />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Scatter Chart with long title', () => (
    <ResponsiveChartWrapper>
      <ScatterChart
        title='My Title My Title My Title My Title'
        data={scatterChartData}
        axisBottomLegendLabel={'axisBottomLegend'}
        axisLeftLegendLabel={'axisLeftLegend'}
      />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Scatter Chart with no trimming of Legend', () => (
    <ResponsiveChartWrapper>
      <ScatterChart
        title='My Title'
        data={scatterChartData}
        axisBottomLegendLabel={'axisBottomLegend'}
        axisLeftLegendLabel={'axisLeftLegend'}
        trimLegend={false}
      />
    </ResponsiveChartWrapper>
  ))

