import React from 'react'
import { storiesOf } from '@storybook/react'

import ScatterChart from '../../src/components/nivo/scatter-chart'
import scatterChartData from '../data/others/scatter-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


const title = 'My Title'

storiesOf('Nivo/Typography', module)
  .add('Custom typography', () => (
    <ResponsiveChartWrapper>
      <ScatterChart
        title={title}
        typographyProps={{
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 14,
          textColor: 'red',
        }}
        data={scatterChartData}
        axisBottomLegendLabel={'axisBottomLegend'}
        axisLeftLegendLabel={'axisLeftLegend'}
      />
    </ResponsiveChartWrapper>
  ))
