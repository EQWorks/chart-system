import React from 'react'
import Recharts from '../components/recharts/recharts-example'
import { animals } from '../constants/recharts-data'

export default {
  component: Recharts,
  title: 'Recharts',
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
