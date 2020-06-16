import React from 'react'

import Recharts from '../components/recharts/recharts-example'

import { animals } from '../shared/data/recharts-data'

export default {
  title: 'Recharts',
  component: Recharts,
}

export const Basic = () => (
  <Recharts
    chartTitle='Awesome Animals'
    categoryAxisTitle='Animal'
    chartData={animals}
    type='bar'
    layout='horizontal'
    category='name'
    dataSets={[{ dataKey: 'awesomeness', palette: ['#FF0000'] }]}
    exploreCategory
    exploreValue
  />
)
