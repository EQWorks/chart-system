import React from 'react'
import { storiesOf } from '@storybook/react'

import ScatterChart from '../../src/components/nivo/scatter-chart'
import scatterChartData from '../data/others/scatter-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


const title = 'My Title'

storiesOf('Nivo/ScatterChart', module)
  .add('Scatter Chart', () => (
    <ResponsiveChartWrapper>
      <ScatterChart
        title={title}
        data={scatterChartData}
        axisBottomLegendLabel={'axisBottomLegend'}
        axisLeftLegendLabel={'axisLeftLegend'}
      />
    </ResponsiveChartWrapper>
  ))
