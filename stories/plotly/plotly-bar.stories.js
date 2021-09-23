import React from 'react'
import Bar from '../../src/components/plotly/bar'

import mockData from '../data/plotly/mock-data'

export default {
  title: 'Plotly/bar',
}

export const ExplicitAggregateOperation = () =>
  <Bar
    data={mockData}
    keys={['stat1', 'stat2']}
    keysAgg={['mean', 'mean']}
    indexBy='city'
  />

export const DefaultAggregateOperation = () =>
  <Bar
    data={mockData}
    keys={['stat1', 'stat2']}
    indexBy='city'
  />
