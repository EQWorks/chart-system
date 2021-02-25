import React from 'react'
import Pie from '../src/components/visx/Pie'
import { mockData2 } from './data/mock-data'

export default {
    title: 'Visx/pie', 
}
  
const pieConfig = {
    colorRange:  ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
    dataKey: {
      item: 'item',
      value: 'percentage',
    },
    displayValue: true,
}

export const Default = () => <Pie data={mockData2} width={500} height={500} config={pieConfig} />
