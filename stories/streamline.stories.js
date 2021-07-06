import React, { useEffect, useState } from 'react'
import Streamline from '../src/components/d3/streamline'
import { ParentSize } from '@visx/responsive'
import { max } from 'd3'
export default {
  title: 'D3/Streamline',
  component: Streamline,
  args: {
    width: 1000,
    height: 300,
    color: '#500aff',
    maxThreshold: 0.8,
    minThreshold: 0.2,
    strokeWidth: 3,
    inspectionMode: true,
    isInspected: false,
  },
  argTypes: {
    width: {
      control: {
        type: 'number',
        options: [0, 1000],
      },
    },
    height: {
      control: {
        type: 'number',
        options: [0, 300],
      },
    },
    color: {
      control: {
        type: 'color',
      },
    },
    maxThreshold: {
      control: {
        type: 'number',
      }
    },
    minThreshold: {
      control: {
        type: 'number',
      }
    },
    inspectionMode: {
      control: {
        type: 'boolean',
      }
    },
    isInspected: {
      control: {
        type: 'boolean',
      }
    },
  },
}

export const Default = (args) => {
  const [data, setData] = useState([])
  const { maxThreshold: max, minThreshold: min } = args
  useEffect(() => {
    if (data.length < 50) {

      const interval = setInterval(() => {
        setData(prev => [...prev, { value: Math.random() * (max - min) + min }])
      }, 50);
      return () => clearInterval(interval)
    }
  }, [data])

  const config = {
    key: 'value',
    xAxisRange: 'auto',
    yAxisRange: [0, 1],
    style: {
      color: args.color,
      strokeWidth: args.strokeWidth,
    },
    threshold: {
      max: args.maxThreshold,
      min: args.minThreshold,
      unit: '',
    },
    inspectionMode: args.inspectionMode,
    isInspected: args.isInspected,
  }

  return <Streamline {...args} data={data} config={config} />
}
