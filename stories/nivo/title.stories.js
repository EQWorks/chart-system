import React from 'react'
import { storiesOf } from '@storybook/react'

import ScatterChart from '../../src/components/scatter-chart'
import scatterChartData from '../data/others/scatter-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


const title = 'My Title'

storiesOf('Nivo/Title', module)
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
        title='My very long long long long long long Title'
        data={scatterChartData}
        axisBottomLegendLabel={'axisBottomLegend'}
        axisLeftLegendLabel={'axisLeftLegend'}
      />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Scatter Chart with custom title', () => (
    <ResponsiveChartWrapper>
      <ScatterChart
        title={title}
        titleStyle={{
          color: 'red',
          fontfamily: 'Orbitron',
          fontSize: '24px',
          fontWeight: 700,
          textAlign: 'center',
        }}
        data={scatterChartData}
        axisBottomLegendLabel={'axisBottomLegend'}
        axisLeftLegendLabel={'axisLeftLegend'}
      />
    </ResponsiveChartWrapper>
  ))
