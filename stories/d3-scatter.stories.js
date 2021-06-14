import React from 'react'
import { storiesOf } from '@storybook/react'
import Scatter from '../src/components/d3-scatter'

const data = [
  {
    "x": "1",
    "y1": "0.001",
    "y2": "0.63"
  },
  {
    "x": "3",
    "y1": "0.003",
    "y2": "0.84"
  },
  {
    "x": "4",
    "y1": "0.024",
    "y2": "0.56"
  },
  {
    "x": "4.5",
    "y1": "0.054",
    "y2": "0.22"
  },
  {
    "x": "4.6",
    "y1": "0.062",
    "y2": "0.15"
  },
  {
    "x": "5",
    "y1": "0.1",
    "y2": "0.08"
  },
  {
    "x": "6",
    "y1": "0.176",
    "y2": "0.2"
  },
  {
    "x": "8",
    "y1": "0.198",
    "y2": "0.71"
  },
  {
    "x": "9",
    "y1": "0.199",
    "y2": "0.65"
  }
]

storiesOf('D3 scatter chart', module)
  .add('base', () => (
    <Scatter data={data}/>
  ))
  