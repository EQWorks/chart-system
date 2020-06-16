import React from 'react'
import { storiesOf } from '@storybook/react'

import ChartWrapper from '../components/chart-wrapper'
import ScatterChart from '../components/scatter-chart'
import scatterChartData from '../shared/data/scatter-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


storiesOf('ScatterChart', module)
  .add('Widget Scatter Chart', () => (
    <ResponsiveChartWrapper>
      <ChartWrapper title='My Title'>
        <ScatterChart data={scatterChartData} axisBottomLegendLabel={'axisBottomLegend'} axisLeftLegendLabel={'axisLeftLegend'} />
      </ChartWrapper>
    </ResponsiveChartWrapper>
  ))
