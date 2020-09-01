import React from 'react'
import { storiesOf } from '@storybook/react'

import ScatterChart from '../src/components/scatter-chart'
import scatterChartData from './data/scatter-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


const titleProps = {
  title: 'My Title',
}

storiesOf('ScatterChart', module)
  .add('Widget Scatter Chart', () => (
    <ResponsiveChartWrapper>
      <ScatterChart
        titleProps={ titleProps }
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
        titleProps={{ title: 'My Title My Title My Title My Title' }}
        data={scatterChartData}
        axisBottomLegendLabel={'axisBottomLegend'}
        axisLeftLegendLabel={'axisLeftLegend'}
      />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Scatter Chart with custom title', () => (
    <ResponsiveChartWrapper>
      <ScatterChart
        titleProps={{
          color: 'red',
          fontWeight: 'bold',
          textAlign: 'center',
          ...titleProps,
        }}
        data={scatterChartData}
        axisBottomLegendLabel={'axisBottomLegend'}
        axisLeftLegendLabel={'axisLeftLegend'}
        trimLegend={false}
      />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Scatter Chart with no trimming of Legend', () => (
    <ResponsiveChartWrapper>
      <ScatterChart
        titleProps={ titleProps }
        data={scatterChartData}
        axisBottomLegendLabel={'axisBottomLegend'}
        axisLeftLegendLabel={'axisLeftLegend'}
        trimLegend={false}
      />
    </ResponsiveChartWrapper>
  ))

