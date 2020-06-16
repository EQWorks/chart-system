import React from 'react'
import { storiesOf } from '@storybook/react'

import ScatterChart from '../components/scatter-chart'
import scatterChartData from '../shared/data/scatter-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


storiesOf('ScatterChart', module)
  .add('Widget Scatter Chart', () => (
    <ResponsiveChartWrapper>
      <ScatterChart data={scatterChartData} axisBottomLegendLabel={'axisBottomLegend'} axisLeftLegendLabel={'axisLeftLegend'}></ScatterChart>
    </ResponsiveChartWrapper>
  ))
