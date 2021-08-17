import React from 'react'
import { storiesOf } from '@storybook/react'

import BarChart from '../../src/components/nivo/bar-chart/'
import PieChart from '../../src/components/nivo/pie-chart'
import LineChart from '../../src/components/nivo/line-chart'
import ScatterChart from '../../src/components/nivo/scatter-chart'
import barChartData from '../data/others/bar-chart-data'
import lineChartData from '../data/others/line-chart-data'
import pieChartData from '../data/others/pie-chart-data'
import scatterChartData from '../data/others/scatter-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


const title = 'My Title'
const palette = ['#F936A9', '#B54DD5', '#FF4774', '#FFA600', '#1564ec', '#FF7641', '#FFA600']

const colorsMap = {}

storiesOf('Nivo/Color', module)
  .add('Bar Chart with Color function', () => {
    const barIds = ['visits', 'visitors', 'single_visitors', 'repeat_visitors', 'repeat_visitor_rate', 'multi_visitors', 'multi_visitor_rate']
    barIds.forEach((d, i) => {
      colorsMap[d] = palette[i]
    })
    return (
      <ResponsiveChartWrapper>
        <BarChart
          title={title}
          data={barChartData}
          axisBottomLegendLabel='Address City'
          axisLeftLegendLabel='Visitors'
          groupMode='grouped'
          colors={d => colorsMap[d]}
        />
      </ResponsiveChartWrapper>
    )
  })
  .add('Pie Chart with Color function', () => {
    const pieIds = ['css', 'erlang testing', 'css1', 'elixir salak']
    pieIds.forEach((d, i) => {
      colorsMap[d] = palette[i]
    })
    return (
      <ResponsiveChartWrapper>
        <PieChart
          title={title}
          data={pieChartData}
          isDonut={false}
          colors={d => colorsMap[d.id]}
        />
      </ResponsiveChartWrapper>
    )
  })
  .add('Line Chart with Color function', () => {
    const LineIds = ['france', 'us', 'germany', 'norway']
    LineIds.forEach((d, i) => {
      colorsMap[d] = palette[i]
    })
    return (
      <ResponsiveChartWrapper>
        <LineChart
          title={title}
          data={lineChartData}
          indexBy='country'
          xKey='vehicle'
          yKeys={['amount']}
          xScale={{ type: 'point' }}
          axisBottomLegendLabel={'axisBottomLegend'}
          axisLeftLegendLabel={'axisLeftLegend'}
          colors={d => colorsMap[d.id]}
        />
      </ResponsiveChartWrapper>
    )
  })
  .add('Scatter Chart with Color function', () => {
    const scatterIds = ['Arts & Entertainment', 'Science - Technology', 'Hobbies, (Vacation)']
    scatterIds.forEach((d, i) => {
      colorsMap[d] = palette[i]
    })
    return (
      <ResponsiveChartWrapper>
        <ScatterChart
          title={title}
          data={scatterChartData}
          axisBottomLegendLabel={'axisBottomLegend'}
          axisLeftLegendLabel={'axisLeftLegend'}
          colors={d => colorsMap[d.id]}
        />
      </ResponsiveChartWrapper>
    )
  })
