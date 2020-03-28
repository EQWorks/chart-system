import React from 'react'

import LineChart from '../components/line-chart'

import lineChartData from '../shared/constants/line-chart-data'

import { storiesOf } from '@storybook/react'

export default {
  title: 'Line'
}

storiesOf('LineChart', module)
  .add('Small LineChart', () => <LineChart wrapperWidth={320} wrapperHeight={320} data={lineChartData} />)
  .add('Small responsive LineChart', () => <LineChart wrapperWidth={400} wrapperHeight={700} data={lineChartData} />)
  .add('Medium LineChart', () => <LineChart wrapperWidth={427} wrapperHeight={320} data={lineChartData} />)
  .add('Medium responsive LineChart', () => <LineChart wrapperWidth={600} wrapperHeight={300} data={lineChartData} />)
  .add('Medium responsive LineChart tall container', () => <LineChart wrapperWidth={450} wrapperHeight={460} data={lineChartData} />)
  .add('Large LineChart', () => <LineChart wrapperWidth={656} wrapperHeight={320} data={lineChartData} />)
  .add('Large responsive LineChart', () => <LineChart wrapperWidth={656} wrapperHeight={400} data={lineChartData} />)
  .add('Large responsive LineChart tall container', () => <LineChart wrapperWidth={656} wrapperHeight={800} data={lineChartData} />)
