import React from 'react'
import { storiesOf } from '@storybook/react'

import ScatterChart from '../src/components/scatter-chart'
import scatterChartData from './data/scatter-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


const title = 'My Title'

storiesOf('ScatterChart', module)
  .add('Widget Scatter Chart', () => (
    <ResponsiveChartWrapper>
      <ScatterChart
        title={ title }
        data={ scatterChartData }
        axisBottomLegendLabel={ 'axisBottomLegend' }
        axisLeftLegendLabel={ 'axisLeftLegend' }
      />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Scatter Chart with no title', () => (
    <ResponsiveChartWrapper>
      <ScatterChart
        data={ scatterChartData }
        axisBottomLegendLabel={ 'axisBottomLegend' }
        axisLeftLegendLabel={ 'axisLeftLegend' }
      />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Scatter Chart with long title', () => (
    <ResponsiveChartWrapper>
      <ScatterChart
        title='My very long long long long long long Title'
        data={ scatterChartData }
        axisBottomLegendLabel={ 'axisBottomLegend' }
        axisLeftLegendLabel={ 'axisLeftLegend' }
      />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Scatter Chart with custom title', () => (
    <ResponsiveChartWrapper>
      <ScatterChart
        title={ title }
        titleStyle={{
          color: 'red',
          fontfamily: 'Orbitron',
          fontSize: '24px',
          fontWeight: 700,
          textAlign: 'center'
        }}
        data={ scatterChartData }
        axisBottomLegendLabel={ 'axisBottomLegend' }
        axisLeftLegendLabel={ 'axisLeftLegend' }
      />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Scatter Chart with custom typography', () => (
    <ResponsiveChartWrapper>
      <ScatterChart
        title={ title }
        typographyProps={{
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 14,
          textColor: 'red'
        }}
        data={ scatterChartData }
        axisBottomLegendLabel={ 'axisBottomLegend' }
        axisLeftLegendLabel={ 'axisLeftLegend' }
      />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Scatter Chart with no trimming of Legend', () => (
    <ResponsiveChartWrapper>
      <ScatterChart
        title={ title }
        data={ scatterChartData }
        axisBottomLegendLabel={ 'axisBottomLegend' }
        axisLeftLegendLabel={ 'axisLeftLegend' }
        trimLegend={ false }
      />
    </ResponsiveChartWrapper>
  ))

