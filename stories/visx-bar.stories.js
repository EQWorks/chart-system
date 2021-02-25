import React from 'react'
import Bar from '../src/components/visx/Bar'
import { mockData } from './data/mock-data'
export default {
    title: 'Visx/bar', 
}
  
const barConfig = {
    color: '#0075FF',
    dataKey: {
      x: 'Name',
      y: 'Age',
    },
    axisX: {
      axis: true,
      label: false,
    },
    axisY: {
      axis: true,
      label: true,
    },
}
  
export const Default = () => <Bar data={mockData} width={500} height={500} config={barConfig} />
