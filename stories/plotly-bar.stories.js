import React from 'react'
import Bar from '../src/components/plotly/bar'
import { mockData } from './data/others/mock-data'
import ParentSize from '@visx/responsive/lib/components/ParentSize'

export default {
  title: 'Plotly/bar',
}

const keyX = mockData.map(({ Name }) => Name)
const keyY = mockData.map(({ Age }) => Age)
const data = [
  {
    x: keyX,
    y: keyY,
    type: 'bar',
  }
]
export const Default = () => <Bar data={data} />

export const Responsive = () => <div style={{
  width: '100%', height: '100vh'
}}><ParentSize>{({ width, height }) => {
  return (<Bar data={data} layout={{ width: width, height: height }} config={{ displayModeBar: false }} />)
}}</ParentSize></div>
