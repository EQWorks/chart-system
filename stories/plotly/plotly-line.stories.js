import React from 'react'
import Line from '../../src/components/plotly/line'

import mockData from '../data/plotly/mock-data'

export default {
  title: 'Plotly/line',
}

export const NoAggregation = () =>
  <Line
    data={mockData}
    keys={['stat1', 'stat2']}
    x='age'
  />

export const ExplicitAggregateOperation = () =>
  <Line
    data={mockData}
    keys={['stat1', 'stat2']}
    agg={['mean', 'mean']}
    indexBy='age'
  />

export const DefaultAggregateOperation = () =>
  <Line
    data={mockData}
    keys={['stat1', 'stat2']}
    indexBy='stat3'
  />
