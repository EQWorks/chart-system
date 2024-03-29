import React from 'react'
import GaugeArc from '../../src/components/d3/gauge-arc'
import { geoCohortData } from '../data/atom/geo-cohort'

export default {
  title: 'D3/GaugeArc',
  component: GaugeArc,
  args: {
    width: 300,
    height: 300,
    data: geoCohortData.aggregated.GeoCohortListID[0],
    color: '#0075FF',
    backgroundColor: '#cdcdcd',
    valueKey: 'Imps',
    remainderKey: 'Bids',
    animation: true,
    duration: 1000,
  },
  argTypes: {
    width: {
      control: {
        type: 'number',
        options: [0, 500],
      },
    },
    height: {
      control: {
        type: 'number',
        options: [0, 500],
      },
    },
    color: {
      control: {
        type: 'color',
      },
    },
    backgroundColor: {
      control: {
        type: 'color',
      },
    },
    valueKey: {
      control: {
        type: 'select',
        options: ['Bids', 'Imps', 'Clicks'],
      },
    },
    remainderKey: {
      control: {
        type: 'select',
        options: ['Bids', 'Imps', 'Clicks'],
      },
    },
    animation: {
      control: {
        type: 'boolean',
        defaultValue: true,
      },
    },
    duration: {
      control: {
        type: 'number',
      },
    },
  },
}

export const Default = (args) => {
  const config = {
    color: args.color,
    backgroundColor: args.backgroundColor,
    dataKey: {
      x1: args.valueKey,
      x2: args.remainderKey,
    },
    transition: {
      animation: args.animation,
      duration: args.duration,
    }
  }
  return <GaugeArc {...args} config={config} />
}

