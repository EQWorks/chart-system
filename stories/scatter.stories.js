import React from 'react'
import { storiesOf } from '@storybook/react'

import ScatterChart from '../src/components/scatter-chart'
import scatterChartData from './data/scatter-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


const title = 'My Title'
const palette = ['#1564ec', '#FF7641', '#FFA600', '#F936A9', '#B54DD5', '#FF4774']
const colorsMap = {}
scatterChartData.forEach((d, i) => colorsMap[d.Name] = palette[i])

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
  .add('Widget Scatter Chart with colors as function', () => (
    <ResponsiveChartWrapper>
      <ScatterChart
        title={ title }
        data={ scatterChartData }
        axisBottomLegendLabel={ 'axisBottomLegend' }
        axisLeftLegendLabel={ 'axisLeftLegend' }
        colors={(d) => colorsMap[d.serieId]}
      />
    </ResponsiveChartWrapper>
  ))
