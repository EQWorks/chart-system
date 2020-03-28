import React from 'react'

import ScatterChart from '../components/scatter-chart'

import { storiesOf } from '@storybook/react'

export default {
  title: 'Scatter Chart'
}

storiesOf('ScatterChart', module)
  .add('Small ScatterChart', () => <ScatterChart wrapperWidth={320} wrapperHeight={320} />)
  .add('Small responsive ScatterChart', () => <ScatterChart wrapperWidth={400} wrapperHeight={700} />)
  .add('Medium ScatterChart', () => <ScatterChart wrapperWidth={427} wrapperHeight={320} />)
  .add('Medium responsive ScatterChart', () => <ScatterChart wrapperWidth={600} wrapperHeight={300} />)
  .add('Medium responsive ScatterChart tall container', () => <ScatterChart wrapperWidth={450} wrapperHeight={460} />)
